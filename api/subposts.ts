import { getSupabaseClient, type SubPost } from "./supabaseClient";

export async function deleteSubPost(id: number): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("sub_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export default deleteSubPost;

export async function updateSubPost(id: number, data: { title?: string; content?: string }): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("sub_posts").update(data).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function addSubPostImage(subPostId: number, imageUrl: string): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("sub_post_images").insert({
    image_url: imageUrl,
    subpost_id: subPostId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getSubPostById(id: number): Promise<SubPost> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("sub_posts").select("id, title, content, sub_post_images (id, image_url)").eq("id", id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SubPost;
}

export async function deleteSubPostImage(imageId: number): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("sub_post_images").delete().eq("id", imageId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function addEmptySubPost(postId: number): Promise<SubPost> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.from("sub_posts").insert({
    title: "",
    content: "",
    post_id: postId,
  }).select("id, title, content, sub_post_images (id, image_url)").single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SubPost;
}
