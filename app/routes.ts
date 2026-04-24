import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { APP_ROUTE_DEFINITIONS } from "./config/routeDefinitions";

export default APP_ROUTE_DEFINITIONS.map((definition) => {
  if (definition.index) {
    return index(definition.file);
  }

  return route(definition.path.replace(/^\//, ""), definition.file);
}) satisfies RouteConfig;
