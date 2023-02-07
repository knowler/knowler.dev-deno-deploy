import { connect } from "@planetscale/database";

export const db = await connect({
  url: Deno.env.get("DATABASE_URL"),
});
