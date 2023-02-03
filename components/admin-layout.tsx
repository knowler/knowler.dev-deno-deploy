/** @jsx h */
import { h } from "sift";

export function AdminLayout({ children }) {
  return (
    <html lang="en-ca">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/static/admin.css" />
      </head>
      <body>
        <header>
          Admin
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
