const fs = require("fs");
const additions = {
  fermi: [
    [
      "define-the-number",
      "Define the number before choosing a number",
      [
        "Start with the unit printed beside the answer field. A question about hours is asking for time, even if its story begins with food, energy or an electrical appliance. A question about how many objects fit in a space is asking for a count. The final value needs to answer that quantity rather than an interesting intermediate quantity you calculated along the way.",
        "Separate a total from the size of one item. For a stack-height problem, a useful model is total height divided by the thickness of one item. For a covering problem, it is total area divided by the area of one item. Those are different models: dividing an area by a length does not produce an item count. Keeping the units alongside the numbers exposes that mistake before you submit.",
        "Treat the small print as part of the question. Whether a stack uses bare objects or their packaging can change its height substantially. Whether a duration is requested in seconds or hours changes the numerical answer by a conversion factor. A careful estimate of a different interpretation can still miss the question that is actually on screen.",
      ],
    ],
    [
      "build-an-estimate",
      "Build an estimate you can check",
      [
        "Choose rounded assumptions that you can explain to yourself. Suppose an imaginary shelf is 90 centimetres long and the books you picture are about 3 centimetres thick. Dividing 90 by 3 gives about 30 books. This is an arithmetic illustration, not a hidden answer from the live game. The useful habit is identifying the total and the amount consumed by each item.",
        "When the assumptions are uncertain, try two plausible values for the most influential one. In the shelf illustration, 2-centimetre books give 45 while 5-centimetre books give 18. That spread tells you more about the uncertainty than adding decimal places to the original estimate. Improve the assumption with the largest effect instead of polishing every small input equally.",
        "Make the last step a scale check. If the result is thousands, ask whether a few hundred or a few million could plausibly fit the story. Check that you did not mix metres with centimetres, or an hourly rate with a time measured in minutes. The calculator can combine numbers, but it cannot decide whether the quantities describe the right model.",
      ],
    ],
    [
      "read-ratio",
      "Read the ratio and the direction together",
      [
        "Fermi judges distance from the answer multiplicatively. For an illustrative answer of 500, guesses of 50 and 5,000 are both ten times off. They have very different numerical gaps, yet they sit at the same survival boundary. A guess below 50 or above 5,000 would be outside that boundary for this example. The distinction matters when comparing errors on tiny and enormous quantities.",
        "The current Daily version keeps a run going when the estimate is within a factor of ten, on either side of the answer. Within a factor of two is close; within 1.1 is a bullseye. Those labels describe accuracy. The run counter describes how many questions you have survived consecutively, so a modest surviving estimate still advances the counter.",
        "A result can be slightly low and still be a bullseye. One observed submission of 2 against a revealed 2.07 produced a 1.03-times-low result, a Bullseye label and a streak of one. Read all three signals instead of treating the words too low as an automatic loss. The numerical ratio explains how large the error was; the streak tells you whether the run continues.",
      ],
    ],
    [
      "learn-after-result",
      "Use the explanation to repair one assumption",
      [
        "After submitting, compare the revealed answer with your own model before moving to the next question. The How it adds up control provides the worked explanation for the current problem. Look for a definition, a conversion or an assumption that differs from yours. Memorizing the final number is less useful than discovering which step moved your estimate by the largest factor.",
        "If an estimate ends a streak, distinguish a model error from an arithmetic error. Counting journeys when the question asks for people can duplicate the quantity even when every multiplication is correct. Mixing a thin object with its retail box changes the item size. Repair that particular interpretation instead of deciding that your general sense of numbers is unreliable.",
        "The answer field accepts numerical expressions and scale notation in this version, including examples such as 12k and 3e6. Read the parsed value shown beside the field before selecting Guess. A correctly parsed input is only preparation; the revealed answer and result label confirm that a submission was judged. If those never appear, retry the player rather than assuming the streak changed.",
      ],
    ],
  ],
  poople: [
    [
      "one-position",
      "Check positions, not just the sound of a word",
      [
        "A Poople move changes exactly one letter while keeping a real four-letter word. Compare the proposed word with the latest accepted rung, position by position. The first letter of the new word is compared with the first letter of the current word, and so on. Rearranging letters is a different operation, even if the resulting word is familiar.",
        "A legal-looking English word can fail the transformation rule. In an observed ladder, HALO changed to HALT successfully. Trying HELP next changed both the second and fourth positions of HALT, and the game displayed Change exactly one letter. The problem was the two changes, rather than the fact that HELP is a recognizable word.",
        "The rejected entry remained available to edit. Deleting it and entering HALE changed only the final position of HALT, allowing the ladder to continue. This short example illustrates validation and recovery without revealing a complete route to the target. When an entry is refused, compare it with the last accepted rung, rather than with the starting word or the destination.",
      ],
    ],
    [
      "plan-a-bridge",
      "Look for a bridge before committing to a branch",
      [
        "The destination is always POOP, but making a word look more like it is not the same as proving the next step exists. A move can introduce a target letter and still leave an awkward letter pattern. Think about at least one possible continuation before using a tempting rung. The practical question is which real word you could enter after it.",
        "Work briefly from both ends when the forward route is unclear. Consider the kinds of real four-letter words that can differ from POOP in one position, then look for a connection from your current pattern. You do not need to write an entire answer chain to use this idea. Recognizing that a promising forward word could connect to a near-target pattern can be enough to justify the move.",
        "Avoid treating every target-matching letter as permanently fixed. Some routes may require changing a position again to create a valid intermediate word. The rule tests adjacent rungs, not an increasing count of target letters. A short detour through a real word can be more useful than repeatedly proposing a closer-looking combination that is not accepted.",
      ],
    ],
    [
      "clock-and-par",
      "Use par and the clock for different decisions",
      [
        "Par gives the ladder a move-count benchmark before you begin. The clock measures the time spent on the attempt. They describe different kinds of efficiency: thinking through a connection can protect your move count, while entering a sequence quickly can improve time. Decide which habit you are practicing instead of reacting to both numbers at once.",
        "In the observed opening, the clock stayed at zero while the first proposed word was entered and began running when that first valid rung was accepted. That gives you a useful moment to inspect the initial word and think of a connection. Once the ladder is underway, a refused change can leave the clock running even though it adds no accepted rung.",
        "An extra accepted rung is not the same failure as an invalid word. The former can create a longer route; the latter fails to advance the ladder. When reviewing a run, identify whether you lacked vocabulary, overlooked the one-position rule or committed to an inefficient branch. Each problem calls for a different change on the next attempt.",
      ],
    ],
    [
      "recover-ladder",
      "Recover without losing track of the current rung",
      [
        "Use the visible keyboard to enter a complete four-letter proposal, then select Enter. Delete edits the proposal before it is accepted. After a refusal, repair the visible proposal rather than typing another full word on top of it. Confirm that the expected four letters are on screen before submitting again.",
        "Undo, Restart, Give up and New word serve different purposes in the interface. Read the current ladder before choosing a control that changes the attempt. An undo is useful when reconsidering a branch; a new starting word abandons the problem you were studying. Give up can expose a route, so avoid it when you want to solve the current ladder without a reveal.",
        "This is the Unlimited implementation, with a fresh starting word available rather than a single shared daily puzzle. The dealt vocabulary is restricted to words connected to POOP by the game’s rules. A difficult starting pattern is therefore a search problem to work through, not evidence that you need to invent a nonword. The on-screen keyboard remains an alternative when a device keyboard does not target the game.",
      ],
    ],
  ],
};
const games = JSON.parse(fs.readFileSync("data/games/games.json", "utf8"));
for (const game of games) {
  for (const [id, heading, paragraphs] of additions[game.id] || []) {
    const section = {
      id,
      heading,
      blocks: paragraphs.map((text) => ({ type: "paragraph", text })),
    };
    const index = game.content.findIndex((s) => s.id === id);
    if (index < 0) game.content.push(section);
    else game.content[index] = section;
  }
}
fs.writeFileSync(
  "data/games/games.json",
  JSON.stringify(games, null, 2) + "\n",
);
