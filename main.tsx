/** @jsx h */
import { h, jsx, serve, serveStatic } from "sift";
import { PublicLayout } from "./components/public-layout.tsx";
import { Database } from "denodb";
import { ContactFormSubmission, GardenPost, Page, Post } from "./models.ts";

import { PlanetScaleConnector } from "./planetscale-connector.ts";

const connector = new PlanetScaleConnector({
  url: Deno.env.get("DATABASE_URL"),
});

const db = new Database(connector, true);

db.link([Page, Post, GardenPost, ContactFormSubmission]);

db.sync();

serve({
  "/": (request) =>
    jsx(
      <PublicLayout url={new URL(request.url)}>
        <h1>Hello, World!</h1>
      </PublicLayout>,
    ),
  "/contact": async (request) => {
    if (request.method === "POST") {
      console.log(Object.fromEntries(await request.formData()));
    }

    return jsx(
      <PublicLayout url={new URL(request.url)}>
        <h1>Contact</h1>
        <form method="post">
          <form-field>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" required />
          </form-field>
          <form-field>
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" />
          </form-field>
          <form-field>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required />
          </form-field>
          <button>Send</button>
        </form>
      </PublicLayout>,
    );
  },
  "/:slug": (request, _, params) => {
    const page = findPage(params?.slug);

    if (!page) return new Response("Not found!", { status: 404 });

    return jsx(
      <PublicLayout url={new URL(request.url)}>
        <h1>{page.title}</h1>
      </PublicLayout>,
    );
  },
  "/blog/:slug": () => jsx(<h1>Blog Post</h1>),
  "/garden/:slug": () => jsx(<h1>Garden</h1>),
  "/static/:filename+": serveStatic("./static", {
    baseUrl: import.meta.url,
  }),
});

function findPage(slug) {
  const pages = [
    {
      slug: "about",
      title: "About",
    },
    {
      slug: "blog",
      title: "Blog",
    },
    {
      slug: "garden",
      title: "Digital Garden",
    },
    {
      slug: "uses",
      title: "Uses",
    },
    {
      slug: "webmention",
      title: "Webmention",
    },
  ];

  return pages.find((page) => page.slug === slug);
}

/* Private */

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
