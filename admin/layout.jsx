/** @jsx h */
import { h } from "sift";
import { NavLink as UnboundNavLink } from "../components/nav-link.jsx";

export function Layout({ children, head, url }) {
  const NavLink = UnboundNavLink.bind(url);

  return (
    <html lang="en-ca">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/admin/static/admin.css" />
        {head}
      </head>
      <body>
        <header>
          <NavLink to="/admin">Admin</NavLink>
          <nav>
            <ul>
              <li>
                <NavLink to="/admin/pages">Pages</NavLink>
              </li>
              <li>
                <NavLink to="/admin/posts">Posts</NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
