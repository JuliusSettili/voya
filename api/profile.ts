import { getSupabaseClient } from "./supabaseClient";
import type { Profile } from "./supabaseClient";
import { deleteBlockedUser, insertBlockedUser } from "./blockeduser";

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
    .update({ blocked: true } as never)
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
    .update({ blocked: false} as never)
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message);
  } 
  deleteBlockedUser(profileId).catch((error) => {
    console.error("Failed to delete block reason:", error);
  });
}

export async function updateProfileDisplayName(profileId: string, displayName: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Nicht angemeldet");

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName } as never)
    .eq("id", profileId);

  if (error) {
    if(error.code === "23505") {
      throw new Error("Der Anzeigename ist bereits vergeben. Bitte wählen Sie einen anderen Namen.");
    }
    throw new Error(error.message);
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName }
  });
  if (authError) {
    throw new Error(authError.message);
  }
}

export async function updateProfileRole(profileId: string, roleId: number): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role_id: roleId } as never)
    .eq("id", profileId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchProfileById(id: string): Promise<Profile> {
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