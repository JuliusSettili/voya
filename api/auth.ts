import { getSupabaseClient } from "./supabaseClient";

export async function getUser() {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function checkIsAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = getSupabaseClient();
  const { data } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .single();

  const profile = data as any;
  return profile?.role_id === 0;
}
