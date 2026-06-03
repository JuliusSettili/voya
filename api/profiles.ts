import { deleteBlockedUser, insertBlockedUser } from "./blockeduser";
import { getSupabaseClient } from "./supabaseClient";
import type { Profile } from "./supabaseClient";

export async function fetchProfiles(): Promise<Profile[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, blocked, role_id, email, roles(id, name), blocked_users(block_text)")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function blockProfile(profileId: string, reason: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ blocked: true })
    .eq("id", profileId);

  if (profileError) {
    throw new Error(profileError.message);
  }

  insertBlockedUser(profileId, reason).catch((error) => {
    console.error("Failed to insert block reason:", error);
  });
}

export async function unblockProfile(profileId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ blocked: false})
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message);
  } 
  deleteBlockedUser(profileId).catch((error) => {
    console.error("Failed to delete block reason:", error);
  });
}

export async function assignRoleToProfile(profileId: string, roleId: number): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role_id: roleId })
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message);
  }
}
