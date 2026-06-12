import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("404", "./routes/not-found.tsx"),
  layout("./layouts/auth.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),
  layout("./layouts/default.tsx", [
    index("./routes/explore.tsx"),
    route("post/:id", "./routes/post.tsx"),
    route("admin-page", "./routes/admin-page.tsx"),
    route("profile/:id", "./routes/profile.tsx"),
    route("new-post", "./routes/new-post.tsx"),
  ]),
] satisfies RouteConfig;
