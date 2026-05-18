import { getSupabaseClient } from "./supabaseClient";
import type { Post } from "./supabaseClient";

export async function fetchPosts(): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, countries (id, name, code), profiles (id, display_name)")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchPost(id: string): Promise<Post> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, countries (id, name, code), profiles (id, display_name), sub_posts (id, title, content, sub_post_images (id, image_url))")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Post;
}
