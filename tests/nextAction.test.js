import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync("app.js", "utf8");

function extractFunction(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);

  assert.notEqual(start, -1, `Fant ikke: ${startMarker}`);
  assert.notEqual(end, -1, `Fant ikke: ${endMarker}`);

  return source.slice(start, end);
}

const nextActionSource = extractFunction(
  "function determineNextAction(",
  "function calculateUnlockedLevel",
);

function determine(input) {
  const context = {
    input,
    result: null,
  };

  vm.runInNewContext(
    `${nextActionSource}
     result = determineNextAction(input);`,
    context,
  );

  return JSON.parse(JSON.stringify(context.result));
}

test("due review takes priority over new learning", () => {
  assert.deepEqual(
    determine({
      levelRequirements: ["alphabet", "words", "quiz", "daily"],
      completed: [],
      dueReviewCount: 2,
    }),
    { type: "review" },
  );
});

test("first incomplete level-one requirement becomes next action", () => {
  assert.deepEqual(
    determine({
      levelRequirements: ["alphabet", "words", "quiz", "daily"],
      completed: ["alphabet"],
      dueReviewCount: 0,
    }),
    { type: "view", view: "words" },
  );
});

test("database lesson requirement resolves to lesson id", () => {
  assert.deepEqual(
    determine({
      levelRequirements: ["lesson:lesson-5", "lesson:lesson-6"],
      completed: [],
      dueReviewCount: 0,
    }),
    {
      type: "database-lesson",
      lessonId: "lesson-5",
    },
  );
});

test("completed current requirements fall back to daily learning", () => {
  assert.deepEqual(
    determine({
      levelRequirements: ["alphabet", "words", "quiz", "daily"],
      completed: ["alphabet", "words", "quiz", "daily"],
      dueReviewCount: 0,
    }),
    { type: "view", view: "daily" },
  );
});

test("review action opens daily review from first step", () => {
  const context = {
    action: { type: "review" },
    dailyStep: 4,
    calls: [],
  };

  context.showView = (view) => context.calls.push(["view", view]);
  context.openDatabaseLesson = (lessonId) =>
    context.calls.push(["lesson", lessonId]);

  vm.runInNewContext(
    `${nextActionSource}
     executeNextAction(action);`,
    context,
  );

  assert.equal(context.dailyStep, 0);
  assert.deepEqual(
    Array.from(context.calls, (call) => Array.from(call)),
    [["view", "daily"]],
  );
});

test("database next action uses existing database lesson opener", () => {
  const context = {
    action: {
      type: "database-lesson",
      lessonId: "lesson-5",
    },
    dailyStep: 0,
    calls: [],
  };

  context.showView = (view) => context.calls.push(["view", view]);
  context.openDatabaseLesson = (lessonId) =>
    context.calls.push(["lesson", lessonId]);

  vm.runInNewContext(
    `${nextActionSource}
     executeNextAction(action);`,
    context,
  );

  assert.deepEqual(
    Array.from(context.calls, (call) => Array.from(call)),
    [["lesson", "lesson-5"]],
  );
});

test("next action label matches selected learning activity", () => {
  const context = {
    action: { type: "view", view: "words" },
  };

  vm.runInNewContext(
    `${nextActionSource}
     result = nextActionLabel(action);`,
    context,
  );

  assert.equal(context.result, "Øv på ord");
});
