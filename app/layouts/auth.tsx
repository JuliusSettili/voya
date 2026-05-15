import { Outlet } from "react-router";
import type { Route } from "./+types/default";
import { guestGuardMiddleware } from "~/middleware/auth";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  guestGuardMiddleware,
];

export default function DefaultLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
