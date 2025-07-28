
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface N8nPayload {
  campaignId: string;
  messageType?: string;
  chatData?: {
    sessionId: string;
    message: string;
    metadata: Record<string, any>;
    isNewSession: boolean;
  };
  campaignData: {
    name: string;
    location: string;
    industry: string;
    seniority: string;
    companySize: string;
    prospectDescription?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { campaignId, messageType, chatData, campaignData }: N8nPayload = await req.json();

    console.log("🚀 Triggering n8n workflow for campaign:", campaignId);
    console.log("📊 Message type:", messageType);

    // Get webhook URL from environment variable
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!n8nWebhookUrl) {
      console.error("❌ N8N_WEBHOOK_URL not configured in environment");
      return new Response(
        JSON.stringify({ 
          error: "N8N_WEBHOOK_URL not configured in environment",
          success: false 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("🔗 Using n8n webhook (URL configured)");

    // Prepare payload for n8n - different structure for chat messages
    let n8nPayload;
    
    if (messageType === "chat_message") {
      n8nPayload = {
        sessionId: chatData?.sessionId,
        message: chatData?.message,
        isNewSession: chatData?.isNewSession,
        campaignData: {
          id: campaignId,
          name: campaignData.name,
          location: campaignData.location,
          industry: campaignData.industry,
          seniority: campaignData.seniority,
          companySize: campaignData.companySize,
          prospectDescription: campaignData.prospectDescription || ""
        },
        timestamp: new Date().toISOString(),
        source: "lovable-chat-interface"
      };
    } else {
      n8nPayload = {
        timestamp: new Date().toISOString(),
        campaignId: campaignId,
        messageType: messageType || "campaign_trigger",
        chatData: chatData || null,
        campaignData: {
          id: campaignId,
          name: campaignData.name,
          location: campaignData.location,
          industry: campaignData.industry,
          seniority: campaignData.seniority,
          companySize: campaignData.companySize,
          prospectDescription: campaignData.prospectDescription || ""
        },
        source: "lovable-campaign-wizard-secure",
        version: "2.0"
      };
    }

    console.log("📤 Sending payload to n8n webhook...");
    if (messageType === "chat_message") {
      console.log("💬 Chat message data:", {
        sessionId: chatData?.sessionId,
        messageLength: chatData?.message?.length,
        isNewSession: chatData?.isNewSession
      });
    }

    // Trigger n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for chat responses

    try {
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Supabase-Edge-Function/1.0",
        },
        body: JSON.stringify(n8nPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📨 n8n webhook response status: ${n8nResponse.status}`);

      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text().catch(() => "Unknown error");
        console.error(`❌ n8n webhook failed with status: ${n8nResponse.status}, error: ${errorText}`);
        
        // Log the failure but don't completely fail the campaign creation
        await supabase.rpc('log_workflow_event', {
          p_campaign_id: campaignId,
          p_event_type: 'webhook_failed',
          p_step_name: 'n8n_webhook',
          p_message: `n8n webhook failed with status: ${n8nResponse.status}`,
          p_data: { response_status: n8nResponse.status, error: errorText }
        });

        return new Response(
          JSON.stringify({ 
            error: `n8n webhook failed: ${n8nResponse.status}`,
            success: false,
            webhookStatus: n8nResponse.status
          }),
          { 
            status: 500, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }

      const responseData = await n8nResponse.text();
      console.log(`✅ n8n webhook successful: ${n8nResponse.status}`);
      console.log(`📋 n8n response:`, responseData.substring(0, 200) + "...");
      
      // Enhanced debugging as suggested
      console.log("🔍 FULL n8n response:", responseData);
      console.log("🔍 Response length:", responseData.length);

      // Try to parse response as JSON to extract AI response for chat messages
      let parsedResponse;
      let aiResponse = null;
      
      try {
        parsedResponse = JSON.parse(responseData);
        console.log("✅ Parsed JSON:", parsedResponse);
        // Look for AI response in various possible fields
        aiResponse = parsedResponse.aiResponse || 
                   parsedResponse.response || 
                   parsedResponse.message || 
                   parsedResponse.reply;
        console.log("🤖 Extracted AI response:", aiResponse);
      } catch (parseError) {
        console.log("❌ JSON parse failed:", parseError.message);
        console.log("Response is not JSON, treating as plain text");
        // If it's not JSON, treat the whole response as the AI response for chat messages
        if (messageType === "chat_message") {
          aiResponse = responseData;
          console.log("🤖 Using full response as AI response:", aiResponse);
        }
      }

      // Store chat messages in database after successful n8n response
      if (messageType === "chat_message" && aiResponse && chatData) {
        try {
          // Store user message
          await supabase.rpc('log_chat_message', {
            p_campaign_id: campaignId,
            p_session_id: chatData.sessionId,
            p_message: chatData.message,
            p_sender: 'user'
          });
          
          // Store AI response
          await supabase.rpc('log_chat_message', {
            p_campaign_id: campaignId,
            p_session_id: chatData.sessionId,
            p_message: aiResponse,
            p_sender: 'assistant'
          });
          
          console.log("✅ Chat messages stored successfully");
        } catch (dbError) {
          console.error("❌ Failed to store chat messages:", dbError);
          // Don't fail the entire request if chat storage fails
        }
      }

      // Log successful workflow trigger
      await supabase.rpc('log_workflow_event', {
        p_campaign_id: campaignId,
        p_event_type: messageType === "chat_message" ? 'chat_message_processed' : 'workflow_triggered',
        p_step_name: 'n8n_webhook',
        p_message: messageType === "chat_message" ? 'Chat message processed by n8n' : 'n8n workflow triggered successfully',
        p_data: { 
          response_status: n8nResponse.status,
          webhook_response: responseData.substring(0, 500), // Limit response data
          messageType: messageType
        }
      });

      // Update campaign status for non-chat messages
      if (messageType !== "chat_message") {
        const { error: updateError } = await supabase
          .from('campaigns')
          .update({ 
            status: 'processing',
            workflow_started_at: new Date().toISOString(),
            workflow_step: 'lead_discovery'
          })
          .eq('id', campaignId);

        if (updateError) {
          console.error("❌ Failed to update campaign status:", updateError);
        } else {
          console.log("✅ Campaign status updated to 'processing'");
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: messageType === "chat_message" ? "Chat message processed" : "n8n workflow triggered successfully",
          campaignId: campaignId,
          webhookStatus: n8nResponse.status,
          aiResponse: aiResponse, // Include AI response for chat messages
          response: aiResponse // Also include as 'response' for backward compatibility
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error("❌ n8n webhook request timed out");
        return new Response(
          JSON.stringify({ 
            error: "n8n webhook request timed out",
            success: false 
          }),
          { status: 408, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.error("❌ Network error calling n8n webhook:", fetchError.message);
      return new Response(
        JSON.stringify({ 
          error: `Network error: ${fetchError.message}`,
          success: false 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

  } catch (error: any) {
    console.error("❌ Error in trigger-n8n-workflow:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
