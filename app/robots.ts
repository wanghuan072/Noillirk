import type { MetadataRoute } from "next";
import { isLocalPreview, site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isLocalPreview
        ? { disallow: "/" }
        : { allow: "/", disallow: ["/preview", "/media-check"] }),
    },
    sitemap: site.origin + "/sitemap.xml",
  };
}
