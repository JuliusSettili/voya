import { getSupabaseClient } from "./supabaseClient";

export type AuthProfile = {
  id: string;
  display_name: string;
};

export async function getUser() {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
