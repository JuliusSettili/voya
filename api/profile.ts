import { getSupabaseClient } from "./supabaseClient";
import type { Profile } from "./supabaseClient";

export async function fetchProfile(id: string): Promise<Profile> {
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

export async function fetchFullProfile(id: string): Promise<Profile> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, blocked, role_id, roles(id, name), blocked_users(block_text)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}