/** @jsx h */
import { h } from "../deps.ts";
import { GitHubIcon } from "./github-icon.tsx";
import { MastodonIcon } from "./mastodon-icon.tsx";

export function PublicLayout({ children, url }) {
  const NavLink = UnboundNavLink.bind(url);

  return (
    <html lang="en-ca">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/static/main.css" />
        <script type="module" src="/static/main.js"></script>
      </head>
      <body>
        <header>
          <nav>
            <NavLink to="/">Nathan Knowler</NavLink>
            <ul aria-label="primary">
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/blog">Blog</NavLink>
              </li>
              <li>
                <NavLink to="/garden">Garden</NavLink>
              </li>
              <li>
                <NavLink to="/uses">Uses</NavLink>
              </li>
              <li>
                <a href="https://sunny.garden/@knowler" rel="me">
                  <span className="visually-hidden">
                    @knowler@sunny.garden on Mastodon
                  </span>
                  <MastodonIcon aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="https://github.com/knowler" rel="me">
                  <span className="visually-hidden">@knowler on GitHub</span>
                  <GitHubIcon aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <p>&copy;2023 Nathan Knowler. All rights reserved.</p>
          <nav aria-label="secondary">
            <ul role="list">
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </ul>
          </nav>
        </footer>
      </body>
    </html>
  );
}

function UnboundNavLink({ to, children }) {
  return (
    <a href={to} aria-current={this.pathname === to ? "page" : undefined}>
      {children}
    </a>
  );
}
