import { getSupabaseClient } from "./supabaseClient";
import type { Post } from "./supabaseClient";

export async function fetchPosts(): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, countries (id, name)")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
