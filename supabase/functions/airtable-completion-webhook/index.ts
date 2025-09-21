import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Rate limiting function
async function checkRateLimit(supabase: any, identifier: string, endpoint: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_endpoint: endpoint,
      p_max_requests: 20, // 20 requests per hour for webhooks
      p_window_minutes: 60
    });
    
    if (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow request if rate limit check fails
    }
    
    return data === true;
  } catch (error) {
    console.error('Rate limit error:', error);
    return true; // Allow request if rate limit check fails
  }
}

// Input validation and sanitization
function validateAndSanitizePayload(payload: any): { isValid: boolean; sanitized?: any; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Invalid payload format' };
  }

  // Validate required fields
  if (!payload.campaignId || typeof payload.campaignId !== 'string') {
    return { isValid: false, error: 'Invalid campaignId' };
  }

  if (!payload.status || !['enrichment_complete', 'failed'].includes(payload.status)) {
    return { isValid: false, error: 'Invalid status' };
  }

  // UUID validation
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(payload.campaignId)) {
    return { isValid: false, error: 'Invalid campaignId format' };
  }

  // Sanitize and validate optional fields
  const sanitized: any = {
    campaignId: payload.campaignId,
    status: payload.status
  };

  if (payload.airtableSearchId && typeof payload.airtableSearchId === 'string') {
    sanitized.airtableSearchId = payload.airtableSearchId.substring(0, 100);
  }

  if (payload.totalLeadsFound !== undefined) {
    const leads = Number(payload.totalLeadsFound);
    if (isNaN(leads) || leads < 0 || leads > 100000) {
      return { isValid: false, error: 'Invalid totalLeadsFound' };
    }
    sanitized.totalLeadsFound = leads;
  }

  if (payload.qualifiedLeads !== undefined) {
    const qualified = Number(payload.qualifiedLeads);
    if (isNaN(qualified) || qualified < 0 || qualified > 100000) {
      return { isValid: false, error: 'Invalid qualifiedLeads' };
    }
    sanitized.qualifiedLeads = qualified;
  }

  if (payload.enrichmentSummary && typeof payload.enrichmentSummary === 'object') {
    sanitized.enrichmentSummary = {
      processingTimeMinutes: Number(payload.enrichmentSummary.processingTimeMinutes) || 0,
      enrichmentStepsCompleted: Array.isArray(payload.enrichmentSummary.enrichmentStepsCompleted) 
        ? payload.enrichmentSummary.enrichmentStepsCompleted.slice(0, 10)
        : [],
      leadVerificationRate: Number(payload.enrichmentSummary.leadVerificationRate) || 0,
      avgLeadScore: Number(payload.enrichmentSummary.avgLeadScore) || 0
    };
  }

  return { isValid: true, sanitized };
}

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

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Check rate limit
    const rateLimitPassed = await checkRateLimit(supabase, clientIP, 'airtable-completion-webhook');
    if (!rateLimitPassed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '3600' },
      });
    }

    // Parse and validate payload
    const rawPayload = await req.json();
    const validation = validateAndSanitizePayload(rawPayload);
    
    if (!validation.isValid) {
      console.warn('Invalid payload received:', validation.error);
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload = validation.sanitized;
    console.log('Received completion webhook for campaign:', payload.campaignId);

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