/// <reference types="./types.d.ts" />

/** @jsx h */
import { h, json, jsx, serveStatic } from "sift";
import { Layout } from "./layout.jsx";
import { db } from "../db.js";

export const adminRoutes = {
  "/admin{/}?": (request) => {
    return jsx(
      <Layout url={new URL(request.url)}>
        <h1>Dashboard</h1>
      </Layout>,
    );
  },

  "/admin/static/:filename+": serveStatic("static", {
    baseUrl: import.meta.url,
  }),

  "/admin/:collection{/}?": async (request, _connInfo, params) => {
    const { collection } = params;

    const { rows: items } = await db.execute(
      `select * from ${getTableForCollection(collection)} limit 10`,
    );

    return jsx(
      <Layout url={new URL(request.url)}>
        <ul>
          {items.map((item) => (
            <li>
              <a href={`/admin/${params?.collection}/${item.id}/`}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </Layout>,
    );
  },

  "/admin/:collection/:itemId/update{/}?": async (request, _, params) => {
    if (request.method === "POST") {
      const { collection, itemId } = params;

      const formData = await request.formData();

      console.log(Object.fromEntries(formData));

      const updatedAt = (new Date()).toISOString().replace("T", " ").replace(
        "Z",
        "",
      );

      const result = await db.transaction(async (tx) => [
        await tx.execute(
          `update ${
            getTableForCollection(collection)
          } set \`updated_at\`=:updatedAt, \`title\`=:title, \`slug\`=:slug, \`description\`=:description, \`markdown\`=:markdown where \`id\`=:itemId`,
          {
            itemId,
            updatedAt,
            title: formData.get("title"),
            slug: formData.get("slug"),
            description: formData.get("description"),
            markdown: formData.get("markdown"),
          },
        ),
      ]);

      return json({ success: true });
    } else return json({ notSupported: true });
  },

  "/admin/:collection/:itemId/delete{/}?": async (request, _, params) => {
    return jsx(
      <Layout url={new URL(request.url)}>
        Are you sure???
      </Layout>,
    );
  },

  "/admin/:collection/:itemId{/}?": async (request, _connInfo, params) => {
    const result = await db.execute(
      `select * from ${
        getTableForCollection(params?.collection)
      } where id in (?)`,
      [params?.itemId],
    );
    const [item] = result.rows;

    return jsx(
      <Layout url={new URL(request.url)}>
        <form method="post" action="update">
          <form-field>
            <label>
              Title <input value={item.title} name="title" />
            </label>
          </form-field>
          <form-field>
            <label>
              Slug <input value={item.slug} name="slug" />
            </label>
          </form-field>
          <form-field>
            <label>
              Description{" "}
              <textarea value={item.description} name="description" />
            </label>
          </form-field>
          <form-field>
            <label>
              Markdown <textarea value={item.markdown} name="markdown" />
            </label>
          </form-field>
          <button>Update</button>
          <button formAction="delete">Delete</button>
        </form>
      </Layout>,
    );
  },
};

function getTableForCollection(collection) {
  const collections = {
    pages: "Page",
    posts: "Posts",
  };
  return collections[collection];
}

// /admin/dashboard
// /admin/messages
// /admin/messages/:id
// /admin/webmentions
// /admin/webmentions/:id
// /admin/webmentions/:id/edit
// /admin/webmentions/:id/process
// /admin/:collection
// /admin/:collection/new
// /admin/:collection/export
// /admin/:collection/:item
// /admin/:collection/:item/edit
// /admin/:collection/:item/delete
