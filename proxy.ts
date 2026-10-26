import { NextResponse, type NextRequest } from "next/server";
import inventory from "./config/routes.json";
import deployment from "./config/deployment.json";
import mediaChecks from "./research/media-check-candidates.json";
import mainGame from "./data/games/main-game.json";
import gameDrafts from "./data/games/games.json";
import { frameOrigins, safeFrameUrl } from "./lib/security";
import { isLocalMediaHost, localMediaPolicy } from "./lib/local-media-policy";
export function proxy(request: NextRequest) {
  const p = request.nextUrl.pathname;
  const development = process.env.NODE_ENV === "development";
  const draftBuild = process.env.LOCAL_DRAFT_BUILD === "1";
  const localDraft = development || draftBuild || deployment.mode === "review";
  if (draftBuild && !isLocalMediaHost(request.headers.get("host")))
    return new NextResponse("Not found", { status: 404 });
  if (
    development &&
    p === "/media-check" &&
    isLocalMediaHost(request.headers.get("host")) &&
    ["localhost", "127.0.0.1", "[::1]"].includes(request.nextUrl.hostname)
  ) {
    const candidate = mediaChecks.candidates.find(
      (c) => c.id === request.nextUrl.searchParams.get("id"),
    );
    const game = candidate && safeFrameUrl(candidate.gameSrc);
    if (candidate && game)
      return NextResponse.next({
        headers: {
          "Content-Security-Policy": localMediaPolicy(
            game.origin,
            candidate.videoIds.length > 0,
          ),
        },
      });
  }
  if (localDraft && (p === "/preview" || p.startsWith("/preview/"))) {
    const target = request.nextUrl.clone();
    target.pathname = p.slice("/preview".length) || "/";
    if (inventory.draftPaths.includes(target.pathname))
      return NextResponse.redirect(target);
  }
  // Draft data changes must reach an existing local dev process through HMR.
  // next.config headers are evaluated at startup; never broaden production here.
  if (development && isLocalMediaHost(request.headers.get("host"))) {
    const current =
      p === "/" ? mainGame : gameDrafts.find((g) => p === `/games/${g.slug}`);
    if (current) {
      const frames = frameOrigins([current]);
      return NextResponse.next({
        headers: {
          "Content-Security-Policy": `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; frame-src ${frames.length ? frames.join(" ") : "'none'"}; connect-src 'self' ws://localhost:* ws://127.0.0.1:*; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`,
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      });
    }
  }
  const allowed =
    (development && p === "/media-check") ||
    inventory.publicPaths.includes(p) ||
    p === "/robots.txt" ||
    p === "/sitemap.xml" ||
    p === "/favicon.ico" ||
    (localDraft && inventory.draftPaths.includes(p)) ||
    ((process.env.NODE_ENV === "development" ||
      process.env.LOCAL_DRAFT_BUILD === "1") &&
      inventory.previewPaths.includes(p));
  if (allowed) return NextResponse.next();
  return new NextResponse(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found</title></head><body><main><h1>Page not found</h1><p>This address does not have a page.</p><a href="/">Return Home</a></main></body></html>',
    {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      },
    },
  );
}
export const config = { matcher: ["/((?!_next/|images/).*)"] };
