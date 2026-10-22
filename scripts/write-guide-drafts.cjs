const fs = require("fs");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const write = (p, v) => fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n");
const para = (text) => ({ type: "paragraph", text });
const section = (id, title, ...texts) => ({
  id,
  title,
  blocks: texts.map(para),
});
const strategy = read("data/guides/noillirk-answer-strategy.json");
strategy.summary =
  "Read a prompt, narrow the category and choose one familiar response before the clock ends. Learn when to commit, when to change a rejected entry and how to read the reveal without chasing a perfect answer too late.";
strategy.tags = ["Answer selection", "Timed decisions", "Getting started"];
strategy.seo = {
  title: "Noillirk Answer Strategy: Choose a Familiar Response",
  description:
    "Choose a fitting Noillirk answer before the clock ends. Learn to read restrictions, compare familiar ideas, submit clearly and recover when an entry is refused.",
};
strategy.relatedGuideIds = ["noillirk-scoring-and-endless"];
strategy.sections = [
  section(
    "read-the-restriction",
    "Find the restriction before the answer",
    "A category can be broad while its qualifying words are narrow. Before thinking about familiarity, identify what kind of thing is being requested and which condition it must meet. An activity for children is not interchangeable with an activity for adults. A thing someone loses is not necessarily a reason they lose it. Those distinctions decide whether a recognizable answer actually fits.",
    "Read the complete sentence once. Keep the important restriction in mind as a short check: a place, an object, an activity, or another clearly named category. Then test the response you are about to type against that check. Familiarity helps only after the answer belongs to the requested set. A confident response to a different question still wastes part of the short answer window.",
  ),
  section(
    "make-a-small-choice",
    "Compare a few familiar ideas",
    "Give yourself a small choice rather than an endless search. Bring to mind a couple of ordinary examples and ask which one another person could recognize without an explanation. The useful comparison is between fitting responses, not between an ordinary valid response and a clever response whose connection requires a story.",
    "For a practice exercise away from a live round, compare a general item with a specialized version of it. Consider whether the added detail is required by the prompt. If it is not, the plain name is usually a clearer expression of the idea you intend to submit. This exercise is a way to organize a choice, not a claim that either wording is guaranteed a particular position on an unseen board.",
  ),
  section(
    "commit-while-you-can-type",
    "Leave enough time to enter the response",
    "The deadline includes the work of typing. Once you have a fitting familiar candidate, further comparison has a cost: you might trade a response that can be entered now for an idea that arrives after the window closes. Decide while there is still time to type the whole name and use the game’s submit control.",
    "Avoid treating the clock as a bonus meter. A quick answer is useful because it reaches the game before the deadline, not because speed alone makes it more familiar. If two candidates remain close in your mind, use the one you can express clearly. Do not spend the last moments composing several alternatives in a single entry.",
  ),
  section(
    "one-response",
    "Type one answer with a clear meaning",
    "Use the answer field for a response to the category. It is not a place to justify your reasoning, offer a list, or negotiate a ranking. Extra explanation introduces words that the game must interpret and takes time to enter. Keep your intended object or name clear.",
    "Check the current prompt while you type rather than relying on the previous one. A run changes categories, and a habit that worked on an earlier question can carry over when it no longer belongs. Before submitting, ask one last concrete question: does this text name a thing of the requested kind? That quick check is more useful than searching for a universally best answer that the prompt has not revealed.",
  ),
  section(
    "rejected-entry",
    "Recover from a refused entry",
    "A refusal and an accepted low score require different responses. A refused entry has not completed the task. If the answer field and clock remain active, first check whether you answered the exact category and whether the wording states the name you intended. A different fitting response may be more productive than repeating the same text.",
    "Do not assume the game can accept every defensible synonym or that a repeated entry will receive a different judgment. Read the visible feedback, use the remaining time for a clear alternative and stop typing when the round has ended. Once a prompt has timed out and a next control appears, changing the old field is no longer the next step.",
  ),
  section(
    "learn-from-a-reveal",
    "Learn one useful distinction from the reveal",
    "An accepted answer can still finish below the top tier. That result tells you to reconsider familiarity on a later prompt; it does not mean that the response failed the category test. Keep those two judgments separate when reviewing a run. Otherwise a low-ranked valid answer can send you looking for a spelling fix when the real lesson is about the choice itself.",
    "After a reveal, ask what made your selection narrower or less immediate than another fitting idea. Avoid memorizing an answer as a universal rule for every similar sentence. A change in qualifier can change the appropriate category. Take the decision habit into the next climb: read the restriction, compare a small set, choose a familiar response and submit while time remains.",
  ),
  section(
    "version-and-scope",
    "Keep this method within its version",
    "This guide concerns the familiar-answer Noillirk game hosted by Daily. A different game with the same name can use a different clock, list or scoring system. Use the controls and feedback visible in the game you actually opened. Do not apply a rule for a separate implementation simply because its name looks the same.",
    "The method here is about choosing and entering a response. It does not promise a fixed winning answer, a complete answer bank or a particular score. For the difference between accepted results and Endless survival, continue with the scoring and balloons guide after you have finished the current round.",
  ),
];
const scoring = read("data/guides/noillirk-scoring-and-endless.json");
scoring.summary =
  "Separate a refused answer from an accepted result, understand the six score tiers and decide what matters when Endless balloons are at risk. Follow the next action that matches the feedback on your screen.";
