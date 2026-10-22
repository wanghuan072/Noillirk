import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { isLocalPreview, legalNavigation } from "@/lib/site";
import {
  getGame,
  getGuide,
  mainGame,
  previewGames,
  previewGuides,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { tdk } from "@/seo/tdk";
import { Suspense } from "react";
export function generateStaticParams() {
  return isLocalPreview
    ? [
        { segments: [] },
        ...[
          "games",
          "guides",
          ...legalNavigation.map((x) => x.path.slice(1)),
        ].map((x) => ({ segments: [x] })),
        ...previewGames().map((g) => ({ segments: ["games", g.slug] })),
        ...previewGuides().map((g) => ({ segments: ["guides", g.slug] })),
      ]
    : [];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const segments = (await params).segments || [],
    path = "/" + segments.join("/");
  const seo =
    path === "/"
      ? mainGame.seo
      : segments[0] === "games" && segments[1]
        ? getGame(segments[1], true)?.seo
        : segments[0] === "guides" && segments[1]
          ? getGuide(segments[1], true)?.seo
          : tdk[segments[0] as keyof typeof tdk];
  return pageMetadata(seo || { title: "", description: "" }, path, true);
}
async function ResolvedPreview({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  if (!isLocalPreview) notFound();
  const path = "/" + ((await params).segments || []).join("/");
  return <SitePage path={path} preview />;
}
export default function PreviewPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  if (!isLocalPreview) notFound();
  return (
    <Suspense
      fallback={
        <p className="container" role="status">
          Opening page…
        </p>
      }
    >
      <ResolvedPreview params={params} />
    </Suspense>
  );
}
