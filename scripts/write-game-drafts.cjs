const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const paragraph = (text) => ({ type: "paragraph", text });
const section = (id, heading, ...texts) => ({
  id,
  heading,
  blocks: texts.map(paragraph),
});
const main = read("data/games/main-game.json");
main.tags = ["Familiar answers", "Timed trivia", "Balloon climb"];
main.categories = ["guessing", "word"];
main.seo = {
  title: "Noillirk Online — Familiar Answers and Balloon Runs",
  description:
    "Play Noillirk online and choose a familiar answer before time runs out. Learn the climb, recognize scoring feedback and find practical help for your next run.",
  keywords: ["Noillirk", "familiar answers"],
};
main.content = [
  section(
    "the-climb",
    "A category, a short clock and a reason to think simply",
    "Noillirk asks you to name an answer that fits a category and feels familiar to other people. The challenge is different from finding the only correct fact in a quiz. Several responses may belong to the category, yet they do not have the same value. You are choosing among plausible answers while a short clock limits how long you can compare them.",
    "The balloon climb gives that decision a visible result. Familiar accepted responses lift the character farther, while less familiar accepted responses contribute less. It is possible to know a great deal about a topic and still select something less immediate than the ordinary example another person would name. That tension makes a simple prompt worth thinking about without requiring a complicated set of controls.",
    "Start by recognizing which game you opened. This player loads the Noillirk version hosted by Daily. Other websites can use the same name while presenting different clocks, boards or modes. Follow the controls on the active game screen and keep the explanations for a separate implementation separate from this climb.",
  ),
  section(
    "start-a-run",
    "Open the player, then choose the climb",
    "Select Play Now to open the game. The page keeps the game inside its player, with the game name and viewing controls below it. Opening the frame is only the first step: the game’s own start screen then offers the choices that begin a run. In the Daily interface, the mode choices include Daily, Classic and Endless, followed by Begin Ascent.",
    "Choose a mode before starting rather than trying to change the rules halfway through a prompt. Classic is the straightforward place to understand the seven-prompt format. Endless changes what an unanswered prompt means because balloons become a survival limit. If you are learning the answer field for the first time, concentrate on recognizing the prompt and submit controls before worrying about the longest possible run.",
    "The initial forest and balloon scene is the beginning of the climb, not a separate movement challenge. Your main action is selecting and entering a response to the displayed category. Do not spend the answer window looking for character movement keys when the game is asking for a word or name.",
  ),
  section(
    "read-and-enter",
    "Read the whole question before typing",
    "A prompt can specify more than a broad category. It might narrow the kind of person, occasion, place or object that qualifies. The useful order is to read the condition first, think of a fitting response and then decide which fitting idea feels most familiar. A recognizable word that answers a neighboring question does not become useful merely because it is common.",
    "Type one response in the answer field. A short, clear name gives the game a definite idea to judge and leaves more of the answer window available. A sentence explaining several possible answers is a different task from naming one. Before submitting, check that the text still refers to the requested kind of thing rather than a reason, description or example that only partly matches.",
    "The standard prompt deadline is fifteen seconds. Keep some of that time for entering the response and using the visible submit control. Comparing two ideas can help; continuing the comparison until neither can be entered in time cannot. When the result or next-prompt state has appeared, read that feedback instead of continuing to type into the previous round.",
  ),
  section(
    "answer-feedback",
    "An accepted answer and a high answer are different achievements",
    "First look for acceptance, then look at the result tier. A response can qualify for the category while falling below the most familiar answer. That means you completed the prompt with a lower value; it does not mean that you should keep editing a finished result. A refused entry, by contrast, has not completed the category task.",
    "When an entry is turned away and time remains, reconsider its fit and wording. Repeating the same phrase without changing anything uses seconds without resolving the possible problem. A simpler fitting alternative can be more useful than a lengthy defense of your first choice. The visible clock and answer field tell you whether the opportunity is still open.",
    "A timeout is a completed missed prompt, not a hidden opportunity to submit late. In the observed interface, an out-of-time result led to a Next control. That is the point to read the feedback and advance. If instead the entire frame appears stuck or never opens, treat that as a player-loading issue rather than assuming the game has recorded a normal result.",
  ),
  section(
    "score-tiers",
    "Six tiers turn the answer into lift",
    "The six tier values run from 4 points for Grounded through 8 for Treetop, 16 for Kite, 32 for Cloud Nine and 64 for Jet Stream to 100 for Sky High. The strongest result is the top answer rather than simply any answer near the top. Across a seven-prompt Classic climb, seven 100-point results produce the maximum total of 700.",
    "Use the result to understand the choice you made, not to assign a fixed score to every word you know. Category wording matters, and a response’s rank is part of the game’s judgment. A familiar idea in your household or profession may be a less immediate example for a broader audience. That is a useful distinction to carry into the next prompt without trying to reconstruct an unseen answer board.",
    "Speed makes it possible to finish inside the deadline, but it does not independently improve a response’s familiarity. A hurried phrase that misses a qualifier can be worse than a plain fitting response entered a few seconds later. The practical aim is a clear answer in time, followed by an honest reading of the tier that appears.",
  ),
  section(
    "endless-balloons",
    "In Endless, a modest answer can keep the climb alive",
    "Endless begins with three balloons and continues dealing prompts until that protection is gone. Passing or reaching the deadline without an accepted answer removes a balloon. Any accepted response preserves the balloons, even if it receives a modest tier. A Sky High result can restore a missing balloon.",
    "That creates a decision you do not see just by comparing point values. With little time left, a fitting response can preserve the run even when you are unsure it is the strongest answer. Continuing to search for a perfect candidate risks turning a modest accepted result into a missed prompt. The right choice depends on the time and balloon state you can actually see.",
    "After a loss, return to the current category rather than letting the previous mistake dictate the next answer. Recovery is possible, but you cannot guarantee it by wishing an unusual phrase were more familiar. An accepted answer is still the necessary starting point. Keep the result tier, the balloon count and the next prompt as separate pieces of information.",
  ),
  section(
    "a-useful-first-climb",
    "Use the first run to learn a repeatable decision",
    "For your first climb, focus on a process you can repeat. Read the condition, consider a small set of fitting examples and commit while there is time to type. After the result, identify one thing the feedback actually tells you. A rejection calls for a fit or wording check; a lower accepted tier calls for a familiarity comparison; a timeout calls for an earlier commitment.",
    "Do not turn every reveal into an answer to memorize for all future questions. A similar category with a new restriction can require a different response. The transferable habit is noticing that restriction and choosing within it. Keep specialized knowledge available, but do not assume detail itself makes a response stronger in a game that rewards familiarity.",
    "A seven-prompt result can contain several kinds of mistake. Looking only at the final total hides that difference. Review the point where your decision broke down: did you misread the prompt, hesitate, enter an unclear phrase or choose a valid but less immediate example? The next climb becomes more useful when you change one identifiable behavior rather than simply trying to think harder.",
  ),
  section(
    "player-and-browser",
    "Keep the game and the page controls separate",
    "Webpage Fullscreen expands the player within the page and keeps an exit control on its status bar. Browser Fullscreen asks the browser to expand the player using its native fullscreen mode. A browser can reject that request, and some devices expose fullscreen differently. Use the visible feedback and the exit control rather than assuming a second click must have worked.",
    "If the game opens but does not respond to typing, select its answer field before entering a response. Page navigation and game input are separate focus targets. On a small screen, make sure the active field and the submit control remain visible when the keyboard opens. A page that fits your screen does not by itself establish that every feature inside a third-party game supports that device.",
    "If the frame never opens, use Try again after the failure or timeout feedback. A retry starts a fresh load; it is not a promise that an interrupted run can be restored. When you leave for another game, finish any result you want to review first. Third-party progress and account features are handled inside the game and are not an account system operated by this page.",
  ),
];
write("data/games/main-game.json", main);
const bodies = {
  krillion: [
    section(
      "opposite-choice",
      "Choose the unusual answer that still belongs",
      "Krillion Unlimited reverses the decision you make in Noillirk. The useful response is a valid category member that fewer people would reach immediately. That does not make an unrelated or invented name valuable: correctness is the boundary within which rarity matters. Read restrictions before searching for a specialist example.",
      "The first idea can help you recognize the center of a category, even if you do not submit it. From there, consider another region, period or kind of example you actually know. A narrower answer is useful only when the prompt permits that narrower category. Do not spend the twenty-five-second window defending a doubtful edge case.",
    ),
    section(
      "depth-and-air",
      "Read depth and air as different information",
      "A Classic dive has seven prompts and the accepted tier supplies the points that move the dive downward. A refused answer costs the time spent entering it. Treat the tier as a result to review rather than a reason to keep editing an accepted answer.",
      "Endless uses three air tanks. A miss removes one and a highest-tier result can restore one. An ambitious response and a safe valid response therefore have different risks when time or air is low. Confirm the current tank count before deciding to keep searching. The Daily-hosted Unlimited interface must not be confused with a separate original daily version.",
    ),
  ],
  fermi: [
    section(
      "units-first",
      "Decide what the number counts",
      "Fermi asks for an estimate, so the unit is part of the question. A length, a count and a volume can describe the same object while requiring completely different numbers. Before entering digits, identify what one unit means and which quantity you need to produce.",
      "Break the unknown into smaller quantities you can picture. For a stacking question, the total height and the thickness of one item are different ingredients, and they must use compatible units before division. A reasonable-looking number with the wrong scale is still a poor estimate. Write down the order of magnitude before spending effort on extra precision.",
    ),
    section(
      "ratio-not-gap",
      "Think in factors rather than differences",
      "The survival check compares multiplicative error. An estimate ten times high and an estimate ten times low sit at corresponding boundaries. Adding the same fixed amount to a small answer and a large answer does not produce the same quality of guess.",
      "Use low and high assumptions to see whether uncertainty could move the estimate across a factor-of-ten boundary. If one assumption dominates the range, improve that assumption first. Rounding a minor input more precisely does little when another input could be a hundred times off.",
    ),
    section(
      "numeric-entry",
      "Keep the calculation distinct from the result",
      "The interface provides a numeric field and a calculator/scratch-pad control. Check the unit displayed beside the field after entering the number. That is a useful way to catch a scale or parsing mistake before committing.",
      "A visible typed value is not yet a scored result. Wait for the answer and comparison feedback before treating the question as survived. If a submission does not change the interface, do not invent a streak outcome or repeatedly send the same guess. The current run needs a visible result before you can interpret its error ratio.",
    ),
  ],
  poople: [
    section(
      "legal-rungs",
      "Keep every rung a word",
      "Poople Unlimited turns a four-letter starting word into POOP through single-letter changes. The goal is not just to make the final spelling appear. Every intermediate entry must also be a valid word, so a tempting two-letter jump cannot replace a legal rung.",
      "Think about both ends of the route. A change that produces a valid word now may lead away from useful final neighbors. Looking backward from the target gives you a set of landing possibilities to aim toward. It is still necessary to connect that plan with valid one-letter changes from the current word.",
    ),
    section(
      "par-and-time",
      "Use par as a route target",
      "The dealt word includes a precomputed par. That number gives you a route-length target before you begin entering words. The timer begins with the first accepted move, so you can inspect the task before committing your first rung.",
      "A faster route with unnecessary moves and a slower route matching par tell different stories about your play. Compare the move sequence before blaming typing speed. The shortest route might use a word you would not ordinarily retrieve; do not assume that the most familiar next word always leads to the fewest moves.",
    ),
    section(
      "give-up-and-review",
      "Review the step where the route closed",
      "When you give up, the game can show a shortest ladder beside your attempt. Compare the point where your sequence diverged, not just the last move. A useful review asks which letter commitment removed the route you needed.",
      "This page concerns the Daily-hosted Unlimited implementation. Word acceptance, starting-word selection and par can differ in another Poople version. A word that belongs in a general dictionary is not a guarantee about every game’s accepted list.",
    ),
  ],
  "size-it-up": [
    section(
      "reference-dimension",
      "Use the labelled reference as the ruler",
      "Size It Up places a measured reference beside an adjustable outline. The reference is the anchor: judge the other object relative to that stated dimension instead of trusting the apparent size of an illustration on your screen.",
      "Check whether the task concerns a length or an area. A shape that looks twice as wide does not automatically have twice the area. Keep the requested quantity in mind while adjusting the outline, especially when a familiar map or silhouette makes an initial guess feel more certain than it deserves.",
    ),
    section(
      "commit-and-compare",
      "Read the dashed guess after locking",
      "Drag the outline’s corner or use the ruler beneath the board, then lock the estimate. The reveal changes the outline to its measured size while retaining the guess as a dashed comparison. Use the difference between those two shapes to identify the direction of your mistake.",
      "The score uses relative error rather than a simple fixed gap. Guessing double and guessing half are corresponding mistakes. That makes proportion more useful than adding an arbitrary amount to the previous estimate. Reset your reasoning around the next reference instead of compensating blindly for the last round.",
    ),
    section(
      "weighted-run",
      "A late round has a different value",
      "A run contains five rounds, and later rounds carry more weight. A confident opening estimate does not settle the whole run. Read the new reference and target each time rather than carrying over the previous scale.",
      "Before adjusting, choose a rough ratio you could explain. Then use the control to express that ratio. This separates a judgment about size from the accuracy of a drag gesture, which is useful when the outline moves farther than you intended.",
    ),
  ],
  color: [
    section(
      "remember-three-qualities",
      "Remember more than the color name",
      "The Color Game shows a target briefly and then removes it before you reconstruct the shade. Calling the target blue or green preserves a broad family, but not how muted, bright or shifted within that family it was.",
      "While the target is visible, notice one difference from an ordinary version of that color. A grayish blue and a vivid blue need different saturation settings even when you would name both blue. Keep that comparison in mind when the sliders replace the target.",
    ),
    section(
      "slider-order",
      "Adjust the family before fine differences",
      "Hue changes the color family, saturation changes its intensity and brightness changes its value within the HSB controls. If the hue is far off, small saturation adjustments can disguise the error without resolving it. First put the reconstruction in the intended family, then compare how vivid and how dark it should be.",
      "Brightness is not the same as perceived lightness across every hue. Two different families at the same slider position can look very different in darkness. Judge the reconstructed shade rather than assuming identical numeric positions should look equally light.",
    ),
    section(
      "compare-the-reveal",
      "Look for a consistent direction of error",
      "After lock-in, the target and reconstruction appear together with the score. Ask whether yours is too vivid, too dark or shifted toward a neighboring family. That observation gives the next attempt a specific adjustment instead of a general instruction to remember better.",
      "Difficulty changes how long the target is shown, and each run contains three colors. Compare like-for-like attempts when reviewing progress. A score earned with a longer exposure does not isolate the same memory demand as one earned in a shorter exposure mode.",
    ),
  ],
  "color-logo": [
    section(
      "find-the-region",
      "Fix the marked region rather than the whole logo",
      "The Logo Game asks you to restore a particular part of a company logo. An outline identifies the region to change. Look at that boundary first so that your memory concerns the right part, especially on marks containing several familiar colors.",
      "Choose a deck whose brands you recognize before judging your color recall. Not knowing the brand at all is different from remembering a familiar brand imprecisely. A deck of unfamiliar companies tests recognition and memory together, which makes a poor result harder to interpret.",
    ),
    section(
      "wrong-color-clue",
      "The displayed wrong color is not a near match",
      "The starting hue is deliberately separated from the true hue. Do not make a tiny adjustment merely because the displayed version already looks plausible. The shape may make almost any color feel recognizable; the task is to retrieve the brand color rather than preserve the colored image currently in front of you.",
      "The randomly chosen saturation and brightness are not a dependable clue to the answer. Once you choose a family, adjust the remaining qualities using your memory of the marked region. A familiar word such as red still leaves a large range of possible shades.",
    ),
    section(
      "screen-color",
      "Compare the revealed screen version",
      "A brand can look different on a lit screen, printed packaging and an outdoor sign. The result compares the submitted region with the logo’s screen artwork. Use that reveal to refine the memory being tested rather than assuming the printed object you own must provide the identical display value.",
      "Each round has three logos, and deck records are kept separately. Review which kind of brand you recognized and which detail was wrong. Confidence in recognizing a shape does not establish precision in its color.",
    ),
  ],
  maptap: [
    section(
      "country-before-city",
      "Place the country before the city",
      "MapTap Unlimited names a city and its country, then asks you to place it on a globe. The country cue reduces the search area. Before selecting a point, identify its coastline or broad land shape and place the city relative to that recognizable anchor.",
      "A famous city name may bring a landmark to mind without bringing its position within the country. Separate those memories. If the landmark does not tell you whether the city is coastal, inland or near a border, it is not yet a location cue.",
    ),
    section(
      "rotate-then-tap",
      "Separate positioning the globe from committing the point",
      "Rotate the globe until the relevant region is comfortably visible. A point near the edge of the globe is harder to place by eye because the projection compresses the land. Repositioning the region first gives the tap a clearer meaning.",
      "Use a considered location rather than tapping the apparent center of a country by default. A coastline, border or nearby capital can give a more useful anchor. The game grades distance, so a rough but informed placement can differ meaningfully from an arbitrary point even when neither is exact.",
    ),
    section(
      "distance-feedback",
      "Read distance before the five-place total",
      "A run contains five locations. Read the distance reveal for each one before judging only the total. A city placed in the wrong part of the right country suggests a different memory gap from a country mistaken for another continent.",
      "Keep the map relationship you learned: which direction the city lies from the coastline or familiar anchor. Memorizing an isolated tap location on a rotated globe is less useful because the next view can use a different orientation. This Unlimited implementation should not inherit daily-limit claims from another MapTap game.",
    ),
  ],
  "word-hunt": [
    section(
      "read-the-grid",
      "A word must also fit the board",
      "Word Hunt combines vocabulary retrieval with a spatial letter grid. Recognizing a possible word is only part of the task: its letters also need a route allowed by the current board rules. Inspect the instructions in the active game before assuming that every familiar adjacency or diagonal rule applies.",
      "A useful starting habit is to inspect short letter combinations you can actually connect, then extend them into a word. Searching your entire vocabulary first can leave you trying to force a name onto letters that are not connected in the required way.",
    ),
    section(
      "shuffle-with-purpose",
      "Treat a shuffle as a change of opportunity",
      "The Daily directory describes a four-by-four grid and three same-letter shuffles. Keeping the letter pool while changing its arrangement changes which routes are easy to see. It does not create a new vocabulary set out of nothing.",
      "Before using a shuffle, notice the combinations that seemed promising but lacked a usable connection. After the board changes, look for those connections instead of rereading every tile as though the previous arrangement taught you nothing. Exact scoring, accepted-word lengths and timer behavior still need to be read in the game you open; rules from a similarly named word game may differ.",
    ),
  ],
};
const games = read("data/games/games.json");
for (const g of games) {
  g.content = bodies[g.id];
  g.seo = {
    title: g.title + " Online — Game Controls and Playing Tips",
    description: "",
  };
}
write("data/games/games.json", games);
const mechanics = read("research/candidate-mechanics.json");
write("research/game-content-briefs.json", {
  status: "draft-body-work-not-content-acceptance",
  games: [
    {
      game_id: "noillirk",
      version: "Daily, 2026-10-20",
      task: "Choose familiar valid answers through a balloon climb",
      evidence_ids: ["official-game", "noillirk-identity"],
      sections: main.content.map((s) => s.id),
      cases: [
        "Controlled Begin Ascent reached out-of-time/Next state; no accepted answer tested",
        "Video samples confirm mode screen and typed restricted prompt",
      ],
      screenshot_tasks: [
        "Opening prompt",
        "Submitted result",
        "Endless balloon state",
      ].map((fact, i) => ({
        slot_id: "noillirk-media-" + (i + 1),
        fact,
        adopted: [],
      })),
      youtube_research: {
        decision: "pending-media-review",
        candidate_ids: ["oMe1Mz3Maoo"],
        adopted_ids: [],
        reason:
          "Partial sampled observation; continuous segments and embedding not approved",
      },
      unsupported_claims: [
        "Exact outcomes for untested responses",
        "Daily reset schedule",
        "Cross-device save",
      ],
      content_status: "draft-case-review-required",
    },
    ...games.map((g) => {
      const m = mechanics.find((x) => x.id === g.id);
      return {
        game_id: g.id,
        version: "Daily implementation, landing pages checked 2026-10-20",
        task: m.task,
        hook: m.relation,
        input: m.input,
        goals: m.feedback,
        failure: m.failure,
        evidence_ids: ["official-" + g.id],
        sections: g.content.map((s) => s.id),
        screenshot_tasks: m.shots.map((fact, i) => ({
          slot_id: g.id + "-media-" + (i + 1),
          fact,
          adopted: [],
        })),
        youtube_research: {
          decision: "pending-media-review",
          candidate_ids: [],
          adopted_ids: [],
          reason:
            "Exact-version native video search and observations incomplete",
        },
        unsupported_claims: [
          "Unobserved mobile support",
          "Unobserved effective input or saved progress",
          "Deterministic untested outcomes",
        ],
        content_status: "partial-substantive-draft-below-publication-floor",
      };
    }),
  ],
});
console.log(
  "Main body and eight distinct partial Game bodies written. No claim of per-game content acceptance.",
);