scoring.tags = ["Scoring", "Endless", "Balloon recovery"];
scoring.seo = {
  title: "Noillirk Scoring Guide: Tiers and Endless Balloons",
  description:
    "Understand Noillirk tiers, accepted answers and Endless balloon loss. Compare scoring outcomes and learn when survival matters more than chasing the top result.",
};
scoring.relatedGuideIds = ["noillirk-answer-strategy"];
scoring.sections = [
  section(
    "validity-before-value",
    "Read acceptance before reading value",
    "There are two questions behind a result: did the response fit the prompt, and how highly did the game rank it? A refused answer cannot be treated as a low-tier accepted answer. Look for the actual response state before drawing a lesson about familiarity. If the field remains active, you may still have a chance to provide a different answer before the deadline.",
    "An accepted result has finished the answer-selection part of that prompt. A modest tier means that an accepted response earned a modest value; it is not an instruction to keep editing the completed answer. This distinction becomes especially useful in Endless, where an accepted low-tier answer and a missed prompt have different consequences.",
  ),
  section(
    "six-tiers",
    "Read the six tiers from low to high",
    "The Daily version uses six values: Grounded earns 4 points, Treetop 8, Kite 16, Cloud Nine 32, Jet Stream 64 and Sky High 100. Treat the tier name as feedback on the result, not as a rating of your general knowledge. A response can be correct for the category yet less familiar than the answer at the top.",
    "The top board places distinguish the strongest results. Sky High is the leading answer; Jet Stream covers the next three positions and Cloud Nine the following five. Do not infer a fixed accepted-word list for every prompt from these positions. A name that feels commonplace to you is not automatically guaranteed the tier you expect.",
  ),
  section(
    "compare-values",
    "Compare the value of changing a decision",
    "The tier values make some improvements much larger than others. Moving from 32 to 64 adds 32 points, while moving from 64 to 100 adds 36. Moving from 4 to 8 adds only 4. These are arithmetic comparisons of the tier values, not predictions about which word will achieve them in a future round.",
    "Use that comparison when reviewing decisions after a run, rather than trying to calculate every possibility while the short answer clock is running. A prompt still needs a fitting response in time. The possibility of a larger gain is not helpful if considering it leaves you with no submission.",
  ),
  section(
    "classic-total",
    "Understand the Classic total",
    "A standard seven-prompt climb can total 700 points when all seven answers earn Sky High. A lower total may combine several perfectly valid answers at different tiers. Read the individual results before treating the total as one repeated error. You might need a better familiarity choice on one category and a faster commitment on another.",
    "A missed prompt and a lower accepted tier can both reduce the final total, but the way to improve them differs. For a missed prompt, practice identifying a fitting answer and entering it before time expires. For an accepted answer below the top tier, review whether you chose an unnecessarily specialized example. Keep that review specific to the category.",
  ),
  section(
    "protect-the-balloons",
    "Protect a balloon with an accepted answer",
    "Endless begins with three balloons. A pass or timeout without an accepted answer removes one, while an accepted answer preserves the balloons even when its tier is low. That makes survival a different decision from maximizing every prompt. When your remaining time is short, a clear fitting response can keep a run going even if you are unsure it will be Sky High.",
    "Do not deliberately replace a safe fitting response with something that fails the category simply because it sounds more popular. The game must accept the answer before its familiarity can help you. Nor should you treat a low accepted tier as a popped balloon: read the balloon state and the result separately.",
  ),
  section(
    "recover-a-balloon",
    "Use Sky High recovery carefully",
    "A Sky High result can restore a missing balloon in Endless. Recovery is useful after a miss, but it is an outcome to recognize rather than a guarantee to plan around. A response chosen in hope of recovery still needs to fit the current prompt and receive the top tier.",
    "After a mistake, avoid turning the next prompt into a desperate search for one imagined perfect word. Return to the ordinary decision process: read the qualifier, choose a familiar valid example and submit it in time. If a balloon returns, check the visible state before deciding how much safety the next prompt offers. Do not assume an unused recovery can be saved outside the run.",
  ),
  section(
    "after-a-miss",
    "Match the next action to the finished state",
    "When time is gone and the prompt has ended, the next control advances the climb. It does not reopen the old answer. Read the result, note whether a balloon was lost and move on when you are ready. If the game has stopped responding rather than finished a prompt, treat that as a loading problem instead of assuming that a blank screen means a scored miss.",
    "This guide describes the Daily Noillirk implementation. Same-name independent games can use different lives, clocks and point conversions. No fixed prediction is made for unlisted answers or future updates. The answer-selection guide covers the earlier decision, before submission; use it when your main problem is choosing a response rather than interpreting a finished result.",
  ),
];
write("data/guides/noillirk-answer-strategy.json", strategy);
write("data/guides/noillirk-scoring-and-endless.json", scoring);
write("research/guide-content-briefs.json", {
  status: "substantive-drafts-pending-case-and-media-review",
  guides: [
    {
      guide_id: strategy.id,
      task: "Choose a fitting familiar response within the deadline",
      outcome:
        "Use a restriction/candidate/commit routine and react correctly to refusal",
      questions: [
        "Which qualifier controls validity?",
        "When should I stop comparing?",
        "Is this rejection or a low tier?",
      ],
      steps: strategy.sections.map((s) => s.id),
      cases: [
        {
          type: "video-observation",
          detail:
            "Observed New Year prompt specifies children; shows importance of qualifier",
          evidence: "video oMe1Mz3Maoo early sample",
          limitation: "Winning answer and exact score not established",
        },
      ],
      failureRecovery:
        "Refused entry can be changed while clock active; completed timeout requires next prompt",
      version: "Daily Noillirk, 2026-10-20",
      mediaTask:
        "Original category/qualifier decision diagram; no game artwork",
      homeBoundary: "Detailed pre-submission process; Home only orientation",
      otherGuideBoundary: "No full scoring/lives manual",
      evidence_ids: ["official-game"],
      unsupported_claims: [
        "Guaranteed top responses",
        "Exact acceptance for illustrative phrases",
        "Unlimited spelling tolerance",
      ],
      content_status: "draft-review-required",
    },
    {
      guide_id: scoring.id,
      task: "Interpret an accepted tier and Endless balloon state",
      outcome: "Distinguish validity, score, survival and recovery",
      questions: [
        "What does a low accepted tier mean?",
        "When is a balloon lost?",
        "What can restore one?",
      ],
      steps: scoring.sections.map((s) => s.id),
      cases: [
        {
          type: "arithmetic",
          detail: "64-32=32; 100-64=36; 7*100=700",
          limitation: "Arithmetic only, not an observed live answer sequence",
        },
      ],
      failureRecovery:
        "Separate timed-out prompt from frozen player; advance completed state",
      version: "Daily Noillirk, 2026-10-20",
      mediaTask: "Original tier ladder and separate life-state diagram",
      homeBoundary: "Detailed result interpretation",
      otherGuideBoundary: "No repeated answer selection tutorial",
      evidence_ids: ["official-game"],
      unsupported_claims: [
        "Deterministic unlisted-answer ranking",
        "Daily schedule",
        "Cross-device progress recovery",
      ],
      content_status: "draft-review-required",
    },
  ],
});
console.log(
  "Two distinct substantive Guide drafts written. Dates remain null; no publication or media acceptance.",
);
