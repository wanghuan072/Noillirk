import { absolute, site } from "@/lib/site";
import { breadcrumbs, breadcrumbSchema } from "@/lib/breadcrumbs";
import {
  getGame,
  getGuide,
  mainGame,
  previewGames,
  previewGuides,
  publishedGames,
  publishedGuides,
} from "@/lib/content";
import dates from "@/seo/page-lastmod.json";
import { tdk } from "@/seo/tdk";
import { legalContent } from "@/lib/legal";
export function StructuredData({
  path,
  preview = false,
}: {
  path: string;
  preview?: boolean;
}) {
  const game =
    path === "/"
      ? mainGame
      : path.startsWith("/games/")
        ? getGame(path.slice(7), preview)
        : undefined;
  const guide = path.startsWith("/guides/")
    ? getGuide(path.slice(8), preview)
    : undefined;
  const seo = game?.seo || guide?.seo || tdk[path.slice(1) as keyof typeof tdk];
  if (!seo) return null;
  const title =
    game?.title ||
    guide?.title ||
    (path === "/games"
      ? "More Games"
      : path === "/guides"
        ? "Guides"
        : legalContent[path.slice(1)]?.title);
  if (!title) return null;
  const page: { [key: string]: unknown } = {
    "@type":
      path === "/games" || path === "/guides" ? "CollectionPage" : "WebPage",
    url: absolute(path),
    name: seo.title,
    description: seo.description,
    "@id": absolute(path) + "#webpage",
    inLanguage: "en",
    isPartOf: { "@id": site.origin + "/#website" },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absolute(site.social),
      width: 1200,
      height: 630,
    },
    ...(dates.pages[path as keyof typeof dates.pages]?.lastModified
      ? {
          dateModified:
            dates.pages[path as keyof typeof dates.pages].lastModified,
        }
      : {}),
  };
  if (path === "/about") page["@type"] = "AboutPage";
  if (path === "/contact") page["@type"] = "ContactPage";
  if (path === "/games" || path === "/guides") {
    const items =
      path === "/games"
        ? (preview ? previewGames() : publishedGames()).map((g) => ({
            name: g.title,
            url: absolute(`/games/${g.slug}`),
          }))
        : (preview ? previewGuides() : publishedGuides()).map((g) => ({
            name: g.title,
            url: absolute(`/guides/${g.slug}`),
          }));
    page.mainEntity = {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...item,
      })),
    };
  }
  if (game)
    page.mainEntity = {
      "@type": "Game",
      name: game.title,
      url: absolute(path),
      description: game.shortDescription,
      ...(game.image.src ? { image: absolute(game.image.src) } : {}),
    };
  if (guide)
    page.mainEntity = {
      "@type": "Article",
      headline: guide.title,
      description: guide.summary,
      mainEntityOfPage: absolute(path),
      ...(guide.cover.src ? { image: absolute(guide.cover.src) } : {}),
      ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}),
      ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    };
  const graph = [
    page,
    {
      "@type": "WebSite",
      "@id": site.origin + "/#website",
      name: site.name,
      url: site.origin + "/",
      inLanguage: "en",
      image: absolute(site.social),
    },
    ...(path === "/" ? [] : [breadcrumbSchema(breadcrumbs(path, title))]),
  ];
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
