/** @jsx h */
import { h, jsx, serveStatic } from "sift";
import type { Routes } from "sift";
import { Layout } from "./layout.tsx";
import { Page } from "../models.ts";

export const publicRoutes: Routes = {
  "/": (request) =>
    jsx(
      <Layout url={new URL(request.url)}>
        <h1>Hello, World!</h1>
      </Layout>,
    ),
  "/contact{/}?": async (request) => {
    if (request.method === "POST") {
      console.log(Object.fromEntries(await request.formData()));
    }

    return jsx(
      <Layout url={new URL(request.url)} head={<title>Contact</title>}>
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
      </Layout>,
    );
  },
  "/:slug{/}?": async (request, _, params) => {
    const page = await Page.where({
      slug: params?.slug,
      published: true,
    }).first();

    if (!page) return new Response("Not found!", { status: 404 });

    return jsx(
      <Layout url={new URL(request.url)}>
        <h1>{page.title}</h1>
      </Layout>,
    );
  },
  "/blog/:slug{/}?": () => jsx(<h1>Blog Post</h1>),
  "/garden/:slug{/}?": () => jsx(<h1>Garden</h1>),
  "/static/:filename+": serveStatic("./static", {
    baseUrl: import.meta.url,
  }),
};
