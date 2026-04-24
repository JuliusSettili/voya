import { redirect } from "react-router";
import { getSupabaseClient } from "../../api/supabaseClient";

const PUBLIC_PATHS = new Set(["/login", "/register"]);

function normalizeAppPath(pathname: string) {
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

  if (basePath && basePath !== "/" && pathname.startsWith(basePath)) {
    const stripped = pathname.slice(basePath.length);
    return stripped || "/";
  }

  return pathname;
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(normalizeAppPath(pathname));
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
