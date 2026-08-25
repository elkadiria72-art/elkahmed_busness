/**
 * Placeholder database schema types.
 *
 * Regenerate with the Supabase CLI once your project exists:
 *
 *   supabase gen types typescript --project-id <your-project-ref> --schema public > src/types.ts
 *
 * Until then this is a valid, empty schema so the client stays fully typed.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type SettingsSocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
};

export type SettingsRow = {
  id: number;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  working_hours: string;
  logo_url: string | null;
  social_links: SettingsSocialLinks | null;
  updated_at: string | null;
};

/** Mirrors the `requests` table from 0001_dashboard_module.sql. */
export type RequestRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  need: string;
  message: string;
  budget: string | null;
  deadline: string | null;
  status: "new" | "reviewing" | "accepted" | "rejected";
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      settings: {
        Row: SettingsRow;
        Insert: Partial<SettingsRow>;
        Update: Partial<SettingsRow>;
        Relationships: [];
      };
      requests: {
        Row: RequestRow;
        Insert: Partial<RequestRow>;
        Update: Partial<RequestRow>;
        Relationships: [];
      };
      // Regenerate this file with:
      // supabase gen types typescript --project-id <ref> --schema public > src/types.ts
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
};

export type Tables<
  TTable extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TTable] extends { Row: infer Row } ? Row : never;

export type TablesInsert<
  TTable extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TTable] extends { Insert: infer Insert }
  ? Insert
  : never;

export type TablesUpdate<
  TTable extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][TTable] extends { Update: infer Update }
  ? Update
  : never;
