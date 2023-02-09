/** @jsx h */
import { h } from "preact";
import { db } from "~/db.js";
import { useLoaderData } from "~/hooks.js";

export async function loader({ params }) {
  const result = await db.execute(
    "select * from Page where slug=:slug limit 1",
    {
      slug: params.slug,
    },
  );

  return {
    page: result.rows[0],
  };
}

export default function Page() {
  const { page } = useLoaderData();

  return (
    <article>
      <h1>{page.title}</h1>
    </article>
  );
}
