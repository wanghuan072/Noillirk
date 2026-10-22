import { SitePage } from "@/components/SitePage";
import { isLocalPreview, legalNavigation } from "@/lib/site";
import {
  getGame,
  getGuide,
  publishedGames,
  publishedGuides,
  previewGames,
  previewGuides,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { tdk } from "@/seo/tdk";
import { Suspense } from "react";
const includeDrafts = isLocalPreview;
export function generateStaticParams() {
  return [
    ...["games", "guides", ...legalNavigation.map((x) => x.path.slice(1))].map(
      (x) => ({ segments: [x] }),
    ),
    ...(includeDrafts ? previewGames() : publishedGames()).map((g) => ({
      segments: ["games", g.slug],
    })),
    ...(includeDrafts ? previewGuides() : publishedGuides()).map((g) => ({
      segments: ["guides", g.slug],
    })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const segments = (await params).segments,
    path = "/" + segments.join("/");
  const seo =
    segments[0] === "games" && segments[1]
      ? getGame(segments[1], includeDrafts)?.seo
      : segments[0] === "guides" && segments[1]
        ? getGuide(segments[1], includeDrafts)?.seo
        : tdk[segments[0] as keyof typeof tdk];
  return pageMetadata(
    seo || { title: "", description: "" },
    path,
    isLocalPreview,
  );
}
async function ResolvedPublicPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  const path = "/" + (await params).segments.join("/");
  return <SitePage path={path} preview={includeDrafts} />;
}
export default function PublicPage({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="container" role="status">
          Opening page…
        </p>
      }
    >
      <ResolvedPublicPage params={params} />
    </Suspense>
  );
}
