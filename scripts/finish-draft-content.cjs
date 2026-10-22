const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const games = read("data/games/games.json");
const descriptions = {
  krillion:
    "Play Krillion Unlimited and search for valid uncommon answers. Read the category, follow rarity feedback, and learn how Classic dives differ from Endless air.",
  fermi:
    "Play Fermi and estimate quantities using units, rounded assumptions and sensible bounds. Learn how factor-of-ten survival differs from a small numerical gap.",
  poople:
    "Play Poople Unlimited and connect four-letter words to POOP. Explore legal letter changes, route planning, par and what the completed ladder can teach you.",
  "size-it-up":
    "Play Size It Up and estimate an outline against a measured reference. Learn to judge proportions, lock a guess and compare the reveal across five rounds.",
  color:
    "Play the Color Game and rebuild a briefly shown shade with sliders. Learn to separate hue, saturation and brightness, then inspect the comparison feedback.",
  "color-logo":
    "Play Logo Game and restore a familiar brand color in its marked region. Choose a deck, adjust the sliders and compare your remembered shade with the reveal.",
  maptap:
    "Play MapTap and locate cities on a globe using their country and coastline. Learn to separate globe rotation, a considered placement and distance feedback.",
  "word-hunt":
    "Play Word Hunt and look for connected words on a four-by-four letter grid. Explore vocabulary routes and use same-letter shuffles to find new opportunities.",
};
for (const g of games) {
  g.seo.description = descriptions[g.id];
  for (const s of g.content)
    for (const b of s.blocks)
      if (b.type === "paragraph")
        b.text = b.text.replace(
          "The Daily directory describes a four-by-four grid and three same-letter shuffles.",
          "This version uses a four-by-four grid and offers three same-letter shuffles.",
        );
}
write("data/games/games.json", games);
let main = read("data/games/main-game.json");
for (const s of main.content)
  for (const b of s.blocks)
    b.text =
      b.text?.replace(
        "In the observed interface, an out-of-time result led to a Next control.",
        "An out-of-time result can lead to a Next control.",
      ) || b.text;
write("data/games/main-game.json", main);
let cap = read("planning/site-capabilities.json");
cap.features.gameIframes = {
  enabled: true,
  implementation: "components/GamePlayer.tsx, isolated local preview",
  notes:
    "Created only after Play Now; third-party provider may offer its own storage/accounts/ads.",
};
cap.features.youtubeIframes = {
  enabled: false,
  implementation: "components/ContentBlocks.tsx; no video blocks adopted",
  notes: "Renderer exists but no YouTube iframe is enabled in current content.",
};
write("planning/site-capabilities.json", cap);
console.log("Draft metadata and actual capability matrix updated.");
