export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          firstName: string;
          lastName: string;
          id: string;
          email: string;
          company_id: string | null;
          role: string;
          name: string | null;
          phone_number: string | null;
          address: string | null;
          date_of_birth: string;
          created_by: string;
          next_of_kin_name: string;
          next_of_kin_phone_number: string;
          next_of_kin_relationship: string;
          next_of_kin_address: string;
          next_of_kin_work_address: string;
          latitude: number;
          longitude: number;
        };
        Insert: {
          lastName: string;
          id?: string;
          email: string;
          firstName: string;

          company_id?: string | null;
          role?: string;
          name?: string | null;
          phone_number?: string | null;
          address?: string | null; // Added this line
        };
        Update: {
          firstName?: string;
          lastName?: string;
          id?: string;
          email?: string;
          company_id?: string | null;
          role?: string;
          name?: string | null;
          phone_number?: string | null;
          address?: string | null; // Added this line
        };
      };
      drivers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone_number: string | null;
          license_number: string | null;
          company_id: string;
          created_by: string;
          created_at:string

          address: string;
          next_of_kin_name: string;
          next_of_kin_phone_number: string
          next_of_kin_relationship: string
          next_of_kin_address: string
          next_of_kin_work_address: string
          latitude: string
          longitude: string
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone_number: string | null;
          license_number: string | null;
          company_id: string;
          created_by: string;
          created_at:string

          address: string;
          next_of_kin_name: string;
          next_of_kin_phone_number: string
          next_of_kin_relationship: string
          next_of_kin_address:string
          next_of_kin_work_address: string
          latitude: string
          longitude: string
        };
        Update: {
          id: string;
          name: string;
          email: string;
          phone_number: string | null;
          license_number: string | null;
          company_id: string;
          created_by: string;
          created_at:string
          address: string;
          next_of_kin_name: string;
          next_of_kin_phone_number: string
          next_of_kin_relationship: string
          next_of_kin_address:string
          next_of_kin_work_address: string
          latitude: string
          longitude: string
        };
      };
      cars: {
        Row: {
          id: string;
          name: string;
          plate_number: string;
          model: string | null;
          year: number | null;
          company_id: string;
          driver_id: string;
          engine_number: string;
          picture_url?: string;
        };
        Insert: {
          id?: string;
          name: string;
          plate_number: string;
          model?: string | null;
          year?: number | null;
          company_id: string;
          driver_id: string;
          engine_number: string;
          picture_url?: string;
        };
        Update: {
          id?: string;
          name?: string;
          plate_number?: string;
          model?: string | null;
          year?: number | null;
          company_id?: string;
          driver_id?: string;
          engine_number: string;
          picture_url?: string;
        };
      };

      companies: {
        Row: {
          id: string;
          name: string;
          phone_number: string | null;
          address: string | null;
          registration_number: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          phone_number?: string | null;
          address?: string | null;
          registration_number?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          phone_number?: string | null;
          address?: string | null;
          registration_number?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

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
  : never;
