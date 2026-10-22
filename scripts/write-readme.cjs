const fs = require("fs");
fs.writeFileSync(
  "README.md",
  `# Noillirk

Noillirk is a familiar-answer guessing game. Read a category, choose one fitting response and see how its familiarity carries a balloon climb upward. A plain answer can be a strong choice, while a specialized answer can be valid without being the most familiar.

## Play and learn

The game page brings the player, controls and explanations together. Play Now opens the embedded game. Webpage Fullscreen expands the player inside the page; Browser Fullscreen uses the browser’s fullscreen control when available.

Two player guides address different decisions: choosing a response before the clock expires, and understanding score tiers and Endless balloons after the result. More Games provides another route into word, estimation and memory challenges.

## Explore

- [Home](https://noillirk.me/) — the main Noillirk game page and an introduction to the climb.
- [Guides](https://noillirk.me/guides) — choose a task to work on before your next run.
- [More Games](https://noillirk.me/games) — discover another kind of guessing or word challenge.

## Legal and website information

- [Privacy Policy](https://noillirk.me/privacy) — game connections, browser choices and website data practices.
- [Terms of Service](https://noillirk.me/terms) — using the independent website and third-party game players.
- [Copyright](https://noillirk.me/copyright) — the distinction between original site work and game ownership.
- [About Us](https://noillirk.me/about) — the website’s player-focused purpose and independent status.
- [Contact Us](https://noillirk.me/contact) — the address for website corrections and accessibility questions.

## Common questions

**Does a valid answer always earn the top tier?** No. Answer acceptance and familiarity ranking are different parts of a result.

**Does the website make the embedded game?** No. The game operates through its provider, and this independent website does not claim an official relationship or ownership of the game’s artwork and audio.

**Should I keep typing after a timeout?** Read the finished result and use the next control. A completed prompt is different from an entry refused while the clock is still active.
`,
);
