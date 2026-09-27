import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync("app.js", "utf8");

function extractBetween(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);

  assert.notEqual(start, -1, `Fant ikke: ${startMarker}`);
  assert.notEqual(end, -1, `Fant ikke: ${endMarker}`);

  return source.slice(start, end);
}

const dueReviewWordsSource = extractBetween(
  "function dueReviewWords()",
  "function requiredLessonKeysForLevel",
);

const getWordDeckSource = extractBetween(
  "function getWordDeck()",
  "function displayWordTerm",
);

function createContext(reviewOnlyDifficult = false) {
  return {
    course: {
      words: [
        { term: "difficult" },
        { term: "due" },
        { term: "future" },
        { term: "unseen" },
      ],
    },
    state: {
      difficultWords: ["difficult"],
      reviewStats: {
        difficult: {
          dueAt: "2999-01-01T00:00:00.000Z",
          correct: 0,
          incorrect: 0,
        },
        due: {
          dueAt: "2000-01-01T00:00:00.000Z",
          correct: 0,
          incorrect: 1,
        },
        future: {
          dueAt: "2999-01-01T00:00:00.000Z",
          correct: 1,
          incorrect: 0,
        },
      },
    },
    reviewOnlyDifficult,
  };
}

test("review queue excludes unseen words without review history", () => {
  const context = createContext();

  vm.runInNewContext(
    `${dueReviewWordsSource}
     result = dueReviewWords().map((word) => word.term);`,
    context,
  );

  assert.deepEqual(
    Array.from(context.result).sort(),
    ["difficult", "due"],
  );
});

test("difficult-only deck contains only explicitly difficult words", () => {
  const context = createContext(true);

  vm.runInNewContext(
    `${dueReviewWordsSource}
     ${getWordDeckSource}
     result = getWordDeck().map((word) => word.term);`,
    context,
  );

  assert.deepEqual(
    Array.from(context.result),
    ["difficult"],
  );
});
