

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Type aliases from your existing database schema
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignInsert = Database['public']['Tables']['campaigns']['Insert'];
export type CampaignUpdate = Database['public']['Tables']['campaigns']['Update'];
export type WorkflowEvent = Database['public']['Tables']['workflow_events']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalLeadsFound: number;
  qualifiedLeads: number;
  totalEmailsSent: number;
  avgOpenRate: number;
  avgReplyRate: number;
  lastUpdated: string;
}

// Legacy Campaign interface for CampaignMonitor compatibility
export interface LegacyCampaign {
  id: number;
  name: string;
  status: string;
  sent: number;
  total: number;
  responses: number;
  openRate: number;
  created: string;
}

// Interface for chat history response - matches the database function return
export interface ChatHistoryMessage {
  message_id: string;
  sender: string;
  message: string;
  created_at: string;
  metadata: any;
  message_order: number;
}

export class SupabaseService {
  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('campaigns').select('count');
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // Get dashboard stats
  static async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    
    if (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
    
    return data as unknown as DashboardStats;
  }

  // Get all campaigns
  static async getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }

    return data || [];
  }

  // Get single campaign
  static async getCampaign(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching campaign:', error);
      throw new Error(`Failed to fetch campaign: ${error.message}`);
    }

    return data;
  }

  // Create campaign (without n8n_webhook_url)
  static async createCampaign(campaignData: {
    name: string;
    location?: string;
    industry?: string;
    seniority?: string;
    company_size?: string;
    prospect_description?: string;
  }): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        ...campaignData,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      throw new Error(`Failed to create campaign: ${error.message}`);
    }

    return data;
  }

  // Update campaign status
  static async updateCampaignStatus(id: string, status: string): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign status:', error);
      throw new Error(`Failed to update campaign status: ${error.message}`);
    }

    return data;
  }

  // Delete campaign
  static async deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting campaign:', error);
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  // Update campaign metrics (called by n8n webhooks)
  static async updateCampaignMetrics(id: string, metrics: {
    total_leads_found?: number;
    qualified_leads?: number;
    emails_sent?: number;
    emails_opened?: number;
    emails_replied?: number;
    open_rate?: number;
    reply_rate?: number;
  }): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(metrics)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign metrics:', error);
      throw new Error(`Failed to update campaign metrics: ${error.message}`);
    }

    return data;
  }

  // Convert Supabase Campaign to Legacy Campaign for CampaignMonitor
  static convertToLegacyCampaign(campaign: Campaign): LegacyCampaign {
    return {
      id: parseInt(campaign.id.slice(-8), 16), // Convert UUID to number for legacy compatibility
      name: campaign.name,
      status: campaign.status,
      sent: campaign.emails_sent || 0,
      total: campaign.total_leads_found || 0,
      responses: campaign.emails_replied || 0,
      openRate: Number(campaign.open_rate) || 0,
      created: campaign.created_at || new Date().toISOString()
    };
  }

  // Chat message functions
  static async logChatMessage(
    campaignId: string,
    sessionId: string,
    message: string,
    sender: 'user' | 'assistant',
    metadata?: Record<string, any>
  ): Promise<string> {
    const { data, error } = await supabase.rpc('log_chat_message', {
      p_campaign_id: campaignId,
      p_session_id: sessionId,
      p_message: message,
      p_sender: sender,
      p_metadata: metadata || {}
    });

    if (error) {
      console.error('Error logging chat message:', error);
      throw new Error(`Failed to log chat message: ${error.message}`);
    }

    return data;
  }

  static async getChatHistory(sessionId: string): Promise<ChatHistoryMessage[]> {
    const { data, error } = await supabase.rpc('get_chat_history', {
      p_session_id: sessionId
    });

    if (error) {
      console.error('Error fetching chat history:', error);
      throw new Error(`Failed to fetch chat history: ${error.message}`);
    }

    return data || [];
  }

  static async updateCampaignSession(campaignId: string, sessionId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('update_campaign_session', {
      p_campaign_id: campaignId,
      p_session_id: sessionId
    });

    if (error) {
      console.error('Error updating campaign session:', error);
      throw new Error(`Failed to update campaign session: ${error.message}`);
    }

    return data;
  }
}

