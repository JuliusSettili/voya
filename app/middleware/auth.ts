import { redirect } from "react-router";
import { getSupabaseClient } from "../../api/supabaseClient";

const PUBLIC_PATHS = new Set(["/login", "/register"]);

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}

export async function authGuardMiddleware({ request }: { request: Request }) {
  const pathname = new URL(request.url).pathname;
  const isPublic = isPublicPath(pathname);

  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublic && user) {
    throw redirect("/");
  }

  if (!isPublic && !user) {
    throw redirect("/login");
  }
}
