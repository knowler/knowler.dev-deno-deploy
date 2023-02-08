import { serve } from "sift";

//import { adminRoutes } from "./admin/routes.tsx";
import { publicRoutes } from "./public/routes.tsx";

serve({
  //...adminRoutes,
  ...publicRoutes,
});
