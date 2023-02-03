/** @jsx h */
import { h, json, jsx } from "sift";
import type { Routes } from "sift";
import { Page, Post } from "./models.ts";
import { AdminLayout } from "./components/admin-layout.tsx";

export const adminRoutes: Routes = {
  "/admin{/}?": () => {
    return json({ message: "I am the admin" });
  },

  "/admin/:collection{/}?": async (_request, _connInfo, params) => {
    const collection = getCollection(params?.collection);

    if (!collection) return json("Oopsie");

    const pages = await collection.all();

    return jsx(
      <AdminLayout>
        <ul>
          {pages.map((page) => (
            <li>
              <a href={`/admin/pages/${page.id}/`}>{page.title}</a>
            </li>
          ))}
        </ul>
      </AdminLayout>,
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
      <AdminLayout>
        Are you sure???
      </AdminLayout>,
    );
  },

  "/admin/:collection/:itemId{/}?": async (_request, _connInfo, params) => {
    const item = await getCollection(params?.collection)?.find(params?.itemId);

    return jsx(
      <AdminLayout>
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
      </AdminLayout>,
    );
  },
};

function getCollection(collection: string) {
  const collections = {
    pages: Page,
    posts: Post,
  };

  return collections[collection];
}
