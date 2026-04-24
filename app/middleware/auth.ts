import { redirect } from "react-router";
import { getRouteConfig } from "../config/routeDefinitions";
import { getSupabaseClient } from "../../api/supabaseClient";

export async function authGuardMiddleware({ request }: { request: Request }) {
  const pathname = new URL(request.url).pathname;
  const routeConfig = getRouteConfig(pathname);

  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (routeConfig.onlyGuests && user) {
    throw redirect("/");
  }

  if (routeConfig.authRequired && !user) {
    throw redirect("/login");
  }
}
