/** @jsx h */
import { h, json, jsx, serveStatic } from "sift";
import type { Routes } from "sift";
import { Page, Post } from "../models.ts";
import { Layout } from "./layout.tsx";
import { db } from "../db.ts";

export const adminRoutes: Routes = {
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
    const { rows: items } = await db.execute(
      getQueryForCollection(params?.collection),
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
    if (request.method === "post") {
      const formData = await request.formData();

      console.log(Object.fromEntries(formData));

      await getCollection(params?.collection)?.where({
        id: params?.itemId,
      }).update(Object.fromEntries(formData));

      return json({ success: true });
    }
  },

  "/admin/:collection/:itemId/delete{/}?": async (request, _, params) => {
    return jsx(
      <Layout url={new URL(request.url)}>
        Are you sure???
      </Layout>,
    );
  },

  "/admin/:collection/:itemId{/}?": async (request, _connInfo, params) => {
    const item = await getCollection(params?.collection)?.find(params?.itemId);

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

function getQueryForCollection(collection: string) {
  const collections = {
    pages: "select * from Page limit 10",
    posts: "select * from Post limit 10",
  };

  return collections[collection];
}

function getCollection(collection: string) {
  const collections = {
    pages: Page,
    posts: Post,
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
