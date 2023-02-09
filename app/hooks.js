import { createContext } from "preact";
import { useContext } from "preact/hooks";

export const MatchesContext = createContext();
export function useMatches() {
  return useContext(MatchesContext);
}

export const LocationContext = createContext();
export function useLocation() {
  return useContext(LocationContext);
}
export const LoaderDataContext = createContext();
export function useLoaderData() {
  return useContext(LoaderDataContext);
}
