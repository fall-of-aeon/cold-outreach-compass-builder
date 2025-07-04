
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface N8nPayload {
  campaignId: string;
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

    const { campaignId, campaignData }: N8nPayload = await req.json();

    console.log("🚀 Triggering n8n workflow for campaign:", campaignId);
    console.log("📊 Campaign data:", {
      name: campaignData.name,
      location: campaignData.location,
      industry: campaignData.industry,
      seniority: campaignData.seniority,
      companySize: campaignData.companySize
    });

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

    // Prepare payload for n8n
    const n8nPayload = {
      timestamp: new Date().toISOString(),
      campaignId: campaignId,
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

    console.log("📤 Sending payload to n8n webhook...");

    // Trigger n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
      console.log(`📋 n8n response:`, responseData);

      // Log successful workflow trigger
      await supabase.rpc('log_workflow_event', {
        p_campaign_id: campaignId,
        p_event_type: 'workflow_triggered',
        p_step_name: 'n8n_webhook',
        p_message: `n8n workflow triggered successfully`,
        p_data: { 
          response_status: n8nResponse.status,
          webhook_response: responseData.substring(0, 500) // Limit response data
        }
      });

      // Update campaign status
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

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "n8n workflow triggered successfully",
          campaignId: campaignId,
          webhookStatus: n8nResponse.status
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
