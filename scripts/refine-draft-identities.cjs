const fs = require("fs");
const p = "data/games/games.json",
  games = JSON.parse(fs.readFileSync(p));
const descriptions = {
  krillion:
    "Name an uncommon answer that still fits the category and take a deeper dive.",
  fermi:
    "Break a surprising number into smaller guesses, then see how close your estimate lands.",
  poople: "Change one letter at a time to build a real-word route to POOP.",
  "size-it-up":
    "Size up an outline against a measured reference, then lock in your best guess.",
  color:
    "Study a color before it disappears, then rebuild its hue, saturation and brightness.",
  "color-logo":
    "Restore the outlined part of a familiar logo to the brand color you remember.",
  maptap:
    "Find the named city’s country on the globe and place your best location guess.",
  "word-hunt":
    "Search a 4×4 letter board for words and decide when a shuffle could open a new route.",
};
for (const g of games) {
  g.shortDescription = descriptions[g.id];
  if (g.id === "poople") {
    g.title = "Poople Unlimited";
    g.spoilerPolicy = "marked";
    const s = g.content.find((s) => s.id === "one-position");
    if (s && !s.blocks.some((b) => b.type === "callout"))
      s.blocks.splice(1, 0, {
        type: "callout",
        tone: "warning",
        label: "Worked ladder fragment ahead",
        body: "The next two paragraphs reveal two intermediate words from one starting word. Skip to the next section if you want to avoid seeing an example route.",
      });
  }
  if (g.id === "maptap") {
    g.title = "MapTap Unlimited";
    g.seo.title = "MapTap Unlimited — Place Cities and Judge Distance";
  }
  if (g.id === "color") {
    for (const s of g.content)
      for (const b of s.blocks)
        if (b.text?.includes("This game is a visual memory exercise"))
          b.text =
            "Display conditions affect the experience of comparing colors. Keep your screen brightness and any color-shifting display mode steady during a round so the target and reconstruction are viewed under similar conditions. Compare your decisions within the same mode and display conditions to make the result easier to interpret.";
  }
}
fs.writeFileSync(p, JSON.stringify(games, null, 2) + "\n");
