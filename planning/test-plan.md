# Executable check plan

Use Node TypeScript support via the installed tsx dependency only if needed; otherwise compiled app plus Node built-in tests. `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:data`, `npm run build:preview`, `npm run build`.

Safety tests cover malicious protocols/credentials/local and reserved hosts, shared navigation, main route uniqueness, stable IDs, draft filtering and strict release gate refusal. Browser checks use current-build localhost readiness and real UI interactions: zero initial game iframes, one after Play Now, configured src, timeout/retry, both fullscreen modes and cross-document cleanup. Record which checks are only diagnostic and which remain unrun.

Check actual 1536/1024/768 and mobile geometry, sidebar parent boundaries, 1400px width, card currentSrc/href identity, no runtime/CSP errors, complete routes and back navigation. No test may call a missing cover a pass. Mobile/Desktop Lighthouse requires same-build production-mode preview; draft-only measurements must not count as production acceptance.

The complete workflow remains unpassed until eight independent additional game inputs, full bodies, per-game permitted media, exact-version adopted videos, Guide tasks and SEO/date fingerprints are validated.
