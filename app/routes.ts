import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("countries", "routes/countries.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("explore", "routes/explore.tsx"),
] satisfies RouteConfig;
