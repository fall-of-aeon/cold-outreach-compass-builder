import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AirtableLead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  linkedinProfile: string;
  companyWebsite: string;
  score: number;
  emailVerification: string;
  webSearchReport: string;
  linkedinAnalysis: string;
  companyAnalysis: string;
  generatedEmailSubject: string;
  generatedEmailBody: string;
  location: string;
  industry: string;
  companySize: string;
  status: string;
}

interface AirtableLeadsResponse {
  leads: AirtableLead[];
  hasMore: boolean;
  offset?: string;
  total: number;
}

export const useAirtableLeads = (campaignId: string | undefined) => {
  return useQuery({
    queryKey: ['airtable-leads', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');

      const { data, error } = await supabase.functions.invoke('fetch-airtable-leads', {
        body: { campaignId },
      });

      if (error) throw error;
      return data as AirtableLeadsResponse;
    },
    enabled: !!campaignId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
