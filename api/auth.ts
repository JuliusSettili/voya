import { getSupabaseClient } from "./supabaseClient";

export async function getUser() {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
