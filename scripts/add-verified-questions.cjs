const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p));
const faq = {
  noillirk: [
    [
      "Does a fitting answer always earn Sky High?",
      "No. Category acceptance and familiarity are different checks. A fitting response can receive a lower tier; the strongest familiar answer earns the highest lift.",
    ],
    [
      "How long is a Classic climb in this version?",
      "Daily’s Classic climb has seven prompts with fifteen seconds for each. These rules describe the configured Daily version rather than every game using the same name.",
    ],
    [
      "What protects an Endless run?",
      "Endless starts with three balloons. An accepted answer preserves them, a missed or passed prompt removes one, and a Sky High result can restore a missing balloon.",
    ],
  ],
  krillion: [
    [
      "Why can a rare answer still be refused?",
      "Rarity does not replace category fit. The response must answer the actual prompt before an uncommon example can earn a stronger result.",
    ],
    [
      "How much time does this Classic dive allow?",
      "The Daily Unlimited opening screen identifies seven prompts, with twenty-five seconds for each. A separate daily Krillion implementation can use different rules.",
    ],
    [
      "Do depth and air mean the same thing?",
      "No. Depth describes progress, while Endless air is a survival limit. Check the current mode and air count before risking a missed answer.",
    ],
  ],
  fermi: [
    [
      "Do I have to estimate the exact answer to survive?",
      "No. In this Daily version an estimate within ten times the answer, high or low, keeps the streak going. Accuracy labels describe how close that surviving estimate was.",
    ],
    [
      "Can a low estimate still be a bullseye?",
      "Yes. A slightly low estimate can be within the bullseye band. For example, 2 against a revealed 2.07 produced a 1.03-times-low Bullseye result.",
    ],
    [
      "Is this the daily game on fermi.gg?",
      "No. Daily’s implementation is an unlimited survival streak. Do not transfer a separate site’s daily set or scoring format to this player.",
    ],
  ],
  poople: [
    [
      "Can I change two letters if the next word is real?",
      "No. Every accepted move must change exactly one position from the latest accepted word. A real word can still be refused for changing too many letters.",
    ],
    [
      "Does every dealt starting word have a route to POOP?",
      "The current Unlimited word pool is restricted to connected words, so the starting word is chosen to have a route under the game’s rules.",
    ],
    [
      "What happens when I choose New word?",
      "A different starting word becomes available instead of waiting for a shared daily puzzle. Finish the ladder you want to study before replacing it.",
    ],
  ],
  "size-it-up": [
    [
      "What should I compare with the mystery outline?",
      "Use the labelled measurement of the reference outline and the dimension named by the prompt. Compare length with length or the requested span, rather than judging total screen area.",
    ],
    [
      "When is my estimate submitted?",
      "Adjust the outline or ruler first, then select Lock it in. The reveal compares the measured size with the dashed outline of your guess.",
    ],
    [
      "How close earns full marks?",
      "The current rules award full marks within five percent. A miss by four times or more earns no points for the round.",
    ],
  ],
  color: [
    [
      "What changes between Easy, Medium and Hard?",
      "The target display lasts five, three or two seconds respectively in this version. Each mode still asks you to rebuild the remembered color.",
    ],
    [
      "Which controls rebuild the color?",
      "Hue, Saturation and Brightness are separate sliders. Use the resulting swatch to compare your adjustments with the color you remember.",
    ],
    [
      "What is the total for a complete round?",
      "Three colors form a round. Each color is scored out of ten, giving a total out of thirty.",
    ],
  ],
  "color-logo": [
    [
      "Which part of a multicolor logo should I change?",
      "The outline identifies the region being judged. Restore that part rather than attempting to recolor the entire mark.",
    ],
    [
      "Does the initially wrong color help identify the right shade?",
      "Use your memory of the brand instead of assuming that a small change to the displayed wrong color will be enough. Its other color properties are not a dependable answer clue.",
    ],
    [
      "How many logos make a round?",
      "A round contains three logos and is scored out of thirty. Pick a deck whose brands you want to practice recognizing.",
    ],
  ],
  maptap: [
    [
      "Does the prompt give more than a city name?",
      "Yes. The country is named too. Use it to choose the right landmass and then narrow the location inside that country.",
    ],
    [
      "How many locations are in a run?",
      "This Unlimited implementation has five places per run. Review each distance reveal as well as the accumulated score.",
    ],
    [
      "Why rotate the globe before choosing a point?",
      "Bringing the relevant region toward the front makes its coastlines and borders easier to judge. A point near the globe’s edge is visually compressed.",
    ],
  ],
  "word-hunt": [
    [
      "How large is the letter board?",
      "The current interface uses a four-by-four board, giving sixteen letter positions to inspect.",
    ],
    [
      "How long is the opening timer?",
      "The observed Play screen begins a two-minute countdown. Keep the active timer in view while working through the board.",
    ],
    [
      "Does Shuffle promise new letters?",
      "The interface describes three same-letter shuffles. The arrangement changes while the letter pool stays the same, so look for newly connected routes.",
    ],
  ],
};
const main = read("data/games/main-game.json"),
  games = read("data/games/games.json");
for (const g of [main, ...games]) {
  g.content = g.content.filter((s) => s.id !== "player-questions");
  g.content.push({
    id: "player-questions",
    heading: "Questions for your next round",
    blocks: [
      {
        type: "faq",
        items: faq[g.id].map(([question, answer]) => ({ question, answer })),
      },
    ],
  });
}
fs.writeFileSync(
  "data/games/main-game.json",
  JSON.stringify(main, null, 2) + "\n",
);
fs.writeFileSync(
  "data/games/games.json",
  JSON.stringify(games, null, 2) + "\n",
);
