export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      companions: {
        Row: {
          active: boolean
          bio: string | null
          city: string
          created_at: string
          id: string
          languages: string[] | null
          rating: number | null
          verified: boolean
        }
        Insert: {
          active?: boolean
          bio?: string | null
          city: string
          created_at?: string
          id: string
          languages?: string[] | null
          rating?: number | null
          verified?: boolean
        }
        Update: {
          active?: boolean
          bio?: string | null
          city?: string
          created_at?: string
          id?: string
          languages?: string[] | null
          rating?: number | null
          verified?: boolean
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          loved_one_id: string
          phone: string
          relationship: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          loved_one_id: string
          phone: string
          relationship?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          loved_one_id?: string
          phone?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_loved_one_id_fkey"
            columns: ["loved_one_id"]
            isOneToOne: false
            referencedRelation: "loved_ones"
            referencedColumns: ["id"]
          },
        ]
      }
      loved_ones: {
        Row: {
          address: string | null
          age: number | null
          city: string
          created_at: string
          customer_id: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          relationship: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          city: string
          created_at?: string
          customer_id: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          city?: string
          created_at?: string
          customer_id?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          relationship?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          companion_id: string
          created_at: string
          flags: string | null
          id: string
          photo_urls: string[] | null
          summary: string
          visit_id: string
          wellbeing_score: number | null
        }
        Insert: {
          companion_id: string
          created_at?: string
          flags?: string | null
          id?: string
          photo_urls?: string[] | null
          summary: string
          visit_id: string
          wellbeing_score?: number | null
        }
        Update: {
          companion_id?: string
          created_at?: string
          flags?: string | null
          id?: string
          photo_urls?: string[] | null
          summary?: string
          visit_id?: string
          wellbeing_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          companion_id: string | null
          completed_at: string | null
          created_at: string
          customer_id: string
          id: string
          loved_one_id: string
          scheduled_at: string | null
          special_requests: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["visit_status"]
          updated_at: string
          visit_type: Database["public"]["Enums"]["visit_type"]
        }
        Insert: {
          companion_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id: string
          id?: string
          loved_one_id: string
          scheduled_at?: string | null
          special_requests?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
          visit_type?: Database["public"]["Enums"]["visit_type"]
        }
        Update: {
          companion_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          loved_one_id?: string
          scheduled_at?: string | null
          special_requests?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
          visit_type?: Database["public"]["Enums"]["visit_type"]
        }
        Relationships: [
          {
            foreignKeyName: "visits_loved_one_id_fkey"
            columns: ["loved_one_id"]
            isOneToOne: false
            referencedRelation: "loved_ones"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          loved_one_city: string
          status: string
          support_required: string | null
          whatsapp: string
        }
        Insert: {
          country: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          loved_one_city: string
          status?: string
          support_required?: string | null
          whatsapp: string
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          loved_one_city?: string
          status?: string
          support_required?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      whatsapp_deliveries: {
        Row: {
          body: string
          created_at: string
          direction: string
          error: string | null
          id: string
          recipient: string
          status: string
          twilio_sid: string | null
          visit_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          direction: string
          error?: string | null
          id?: string
          recipient: string
          status: string
          twilio_sid?: string | null
          visit_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          direction?: string
          error?: string | null
          id?: string
          recipient?: string
          status?: string
          twilio_sid?: string | null
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_deliveries_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "companion" | "admin"
      visit_status:
        | "requested"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      visit_type:
        | "companion_visit"
        | "hospital_companion"
        | "emergency_visit"
        | "other"
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
    Enums: {
      app_role: ["customer", "companion", "admin"],
      visit_status: [
        "requested",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      visit_type: [
        "companion_visit",
        "hospital_companion",
        "emergency_visit",
        "other",
      ],
    },
  },
} as const
