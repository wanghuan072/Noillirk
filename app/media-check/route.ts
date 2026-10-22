import fs from "node:fs/promises";
import path from "node:path";
import { safeFrameUrl } from "@/lib/security";
import { isLocalMediaHost, localMediaPolicy } from "@/lib/local-media-policy";

type Candidate = {
  id: string;
  title: string;
  gameSrc: string;
  videoIds: string[];
  sandbox: string[];
};
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (
    process.env.NODE_ENV !== "development" ||
    !isLocalMediaHost(request.headers.get("host")) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  )
    return new Response("Not found", { status: 404 });
  const { candidates } = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), "research/media-check-candidates.json"),
      "utf8",
    ),
  ) as { candidates: Candidate[] };
  const candidate = candidates.find((c) => c.id === url.searchParams.get("id"));
  const game = candidate && safeFrameUrl(candidate.gameSrc);
  if (
    !candidate ||
    !game ||
    !candidate.videoIds.every((id) => /^[\w-]{11}$/.test(id)) ||
    !candidate.sandbox.length ||
    !candidate.sandbox.every((token) =>
      ["allow-scripts", "allow-same-origin", "allow-forms"].includes(token),
    )
  )
    return new Response("Not found", { status: 404 });
  const videos = candidate.videoIds
    .map(
      (id) =>
        `<iframe title="${escape(candidate.title)} video candidate ${id}" src="https://www.youtube-nocookie.com/embed/${id}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; fullscreen" allowfullscreen></iframe>`,
    )
    .join("");
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Local candidate check</title><style>body{margin:0;background:#f5f4ed;color:#103c3b;font:16px system-ui}main{max-width:1400px;margin:auto;padding:20px}iframe{display:block;width:100%;height:720px;border:1px solid #557675;background:#fff}section{margin-top:240px}h1{font-size:26px;line-height:32px;margin:0 0 16px}h2{line-height:28px;margin:0 0 16px}p{line-height:24px;margin:0 0 16px}</style></head><body><main><h1>${escape(candidate.title)} candidate check</h1><p>Local development only. This candidate is not approved for publication.</p><div id="candidate-game"><iframe title="${escape(candidate.title)} game candidate" src="${escape(candidate.gameSrc)}" sandbox="${escape(candidate.sandbox.join(" "))}" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>${videos ? `<section id="candidate-video"><h2>Video candidate</h2><p>Review identity, visible actions, restrictions and actual playback before adoption.</p>${videos}</section>` : ""}</main></body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Content-Security-Policy": localMediaPolicy(game.origin, !!videos),
      },
    },
  );
}
