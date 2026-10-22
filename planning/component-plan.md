# Component contracts

Header observes height, reads one nav configuration, exposes accessible hamburger and Escape handling. Footer reads the same primary nav plus the five root Legal paths. Use ordinary anchors for document navigation.

GamePage owns the shared left rail and parent-bounded right sidebar. GamePlayer alone creates game iframes after Play Now, validates URL, tracks timeout/retry, owns distinct panel and four-corner fullscreen icons and restores focus/scroll on exit/unload. No universal game image fallback. In local-only diagnostic previews, an unillustrated surface may expose controls; release validation rejects missing cover.

BodyBlocks renders typed JSON, never arbitrary HTML. Video blocks render adopted YouTube IDs only, directly after body in lazy privacy-enhanced frames. GameCard reads the current stable Game only; missing art is omitted in diagnostic preview and rejected for release. GuidePage has compact breadcrumb, title, introduction, dates when known, tags and matching original cover; no invented author.
