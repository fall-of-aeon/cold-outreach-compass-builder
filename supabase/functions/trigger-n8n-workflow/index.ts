
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

    // Get campaign with n8n webhook URL from database
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('n8n_webhook_url')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign?.n8n_webhook_url) {
      console.error("Campaign not found or missing webhook URL:", campaignError);
      return new Response(
        JSON.stringify({ error: "Campaign not found or missing webhook URL" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Prepare payload for n8n
    const n8nPayload = {
      timestamp: new Date().toISOString(),
      campaignId: campaignId,
      campaignData: campaignData,
      source: "lovable-campaign-wizard-secure",
      version: "2.0"
    };

    console.log("Sending payload to n8n:", campaign.n8n_webhook_url);

    // Trigger n8n webhook
    const n8nResponse = await fetch(campaign.n8n_webhook_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload),
    });

    // Log workflow event
    await supabase.rpc('log_workflow_event', {
      p_campaign_id: campaignId,
      p_event_type: 'workflow_triggered',
      p_step_name: 'n8n_webhook',
      p_message: `n8n workflow triggered via webhook`,
      p_data: { webhook_url: campaign.n8n_webhook_url, response_status: n8nResponse.status }
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
    console.error("Error in trigger-n8n-workflow:", error);
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
