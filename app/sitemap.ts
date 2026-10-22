import type { MetadataRoute } from "next";
import { absolute, legalNavigation } from "@/lib/site";
import { previewGames, previewGuides } from "@/lib/content";
import dates from "@/seo/page-lastmod.json";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...legalNavigation.map((x) => x.path),
    "/games",
    "/guides",
    ...previewGames().map((g) => `/games/${g.slug}`),
    ...previewGuides().map((g) => `/guides/${g.slug}`),
  ];
  return [...new Set(paths)].map((route) => ({
    url: absolute(route),
    lastModified:
      dates.pages[route as keyof typeof dates.pages]?.lastModified || undefined,
  }));
}
