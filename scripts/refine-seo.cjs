const fs = require("fs");
const games = JSON.parse(fs.readFileSync("data/games/games.json"));
const titles = {
  krillion: "Krillion Unlimited — Find Valid Uncommon Answers",
  fermi: "Play Fermi Online — Estimate Numbers and Build Streaks",
  poople: "Poople Unlimited — Plan a Four-Letter Word Ladder",
  "size-it-up": "Size It Up Online — Compare Shapes and Judge Scale",
  color: "Color Game Online — Rebuild a Shade from Memory",
  "color-logo": "Logo Game Online — Restore the Brand Color You Recall",
  maptap: "MapTap Online — Place Cities and Learn from Distance",
  "word-hunt": "Word Hunt Online — Find Words Across the Letter Grid",
};
for (const g of games) g.seo.title = titles[g.id];
fs.writeFileSync(
  "data/games/games.json",
  JSON.stringify(games, null, 2) + "\n",
);
