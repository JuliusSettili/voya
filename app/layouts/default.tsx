import { Outlet } from "react-router";
import Navbar from "~/components/navbar";
import type { Route } from "./+types/default";
import { authGuardMiddleware } from "~/middleware/auth";

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authGuardMiddleware,
];

export default function DefaultLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
