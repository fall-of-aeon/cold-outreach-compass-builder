export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          airtable_search_id: string | null
          chat_session_id: string | null
          company_size: string | null
          created_at: string | null
          emails_opened: number | null
          emails_replied: number | null
          emails_sent: number | null
          id: string
          industry: string | null
          location: string | null
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
          chat_session_id?: string | null
          company_size?: string | null
          created_at?: string | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          industry?: string | null
          location?: string | null
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
          chat_session_id?: string | null
          company_size?: string | null
          created_at?: string | null
          emails_opened?: number | null
          emails_replied?: number | null
          emails_sent?: number | null
          id?: string
          industry?: string | null
          location?: string | null
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
      chat_messages: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          message: string
          message_order: number
          metadata: Json | null
          sender: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          message: string
          message_order?: number
          metadata?: Json | null
          sender: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          message?: string
          message_order?: number
          metadata?: Json | null
          sender?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
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
      get_chat_history: {
        Args: { p_session_id: string }
        Returns: {
          message_id: string
          sender: string
          message: string
          created_at: string
          metadata: Json
          message_order: number
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      log_chat_message: {
        Args: {
          p_campaign_id: string
          p_session_id: string
          p_message: string
          p_sender: string
          p_metadata?: Json
        }
        Returns: string
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
      update_campaign_session: {
        Args: { p_campaign_id: string; p_session_id: string }
        Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
