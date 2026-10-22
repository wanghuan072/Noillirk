# Architecture decisions

Keep Next.js 16.4.2 App Router, React 19.3.0, TypeScript and npm. Local installed Next documentation for layouts/pages, metadata and static outputs was read. Preserve cacheComponents, partialPrefetching and the existing Tailwind build integration; write project layout in ordinary CSS to avoid unintended width variants. Use local system fonts, avoiding build-time font downloads.

Production target: portable Node standalone output, with public/ and static assets packaged alongside the generated server. This retains framework response headers, compression and CSP without host-specific static-header configuration. Draft local compilation uses a separate `.next-preview` build identity, localhost server and `/preview/...` routes, never production publication approval.

Create lib/content.ts (types/loaders/selection), lib/security.ts (URL safety and CSP), lib/site.ts (identity/paths), components/GamePlayer.tsx, Shell.tsx, GamePage.tsx, ContentBlocks.tsx, StickySidebar.tsx, GuidePage.tsx. Create explicit Game and Guide templates, a static utility router and an isolated preview router. Change app/layout.tsx/page.tsx/globals.css and next.config.ts; retain App Router and tsconfig alias. No unrelated migration.

Create scripts/validate.ts for shared draft/media/release validation; scripts/run-command.cjs for command lifecycles; scripts/build-preview.cjs for explicit local diagnostic compile; scripts/build-release.cjs always runs strict release validation before Next. No bypass argument may make release build consume drafts. Missing game images are only allowed on the explicitly noindex local preview; they are never represented by another game's cover.

SEO static constants live in seo/tdk.js; homepage entry imports main JSON. Game and Guide metadata remain in their respective JSON. Common metadata function derives canonical and fixed social image. Release sitemap is derived from published routes only and must not include preview. Persistent fingerprints cover actual recommendation cards; date update mode is separate from read-only build checks. Keep release failure visible until all media/runtime/content gates pass.
