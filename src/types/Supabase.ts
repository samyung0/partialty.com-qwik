export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export default interface Supabase {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          is_terms_agreed: boolean | null;
          role: string | null;
          stripe_customer_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id: string;
          is_terms_agreed?: boolean | null;
          role?: string | null;
          stripe_customer_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          is_terms_agreed?: boolean | null;
          role?: string | null;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
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
