import { getSupabaseClient } from "./supabaseClient";

export async function fetchProfile(id: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
