import { redirect } from "react-router";
import { getUser } from "../../api/auth";

export async function authGuardMiddleware({ pattern }: { pattern: string }) {
  const user = await getUser();

  const isPublicRoute = pattern === "/" || pattern.startsWith("/post") || pattern.startsWith("post/");

  if (!user && !isPublicRoute) {
    throw redirect("/login");
  }
}

export async function guestGuardMiddleware() {
  const user = await getUser();

  if (user) {
    throw redirect("/");
  }
}
