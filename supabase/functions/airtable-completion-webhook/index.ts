import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompletionPayload {
  campaignId: string;
  status: 'enrichment_complete' | 'failed';
  airtableSearchId?: string;
  totalLeadsFound?: number;
  qualifiedLeads?: number;
  enrichmentSummary?: {
    processingTimeMinutes: number;
    enrichmentStepsCompleted: string[];
    leadVerificationRate: number;
    avgLeadScore: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: CompletionPayload = await req.json();
    console.log('Received completion webhook:', payload);

    // Validate required fields
    if (!payload.campaignId || !payload.status) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: campaignId and status' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name, status')
      .eq('id', payload.campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error('Campaign not found:', campaignError);
      return new Response(JSON.stringify({ error: 'Campaign not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update campaign status and completion data
    const updateData: any = {
      status: payload.status,
      workflow_completed_at: new Date().toISOString(),
      workflow_step: payload.status === 'enrichment_complete' ? 'completed' : 'failed',
      workflow_progress: 100,
      updated_at: new Date().toISOString()
    };

    if (payload.airtableSearchId) {
      updateData.airtable_search_id = payload.airtableSearchId;
    }
    if (payload.totalLeadsFound !== undefined) {
      updateData.total_leads_found = payload.totalLeadsFound;
    }
    if (payload.qualifiedLeads !== undefined) {
      updateData.qualified_leads = payload.qualifiedLeads;
    }

    const { error: updateError } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', payload.campaignId);

    if (updateError) {
      console.error('Error updating campaign:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update campaign' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log workflow event
    const eventMessage = payload.status === 'enrichment_complete' 
      ? `Enrichment completed successfully. Found ${payload.totalLeadsFound || 0} leads, ${payload.qualifiedLeads || 0} qualified.`
      : 'Enrichment process failed';

    const eventData = {
      airtableSearchId: payload.airtableSearchId,
      totalLeadsFound: payload.totalLeadsFound,
      qualifiedLeads: payload.qualifiedLeads,
      enrichmentSummary: payload.enrichmentSummary
    };

    const { error: logError } = await supabase.rpc('log_workflow_event', {
      p_campaign_id: payload.campaignId,
      p_event_type: payload.status === 'enrichment_complete' ? 'enrichment_completed' : 'enrichment_failed',
      p_step_name: 'airtable_enrichment',
      p_message: eventMessage,
      p_data: eventData
    });

    if (logError) {
      console.error('Error logging workflow event:', logError);
      // Don't fail the request for logging errors
    }

    console.log(`Campaign ${payload.campaignId} status updated to ${payload.status}`);

    return new Response(JSON.stringify({
      success: true,
      campaignId: payload.campaignId,
      status: payload.status,
      message: eventMessage,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in airtable-completion-webhook:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});