import { getSupabaseClient } from "./supabaseClient";

export async function deleteSubPost(id: number): Promise<void> {
  const supabase = getSupabaseClient();

  // Try deleting the sub_post directly first (works if FK cascade is configured)
  let { error } = await supabase.from("sub_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export default deleteSubPost;
