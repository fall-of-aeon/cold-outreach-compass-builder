export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaigns: {
        Row: {
          airtable_search_id: string | null
          company_size: string | null
          created_at: string | null
          emails_opened: number | null
          emails_replied: number | null
          emails_sent: number | null
          id: string
          industry: string | null
          location: string | null
          n8n_webhook_url: string | null
          name: string
          open_rate: number | null
          prospect_description: string | null
          qualified_leads: number | null
          reply_rate: number | null
          seniority: string | null
          smartlead_campaign_id: string | null
          status: string
          total_leads_found: number | null
          updated_at: string | null
          workflow_completed_at: string | null
          workflow_progress: number | null
          workflow_started_at: string | null
          workflow_step: string | null
        }
        Insert: {
          airtable_search_id?: string | null
          company_size?: string | null
          created_at?: string | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          n8n_webhook_url?: string | null
          name: string
          open_rate?: number | null
          prospect_description?: string | null
          qualified_leads?: number | null
          reply_rate?: number | null
          seniority?: string | null
          smartlead_campaign_id?: string | null
          status?: string
          total_leads_found?: number | null
          updated_at?: string | null
          workflow_completed_at?: string | null
          workflow_progress?: number | null
          workflow_started_at?: string | null
          workflow_step?: string | null
        }
        Update: {
          airtable_search_id?: string | null
          company_size?: string | null
          created_at?: string | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          n8n_webhook_url?: string | null
          name?: string
          open_rate?: number | null
          prospect_description?: string | null
          qualified_leads?: number | null
          reply_rate?: number | null
          seniority?: string | null
          smartlead_campaign_id?: string | null
          status?: string
          total_leads_found?: number | null
          updated_at?: string | null
          workflow_completed_at?: string | null
          workflow_progress?: number | null
          workflow_started_at?: string | null
          workflow_step?: string | null
        }
        Relationships: []
      }
      dashboard_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          data: Json
          expires_at: string
          id: string
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          data: Json
          expires_at: string
          id?: string
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          data?: Json
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      workflow_events: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          data: Json | null
          event_type: string
          id: string
          message: string | null
          step_name: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          data?: Json | null
          event_type: string
          id?: string
          message?: string | null
          step_name?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          data?: Json | null
          event_type?: string
          id?: string
          message?: string | null
          step_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      log_workflow_event: {
        Args: {
          p_campaign_id: string
          p_event_type: string
          p_step_name?: string
          p_message?: string
          p_data?: Json
        }
        Returns: string
      }
      update_campaign_progress: {
        Args: {
          p_campaign_id: string
          p_step: string
          p_progress: number
          p_data?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
