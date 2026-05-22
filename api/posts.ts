import { getSupabaseClient } from "./supabaseClient";
import type { Post } from "./supabaseClient";
import { getUser } from "./auth";

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

export async function fetchPostsByProfileId(profileId: string): Promise<Post[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, description, title_image_url, countries (id, name, code), profiles (id, display_name)")
    .eq("user_id", profileId)
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

export async function deletePost(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function postBelongsToCurrentUser(post: Post): Promise<boolean> {
  const user = await getUser();

  if (!user?.id) {
    return false;
  }

  return post.profiles.id === user.id;
}
