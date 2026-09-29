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
          dueAt: "2000-01-01T00:00:00.000Z",
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

test("a difficult word with a future review date is not immediately due again", () => {
  const context = createContext();
  context.state.reviewStats.difficult.dueAt = "2999-01-01T00:00:00.000Z";

  vm.runInNewContext(
    `${dueReviewWordsSource}
     result = dueReviewWords().map((word) => word.term);`,
    context,
  );

  assert.deepEqual(Array.from(context.result), ["due"]);
});

test("review cards let learners rate recall and save a review attempt", () => {
  const dailySource = readFileSync("app/daily-lesson.js", "utf8");
  const calls = [];
  const card = { innerHTML: "" };
  const resultButtons = [
    {
      dataset: { reviewResult: "remembered", reviewTerm: "ねこ" },
      addEventListener: (event, callback) => {
        if (event === "click") resultButtons[0].click = callback;
      },
    },
    {
      dataset: { reviewResult: "again", reviewTerm: "ねこ" },
      addEventListener: (event, callback) => {
        if (event === "click") resultButtons[1].click = callback;
      },
    },
  ];
  const revealButtons = [
    {
      dataset: { reviewTerm: "ねこ" },
      classList: { toggle: () => {} },
      addEventListener: (event, callback) => {
        if (event === "click") revealButtons[0].click = callback;
      },
    },
  ];
  const context = {
    window: {},
    revealButtons,
    document: {
      getElementById: () => null,
      querySelector: () => null,
      createElement: () => ({ style: "", id: "", textContent: "" }),
      head: { appendChild: () => {} },
    },
    resultButtons,
    $: (selector) => (selector === "#daily-card" ? card : null),
    $$: (selector) =>
      selector === "[data-review-result]" ? resultButtons : revealButtons,
    course: { words: [{ term: "ねこ", norwegian: "katt" }] },
    state: { reviewStats: {} },
    activeLanguage: "ja",
    dueReviewWords: () => [{ term: "ねこ", norwegian: "katt" }],
    displayWordTerm: (word) => word.term,
    speak: (...args) => calls.push(["speak", ...args]),
    recordReview: (...args) => calls.push(["review", ...args]),
    recordExerciseAttempt: (...args) => calls.push(["attempt", ...args]),
    saveState: () => calls.push(["save"]),
    dailySentenceAnswerRef: () => [],
    setDailySentenceAnswer: () => {},
    shuffle: (items) => items,
  };

  vm.runInNewContext(dailySource, context);
  const renderer = context.window.KumoDailyLesson.createDailyLessonRenderer(context);
  renderer.renderReviewExercise();
  assert.match(card.innerHTML, /data-review-result/);
  resultButtons[0].click();

  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [
    ["review", "ねこ", true],
    ["attempt", { exerciseKey: "review:ねこ", correct: true }],
    ["save"],
  ]);
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
