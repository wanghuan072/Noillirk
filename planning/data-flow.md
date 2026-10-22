# Data flow

project.yaml -> build decisions; content-map -> shared nav and identity; main-game.json -> homepage, player, SEO and derived CSP; games.json -> Game ID loaders -> lists/details/recommendations/metadata/sitemap. Each Guide JSON -> Guide list/detail/TOC/metadata/sitemap. No page-specific duplicate game strings, frame addresses or cover paths.

Published loaders never return drafts. Local preview loaders are separate entrypoints and only enabled for the named diagnostic build. Preview uses `/preview` paths, noindex and no publication dates. Public missing records return 404. Main-game slug never generates an additional-game detail.

No site accounts, forms, comments, analytics, storage, payments, uploads, subscriptions or advertisements. A game iframe may independently offer third-party features. No author/publisher identity fabricated. Media ledger adoption must precede image/video rendering. Separate command, runtime and acceptance records preserve incomplete outcomes.
