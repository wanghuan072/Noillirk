import { test } from "node:test";
import assert from "node:assert/strict";
import { videoReviewErrors } from "../lib/video-review.mjs";
const video = {
  videoId: "abcdefghijk",
  title: "A reviewed action",
  description: "Compare the selected word with the resulting feedback.",
};
function evidence() {
  return {
    ledger: [
      {
        videoId: video.videoId,
        subjectGameId: "word-hunt",
        status: "adopted",
        rightsStatus: "approved",
        embedStatus: "verified",
        ageRestrictionStatus: "clear",
        reviewedRangeIds: ["range-1"],
        usedOn: ["/guides/word-hunt-controls"],
      },
    ],
    analysis: [
      {
        videoId: video.videoId,
        gameId: "word-hunt",
        identity: "exact-game",
        versionCompatibility: "verified",
        segments: [
          {
            id: "range-1",
            range: "00:10–00:20",
            state: "Word grid",
            action: "Player traces a word",
            visibleResult: "Accepted word feedback",
            successOrFailureReason: "The traced sequence was accepted",
            versionScope: "Reviewed current grid implementation",
            supports: ["Word submission"],
            doesNotSupport: ["All dictionary entries"],
          },
        ],
      },
    ],
  };
}
test("playable video IDs without an adoption cannot enter draft content", () => {
  assert.ok(videoReviewErrors(video, "word-hunt", [], []).length);
});
test("adoption for another game cannot supply the current game's video", () => {
  const e = evidence();
  assert.ok(videoReviewErrors(video, "noillirk", e.ledger, e.analysis).length);
});
test("segment IDs, observed actions and current-version compatibility are required", () => {
  for (const mutate of [
    (e) => {
      e.analysis[0].versionCompatibility = "unresolved";
    },
    (e) => {
      e.ledger[0].reviewedRangeIds = ["absent"];
    },
    (e) => {
      e.analysis[0].segments[0].action = "";
    },
    (e) => {
      e.ledger[0].embedStatus = "unknown";
    },
  ]) {
    const e = evidence();
    mutate(e);
    assert.ok(
      videoReviewErrors(video, "word-hunt", e.ledger, e.analysis).length,
    );
  }
});
test("complete fixture review qualifies only its own game and assigned Guide", () => {
  const e = evidence();
  assert.deepEqual(
    videoReviewErrors(video, "word-hunt", e.ledger, e.analysis),
    [],
  );
  assert.deepEqual(
    videoReviewErrors(
      video,
      undefined,
      e.ledger,
      e.analysis,
      "/guides/word-hunt-controls",
    ),
    [],
  );
  assert.ok(
    videoReviewErrors(
      video,
      undefined,
      e.ledger,
      e.analysis,
      "/guides/unassigned",
    ).length,
  );
});
