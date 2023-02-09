/** @jsx h */
import { h } from "preact";
import { useLoaderData } from "~/hooks.js";
import { NavLink } from "~/components.jsx";

export function loader() {
  return { authenticated: false };
}

export default function Root({ children }) {
  const { authenticated } = useLoaderData();

  return (
    <html class={authenticated && "authenticated"}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>
      <body>
        <header>
          Website
          <nav>
            <ul role="list">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
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
