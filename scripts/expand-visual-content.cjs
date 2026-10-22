const fs = require("fs");
const additions = {
  "size-it-up": [
    [
      "read-the-yardstick",
      "Let the labelled reference set the scale",
      [
        "The familiar outline is useful because its measurement is printed on the board. Read that number before comparing the silhouettes. A domestic cat labelled 61 centimetres long is a specific yardstick; it is not an invitation to substitute the size of a pet you happen to remember. The other outline needs to be judged against that displayed measurement.",
        "Compare the dimension the round actually names. Length, height and width describe different spans of an object, while area describes an entire surface. An outline that looks twice as large on the screen is not automatically twice the area, and a tall object is not necessarily the longest one. The object label and unit keep your visual comparison attached to the right quantity.",
        "Use the ruler to translate a visual hunch into a measurement. If you picture an object as about three reference lengths, work out what three times the printed reference would mean. Then look back at the outline to see whether the proposed proportion still feels plausible. This alternation between ratio and measurement is more reliable than judging the empty space around the drawings.",
      ],
    ],
    [
      "adjust-deliberately",
      "Make one controlled adjustment at a time",
      [
        "Drag the adjustable outline’s corner or move along the ruler to change your estimate. The current measurement changes as you adjust it, so keep an eye on both the outline and the number. Releasing a drag is preparation rather than the final judgment; Lock it in is the control that submits the size you have chosen.",
        "The size control is also exposed as a labelled slider. Keyboard adjustment changed its value in the current interface: a right-arrow step moved one value from about 0.0884 to 0.0901. Do not assume that this is a fixed number of centimetres for every object. Read the updated measurement, especially when the game is showing things at very different scales.",
        "Avoid a succession of large unexamined adjustments. Decide whether the object needs to grow or shrink, move it once, and compare again with the labelled reference. When your estimate passes from clearly too short to clearly too long, the useful choice lies between those positions. The final small correction should express a judgment rather than a last-second accidental pointer movement.",
      ],
    ],
    [
      "interpret-the-reveal",
      "Read the dashed guess before pressing Next",
      [
        "Locking a guess reveals the measured size and leaves your estimate as a dashed outline. That gives you a visual explanation of the miss. When the real shape grows beyond the dashed one, you underestimated the named dimension. When it contracts inside the guess, you overestimated it. The comparison is more informative than looking only at the points added to the run.",
        "A revealed result of 3.2 times too small means the estimate needs a multiplicative correction. It does not mean adding 3.2 units to the number. A round with that result awarded 7 points and showed both the guessed and real measurement. Read the unit beside those values before translating the correction into a lesson for the next object.",
        "The generous-looking reference does not make every round equally easy. A familiar object can still be misleading when its largest dimension is not the one being asked for. After the reveal, name the assumption that caused the error: the wrong span, the wrong scale, or a memory of a different-sized example. That is a more useful takeaway than deciding the drawing simply looked deceptive.",
      ],
    ],
    [
      "five-round-decisions",
      "Treat the run as five separate scale judgments",
      [
        "A run contains five rounds and displays the accumulated score against 1,000. The interface identifies the current round, so check it before deciding that a low opening result has ended the attempt. Each new comparison supplies another reference and another chance to make a sound measurement judgment. A weak first guess is feedback to use rather than a reason to rush the remaining objects.",
        "Landing within five percent earns full marks in the current rules, while a miss by four times or more earns nothing for the round. These are relative tolerances. Being a few centimetres out can mean very different things for a tiny object and a huge landmark. Think in proportions first, then use the printed units to make the estimate concrete.",
        "On a small display, keep the ruler, the adjustable corner and Lock it in visible together. Expanding the player can make that comparison easier when the embedded board feels cramped. A browser zoom or screen-size change does not change the real measurement being asked for; continue using the in-game reference rather than measuring the drawing against the physical width of your device.",
      ],
    ],
  ],
  color: [
    [
      "remember-three-properties",
      "Remember a color as three separate properties",
      [
        "Use the brief target display to notice hue, saturation and brightness separately. Hue is the color family, such as red, green or blue. Saturation describes how vivid or washed out it is. Brightness describes its light-to-dark character. A useful memory contains all three observations, rather than only a broad label such as purple.",
        "Compare neighboring possibilities while the target is still visible. Is the green leaning toward yellow or toward blue? Does it look vivid or close to gray? Does it feel luminous or subdued? Those questions provide a small set of decisions to reconstruct after the target disappears. Trying to remember an exact imagined slider position before learning the controls is less useful.",
        "A strong color name can hide weak visual memory. Two shades both called blue may differ in every property that the score measures. Likewise, a dark vivid color and a light muted one can share a hue family while looking very different. Keep the adjective for brightness separate from the adjective for saturation when forming your mental description.",
      ],
    ],
    [
      "difficulty-and-exposure",
      "Choose the exposure time you can use well",
      [
        "Easy shows each target for five seconds, Medium for three and Hard for two in the current Daily version. All three ask you to rebuild a remembered color. The shorter exposure changes how much time you have to observe the target; it does not remove the need to compare the three properties. Start with a mode that lets you form a deliberate description.",
        "The opening Ready state precedes the target. Be looking at the player when the display begins instead of opening another tab or reading the page below it. Once the target has vanished, the reconstruction controls take over. A photograph of the screen or a color-picking tool would answer a different task from this memory challenge.",
        "Change one habit between runs. For example, first try noticing the hue direction before worrying about lightness; on another run, concentrate on whether the target is muted or vivid. Changing the difficulty at the same time makes it harder to tell why a result changed. Comparing attempts within the same mode gives your observations a clearer context.",
      ],
    ],
    [
      "rebuild-with-controls",
      "Use the sliders to test your memory",
      [
        "After the target disappears, adjust the Hue, Saturation and Brightness bars. Start with the property you remember most clearly, then refine the others. Each adjustment changes the resulting swatch, so periodically compare it with your mental description. Moving all three controls quickly can make it difficult to tell which change improved the match.",
        "The controls are labelled sliders and support keyboard steps in the current interface. A right-arrow step changed Hue from 266 to 267 during a reconstruction. That is useful for a small correction after a larger adjustment, but the numerical precision cannot restore a target you did not observe. Use the number to control a decision, rather than assuming an exact-looking value must be accurate.",
        "Lock in this color submits the reconstruction. A result follows with your pick and the original, including their hue, saturation and brightness values. That comparison is the point to separate a family error from a lightness or vividness error. Keep the submitted value as the decision you made; do not mistake the revealed original for a second opportunity to change the same guess.",
      ],
    ],
    [
      "learn-from-comparison",
      "Find the property that cost the match",
      [
        "Each color is scored out of ten, and three colors form a round scored out of thirty. A result of 3.31 out of ten appeared after a submitted h267 s50 b50 was compared with an original h350 s97 b65. That example is a completed comparison, not a set of coordinates to memorize for another target. The large hue and saturation differences explain why a broadly colorful reconstruction could still look unlike the original.",
        "Read the side-by-side swatches as well as the numerical values. If the hue family is similar but the pick looks dull, saturation deserves attention. If both look similarly vivid but one is much darker, brightness may be the clearer issue. More than one property can be wrong, so identify the largest visible difference before making a rule for the next color.",
        "Display conditions affect the experience of comparing colors. Keep your screen brightness and any color-shifting display mode steady during a round so the target and reconstruction are viewed under similar conditions. This game is a visual memory exercise, not a calibrated test of a monitor or a diagnosis of color vision. A disappointing score by itself does not establish a hardware or health problem.",
      ],
    ],
  ],
};
const games = JSON.parse(fs.readFileSync("data/games/games.json", "utf8"));
for (const game of games)
  for (const [id, heading, paragraphs] of additions[game.id] || []) {
    const s = {
      id,
      heading,
      blocks: paragraphs.map((text) => ({ type: "paragraph", text })),
    };
    const i = game.content.findIndex((x) => x.id === id);
    if (i < 0) game.content.push(s);
    else game.content[i] = s;
  }
fs.writeFileSync(
  "data/games/games.json",
  JSON.stringify(games, null, 2) + "\n",
);
