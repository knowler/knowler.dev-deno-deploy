import { serve } from "sift";
import { Database } from "denodb";
import { ContactFormSubmission, GardenPost, Page, Post } from "./models.ts";

import { PlanetScaleConnector } from "./planetscale-connector.ts";
import { adminRoutes } from "./admin/routes.tsx";
import { publicRoutes } from "./public/routes.tsx";

const connector = new PlanetScaleConnector({
  url: Deno.env.get("DATABASE_URL"),
});

const db = new Database(connector, true);

db.link([Page, Post, GardenPost, ContactFormSubmission]);

//db.sync({ drop: true });

serve({
  //...adminRoutes,
  ...publicRoutes,
});
