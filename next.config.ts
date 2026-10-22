import type { NextConfig } from "next";
import main from "./data/games/main-game.json";
import games from "./data/games/games.json";
import { frameOrigins } from "./lib/security";
import fs from "node:fs";
import path from "node:path";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_YEAR: new Intl.DateTimeFormat("en", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
    }).format(new Date()),
  },
  output: "standalone",
  distDir:
    process.env.NODE_ENV === "development"
      ? ".next-dev"
      : process.env.LOCAL_DRAFT_BUILD === "1"
        ? ".next-preview"
        : ".next",
  async headers() {
    const preview =
      process.env.NODE_ENV === "development" ||
      process.env.LOCAL_DRAFT_BUILD === "1";
    const records = preview
      ? [main, ...games]
      : [main, ...games].filter((g) => g.status === "published");
    const dev = process.env.NODE_ENV === "development";
    const guideSections = fs
      .readdirSync(path.join(process.cwd(), "data/guides"))
      .filter((f) => f.endsWith(".json"))
      .flatMap((f) => {
        const guide = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), "data/guides", f), "utf8"),
        );
        return preview || guide.status === "published" ? guide.sections : [];
      });
    const frames = frameOrigins(records, guideSections);
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src ${frames.length ? frames.join(" ") : "'none'"}; connect-src 'self'${dev ? " ws://localhost:* ws://127.0.0.1:*" : ""}; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`,
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          ...(preview
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
            : []),
        ],
      },
    ];
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
