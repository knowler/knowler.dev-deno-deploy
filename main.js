import { serve } from "sift";

//import { adminRoutes } from "./admin/routes.jsx";
import { publicRoutes } from "./public/routes.jsx";

serve({
  //...adminRoutes,
  ...publicRoutes,
});
