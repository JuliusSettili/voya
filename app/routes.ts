import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("404", "./routes/notFound.tsx"),
  layout("./layouts/auth.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),
  layout("./layouts/default.tsx", [
    index("./routes/explore.tsx"),
    route("countries", "./routes/countries.tsx"),
    route("post/:id", "./routes/post.tsx"),
  ]),
] satisfies RouteConfig;
