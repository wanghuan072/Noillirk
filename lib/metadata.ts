import type { Metadata } from "next";
import type { Seo } from "./types";
import { absolute, site } from "./site";
export function pageMetadata(
  seo: Seo,
  path: string,
  preview = false,
): Metadata {
  return {
    title: seo.title || site.name,
    description: seo.description || undefined,
    robots: preview ? { index: false, follow: false } : undefined,
    alternates: { canonical: absolute(path) },
    openGraph: {
      title: seo.title || site.name,
      description: seo.description || undefined,
      type: path.startsWith("/guides/") ? "article" : "website",
      url: absolute(path),
      siteName: site.name,
      locale: "en_US",
      images: [
        {
          url: absolute(site.social),
          width: 1200,
          height: 630,
          alt: "Noillirk — familiar answers and a balloon climb",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [absolute(site.social)],
    },
  };
}
