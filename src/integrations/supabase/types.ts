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
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          phone_number: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          phone_number: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          phone_number?: string
          role?: string
        }
        Relationships: []
      }
      travel_buddies: {
        Row: {
          id: string
          title: string
          description: string
          status: "has_vehicle" | "needs_vehicle"
          location: string | null
          date: string
          time: string
          user_id: string
          buddy_status: "active" | "inactive" | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status?: "has_vehicle" | "needs_vehicle"
          location?: string | null
          date: string
          time: string
          user_id: string
          buddy_status?: "active" | "inactive" | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: "has_vehicle" | "needs_vehicle"
          location?: string | null
          date?: string
          time?: string
          user_id?: string
          buddy_status?: "active" | "inactive" | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_buddies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      incidents: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          incident_type: Database["public"]["Enums"]["incident_type"]
          location_lat: number | null
          location_lng: number | null
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          incident_type: Database["public"]["Enums"]["incident_type"]
          location_lat?: number | null
          location_lng?: number | null
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          incident_type?: Database["public"]["Enums"]["incident_type"]
          location_lat?: number | null
          location_lng?: number | null
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_found_claims: {
        Row: {
          claimer_id: string
          contact_details: string
          created_at: string
          id: string
          item_id: string
          status: Database["public"]["Enums"]["item_status"] | null
          updated_at: string
        }
        Insert: {
          claimer_id: string
          contact_details: string
          created_at?: string
          id?: string
          item_id: string
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string
        }
        Update: {
          claimer_id?: string
          contact_details?: string
          created_at?: string
          id?: string
          item_id?: string
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lost_found_claims_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "lost_found_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_found_items: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          item_status: Database["public"]["Enums"]["item_status"] | null
          location: string | null
          status: Database["public"]["Enums"]["lost_found_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          item_status?: Database["public"]["Enums"]["item_status"] | null
          location?: string | null
          status: Database["public"]["Enums"]["lost_found_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          item_status?: Database["public"]["Enums"]["item_status"] | null
          location?: string | null
          status?: Database["public"]["Enums"]["lost_found_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string;
          user_id: string;
          message: string;
          type: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          message: string;
          type: string;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          message?: string;
          type?: string;
          created_at?: string;
          read?: boolean;
        };
      };
      profiles: {
        Row: {
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          created_at: string
          id: string
          location_lat: number | null
          location_lng: number | null
          resolved: boolean | null
          resolved_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          resolved?: boolean | null
          resolved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          role?: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      incident_status: "pending" | "under_review" | "resolved"
      incident_type: "theft" | "harassment" | "accident" | "other"
      item_status: "active" | "claimed" | "resolved"
      lost_found_status: "lost" | "found"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never