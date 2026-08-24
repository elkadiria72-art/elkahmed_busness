export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "client";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
};

export type Settings = {
  id: number;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  working_hours: string;
  logo_url: string | null;
  social_links: SocialLinks | null;
  updated_at: string | null;
};

export type RequestStatus = "new" | "reviewing" | "accepted" | "rejected";

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
  status: RequestStatus;
  created_at: string;
};

export type ProjectStatus =
  | "Request Submitted"
  | "Project Review"
  | "Discussion"
  | "Development"
  | "Testing"
  | "Delivered";

export type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  status: ProjectStatus;
  description: string | null;
  images: string[];
  deadline: string | null;
  created_at: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  discount_price: number | null;
  currency: "MAD" | "EUR" | "USD";
  updated_at: string | null;
};

export type Message = {
  id: number;
  project_id: string;
  sender_id: string | null;
  author_name: string;
  body: string;
  created_at: string;
};

export type FileRow = {
  id: number;
  project_id: string;
  uploaded_by: string | null;
  file_url: string;
  file_name: string;
  file_type: string | null;
  created_at: string;
};

export type Notification = {
  id: number;
  user_id: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
};

/**
 * Hand-maintained mirror of the schema in supabase/migrations.
 *
 * IMPORTANT: every Row/Insert/Update shape MUST be a `type` alias, never an
 * `interface` — postgrest-js requires them to satisfy Record<string, unknown>,
 * and interfaces do not receive TypeScript's implicit index signature.
 */
export type Database = {
  public: {
    Tables: {
      settings: {
        Row: Settings;
        Insert: Partial<Settings>;
        Update: Partial<Settings>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      requests: {
        Row: RequestRow;
        Insert: Partial<RequestRow>;
        Update: Partial<RequestRow>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Partial<Project>;
        Update: Partial<Project>;
        Relationships: [];
      };
      services: {
        Row: Service;
        Insert: Partial<Service>;
        Update: Partial<Service>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Partial<Message>;
        Update: Partial<Message>;
        Relationships: [];
      };
      files: {
        Row: FileRow;
        Insert: Partial<FileRow>;
        Update: Partial<FileRow>;
        Relationships: [];
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
