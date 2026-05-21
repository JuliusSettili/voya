import { getSupabaseClient } from "./supabaseClient";

export async function deleteSubPost(id: number): Promise<void> {
  const supabase = getSupabaseClient();

  let { error } = await supabase.from("sub_posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export default deleteSubPost;
