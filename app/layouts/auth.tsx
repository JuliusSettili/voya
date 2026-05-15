import { Outlet } from "react-router";
import type { Route } from "./+types/auth";
import { guestGuardMiddleware } from "~/middleware/auth";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  guestGuardMiddleware,
];

export default function AuthLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
