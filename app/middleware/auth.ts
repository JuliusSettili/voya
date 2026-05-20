import { redirect } from "react-router";
import { getSupabaseClient } from "../../api/supabaseClient";

export async function authGuardMiddleware() {
  const user = await getUser();

  if (!user) {
    throw redirect("/login");
  }
}

export async function guestGuardMiddleware() {
  const user = await getUser();

  if (user) {
    throw redirect("/");
  }
}

export async function getUser() {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
