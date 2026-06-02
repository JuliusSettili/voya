import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "../config/supabaseConfig";

export type Country = {
  id: number;
  name: string;
  code: string;
};

export type Profile = {
  id: string;
  display_name: string;
};

export type SubPostImage = {
  id: number;
  image_url: string;
}

export type SubPost = {
  id: number;
  title: string;
  content: string;
  sub_post_images: SubPostImage[];
}

export type Post = {
  id: number;
  title: string;
  description: string;
  title_image_url: string;
  countries: Country[];
  profiles: Profile;
  sub_posts?: SubPost[];
};

export type Database = {
  public: {
    Tables: {
      countries: {
        Row: Country;
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
      posts: {
        Row: Post;
        Insert: {
          title: string;
          description: string;
          title_image_url?: string;
          profile_id?: string;
          is_private?: boolean;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          title_image_url?: string;
          profile_id?: string;
          is_private?: boolean;
        };
      };
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          display_name: string;
        };
        Update: {
          id?: string;
          display_name?: string;
        };
      };
      sub_posts: {
        Row: SubPost;
        Insert: {
          title: string;
          content: string;
          post_id: number;
        };
        Update: {
          title?: string;
          content?: string;
          post_id?: number;
        };
      };
      sub_post_images: {
        Row: SubPostImage;
        Insert: {
          image_url: string;
          subpost_id: number;
        };
        Update: {
          image_url?: string;
          subpost_id?: number;
        };
      };
    };
  };
};

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return supabaseClient;
}
