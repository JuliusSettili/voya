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

export async function fetchProfile(id: string): Promise<AuthProfile> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AuthProfile;
}
