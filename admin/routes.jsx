/** @jsx h */
import { h, json, jsx, serveStatic } from "sift";
import { Layout } from "./layout.jsx";
import { db } from "../db.js";
import { v4 } from "uuid";

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
        <h1>{collection}</h1>
        <p>
          <a href={`/admin/${collection}/new`}>New</a>
        </p>
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
  "/admin/:collection/new{/}?": async (request, _, params) => {
    if (request.method === "POST") {
      const formData = await request.formData();
      const { collection } = params;

      const published = formData.get("published") === "on";

      await db.transaction(async (tx) => [
        await tx.execute(
          `insert into ${
            getTableForCollection(collection)
          } (id, title, slug, description, markdown, published) values (:id, :title, :slug, :description, :markdown, :published)`,
          {
            id: v4.generate(),
            title: formData.get("title"),
            slug: formData.get("slug"),
            description: formData.get("description"),
            markdown: formData.get("markdown"),
            published,
            publishedAt: published
              ? (new Date()).toISOString().replace("T", " ").replace("Z", "")
              : null,
          },
        ),
      ]);

      console.log(Object.fromEntries(formData));
    }

    return jsx(
      <Layout url={new URL(request.url)}>
        <h1>New</h1>
        <form method="post">
          <form-field>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required />
          </form-field>
          <form-field>
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" required />
          </form-field>
          <form-field>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" />
          </form-field>
          <form-field>
            <label htmlFor="markdown">Markdown</label>
            <textarea id="markdown" name="markdown" required />
          </form-field>
          <form-field>
            <input type="checkbox" id="published" name="published" />
            <label htmlFor="published">Published</label>
          </form-field>
          <button>Make New</button>
        </form>
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
            published: formData.get("published") === "on" ? true : false,
          },
        ),
      ]);

      return json({ success: true });
    } else return json({ notSupported: true });
  },

  "/admin/:collection/:itemId/delete{/}?": (request) => {
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
          <form-field>
            <label>
              <input
                type="checkbox"
                name="published"
                checked={item.published}
              />{" "}
              Published
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
    posts: "Post",
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
