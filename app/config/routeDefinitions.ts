export type AppRouteDefinition = {
  path: string;
  file: string;
  index?: boolean;
  hideNavbar: boolean;
  authRequired: boolean;
  onlyGuests: boolean;
};

const DEFAULT_ROUTE_FLAGS: Pick<
  AppRouteDefinition,
  "hideNavbar" | "authRequired" | "onlyGuests"
> = {
  hideNavbar: false,
  authRequired: true,
  onlyGuests: false,
};

export const APP_ROUTE_DEFINITIONS: AppRouteDefinition[] = [
  {
    path: "/",
    file: "routes/home.tsx",
    index: true,
    hideNavbar: false,
    authRequired: true,
    onlyGuests: false,
  },
  {
    path: "/countries",
    file: "routes/countries.tsx",
    hideNavbar: false,
    authRequired: true,
    onlyGuests: false,
  },
  {
    path: "/login",
    file: "routes/login.tsx",
    hideNavbar: true,
    authRequired: false,
    onlyGuests: true,
  },
  {
    path: "/register",
    file: "routes/register.tsx",
    hideNavbar: true,
    authRequired: false,
    onlyGuests: true,
  },
  {
    path: "/explore",
    file: "routes/explore.tsx",
    hideNavbar: false,
    authRequired: true,
    onlyGuests: false,
  },
];

export function normalizeAppPath(pathname: string) {
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  let normalizedPath = pathname;

  if (basePath && basePath !== "/" && normalizedPath.startsWith(basePath)) {
    normalizedPath = normalizedPath.slice(basePath.length) || "/";
  }

  if (normalizedPath.length > 1 && normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  return normalizedPath;
}

export function getRouteConfig(pathname: string): AppRouteDefinition {
  const normalizedPath = normalizeAppPath(pathname);
  const routeDefinition = APP_ROUTE_DEFINITIONS.find(
    (definition) => definition.path === normalizedPath
  );

  return {
    ...DEFAULT_ROUTE_FLAGS,
    file: routeDefinition?.file ?? "",
    ...(routeDefinition ?? {}),
    path: normalizedPath,
  };
}
