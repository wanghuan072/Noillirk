import { absolute, pathFor } from "./site";
export type Crumb = { label: string; path: string };
export function breadcrumbs(path: string, title: string): Crumb[] {
  const root = { label: "Home", path: "/" };
  if (path === "/") return [];
  const middle = path.startsWith("/games/")
    ? { label: "More Games", path: "/games" }
    : path.startsWith("/guides/")
      ? { label: "Guides", path: "/guides" }
      : null;
  return [root, ...(middle ? [middle] : []), { label: title, path }];
}
export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absolute(item.path),
    })),
  };
}
export function crumbHref(path: string, preview: boolean) {
  return pathFor(path, preview);
}
