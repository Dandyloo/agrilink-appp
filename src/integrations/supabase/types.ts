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
      credit_applications: {
        Row: {
          amount: number
          buyer_name: string | null
          created_at: string
          crop_type: string | null
          delivery_date: string | null
          farmer_id: string
          id: string
          notes: string | null
          status: string
          type: string
        }
        Insert: {
          amount: number
          buyer_name?: string | null
          created_at?: string
          crop_type?: string | null
          delivery_date?: string | null
          farmer_id: string
          id?: string
          notes?: string | null
          status?: string
          type: string
        }
        Update: {
          amount?: number
          buyer_name?: string | null
          created_at?: string
          crop_type?: string | null
          delivery_date?: string | null
          farmer_id?: string
          id?: string
          notes?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_applications_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_read: boolean
          kind: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          kind?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean
          kind?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          escrow_status: string
          farmer_id: string
          id: string
          listing_id: string
          payment_method: string | null
          platform_fee: number
          quantity_kg: number
          subtotal: number
          total: number
        }
        Insert: {
          buyer_id: string
          created_at?: string
          escrow_status?: string
          farmer_id: string
          id?: string
          listing_id: string
          payment_method?: string | null
          platform_fee: number
          quantity_kg: number
          subtotal: number
          total: number
        }
        Update: {
          buyer_id?: string
          created_at?: string
          escrow_status?: string
          farmer_id?: string
          id?: string
          listing_id?: string
          payment_method?: string | null
          platform_fee?: number
          quantity_kg?: number
          subtotal?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "produce_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      produce_listings: {
        Row: {
          availability_date: string | null
          cold_storage: boolean
          created_at: string
          crop: string
          description: string | null
          farmer_id: string
          id: string
          image_url: string | null
          price_per_kg: number
          quantity_kg: number
          region: string
          status: string
        }
        Insert: {
          availability_date?: string | null
          cold_storage?: boolean
          created_at?: string
          crop: string
          description?: string | null
          farmer_id: string
          id?: string
          image_url?: string | null
          price_per_kg: number
          quantity_kg: number
          region: string
          status?: string
        }
        Update: {
          availability_date?: string | null
          cold_storage?: boolean
          created_at?: string
          crop?: string
          description?: string | null
          farmer_id?: string
          id?: string
          image_url?: string | null
          price_per_kg?: number
          quantity_kg?: number
          region?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "produce_listings_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cooperative_name: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          id_number: string | null
          id_type: string | null
          notification_prefs: Json
          phone: string | null
          region: string | null
          role: string
          verification_status: string
        }
        Insert: {
          cooperative_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          id_number?: string | null
          id_type?: string | null
          notification_prefs?: Json
          phone?: string | null
          region?: string | null
          role?: string
          verification_status?: string
        }
        Update: {
          cooperative_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          notification_prefs?: Json
          phone?: string | null
          region?: string | null
          role?: string
          verification_status?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          farmer_id: string
          id: string
          status: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          farmer_id: string
          id?: string
          status?: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          farmer_id?: string
          id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
