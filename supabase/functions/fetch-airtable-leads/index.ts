import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AirtableRecord {
  id: string;
  fields: {
    Name?: string;
    Title?: string;
    Company?: string;
    Email?: string;
    'LinkedIn Profile'?: string;
    'Company Website'?: string;
    'AI Score'?: number;
    'Email Verification'?: string;
    'Web Search Report'?: string;
    'LinkedIn Profile Analysis'?: string;
    'Company Analysis'?: string;
    'Generated Email Subject'?: string;
    'Generated Email Body'?: string;
    Location?: string;
    Industry?: string;
    'Company Size'?: string;
    Status?: string;
  };
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const campaignId = url.searchParams.get('campaignId');
    const offset = url.searchParams.get('offset');
    
    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: 'Campaign ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const airtableApiKey = Deno.env.get('AIRTABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!airtableApiKey) {
      return new Response(
        JSON.stringify({ error: 'Airtable API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get campaign details from Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('airtable_search_id, name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign?.airtable_search_id) {
      return new Response(
        JSON.stringify({ error: 'Campaign not found or no Airtable data available' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch leads from Airtable
    let airtableUrl = `https://api.airtable.com/v0/appYourBaseId/apify%20scraped%20leads?filterByFormula={Campaign ID}="${campaign.airtable_search_id}"`;
    if (offset) {
      airtableUrl += `&offset=${offset}`;
    }

    const airtableResponse = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!airtableResponse.ok) {
      console.error('Airtable API error:', await airtableResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to fetch leads from Airtable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const airtableData: AirtableResponse = await airtableResponse.json();

    // Transform Airtable records to our format
    const leads = airtableData.records.map(record => ({
      id: record.id,
      name: record.fields.Name || '',
      title: record.fields.Title || '',
      company: record.fields.Company || '',
      email: record.fields.Email || '',
      linkedinProfile: record.fields['LinkedIn Profile'] || '',
      companyWebsite: record.fields['Company Website'] || '',
      score: record.fields['AI Score'] || 0,
      emailVerification: record.fields['Email Verification'] || 'unknown',
      webSearchReport: record.fields['Web Search Report'] || '',
      linkedinAnalysis: record.fields['LinkedIn Profile Analysis'] || '',
      companyAnalysis: record.fields['Company Analysis'] || '',
      generatedEmailSubject: record.fields['Generated Email Subject'] || '',
      generatedEmailBody: record.fields['Generated Email Body'] || '',
      location: record.fields.Location || '',
      industry: record.fields.Industry || '',
      companySize: record.fields['Company Size'] || '',
      status: record.fields.Status || 'pending',
    }));

    const response = {
      leads,
      hasMore: !!airtableData.offset,
      offset: airtableData.offset,
      total: leads.length,
    };

    console.log(`Fetched ${leads.length} leads for campaign ${campaignId}`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-airtable-leads function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});