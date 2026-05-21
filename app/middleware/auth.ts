import { redirect } from "react-router";
import { getUser } from "../../api/auth";

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
