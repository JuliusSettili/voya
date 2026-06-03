import { getSupabaseClient } from "./supabaseClient";
import type { Role } from "./supabaseClient";

export async function fetchRoles(): Promise<Role[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id, name")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
