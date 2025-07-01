
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

    console.log("Triggering n8n workflow for campaign:", campaignId);

    // Get webhook URL from environment variable (not from campaign data)
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (!n8nWebhookUrl) {
      console.error("N8N_WEBHOOK_URL not configured in environment");
      return new Response(
        JSON.stringify({ error: "N8N_WEBHOOK_URL not configured in environment" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

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

    // 🔒 SECURITY FIX: Never log the webhook URL
    console.log("Sending payload to n8n webhook (URL hidden for security)");

    // Trigger n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!n8nResponse.ok) {
      // 🔒 SECURITY FIX: Don't expose webhook URL in error messages
      console.error(`n8n webhook failed with status: ${n8nResponse.status}`);
      throw new Error(`n8n webhook failed: ${n8nResponse.status}`);
    }

    console.log(`n8n webhook successful: ${n8nResponse.status}`);

    // Log workflow event
    await supabase.rpc('log_workflow_event', {
      p_campaign_id: campaignId,
      p_event_type: 'workflow_triggered',
      p_step_name: 'n8n_webhook',
      p_message: `n8n workflow triggered via webhook`,
      p_data: { response_status: n8nResponse.status }
    });

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({ 
        status: 'processing',
        workflow_started_at: new Date().toISOString(),
        workflow_step: 'lead_discovery'
      })
      .eq('id', campaignId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "n8n workflow triggered successfully",
        campaignId: campaignId
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Error in trigger-n8n-workflow:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
