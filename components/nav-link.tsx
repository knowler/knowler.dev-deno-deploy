/** @jsx h */
import { h } from "sift";

export function NavLink({ to, children }) {
  return (
    <a href={to} aria-current={this.pathname === to ? "page" : undefined}>
      {children}
    </a>
  );
}
