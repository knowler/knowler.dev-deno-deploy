/** @jsx h */
import { h } from "preact";
import { useLocation } from "~/hooks.js";

export function NavLink({ to, children }) {
  const { pathname } = useLocation();
  return (
    <a href={to} aria-current={to === pathname ? "page" : undefined}>
      {children}
    </a>
  );
}
