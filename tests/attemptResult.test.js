import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadStateModule() {
  const context = {
    window: {},
    document: {
      readyState: "loading",
      addEventListener() {},
      querySelector() {
        return null;
      },
    },
  };

  vm.runInNewContext(readFileSync("app/state.js", "utf8"), context);
  return context.window.KumoState;
}

test("exercise attempts produce a derived result", () => {
  const stateApi = loadStateModule();
  const state = stateApi.freshState();

  assert.equal(Array.isArray(state.attempts), true);
  assert.equal(state.attempts.length, 0);

  let result = stateApi.recordExerciseAttempt(state, {
    exerciseKey: "daily:quiz",
    correct: true,
    attemptedAt: "2026-09-28T10:00:00.000Z",
  });

  assert.equal(state.attempts.length, 1);
  assert.equal(result.attempts, 1);
  assert.equal(result.correct, 1);
  assert.equal(result.incorrect, 0);
  assert.equal(result.accuracy, 100);
  assert.equal(result.lastCorrect, true);

  result = stateApi.recordExerciseAttempt(state, {
    exerciseKey: "daily:quiz",
    correct: false,
    attemptedAt: "2026-09-28T10:01:00.000Z",
  });

  assert.equal(result.attempts, 2);
  assert.equal(result.correct, 1);
  assert.equal(result.incorrect, 1);
  assert.equal(result.accuracy, 50);
  assert.equal(result.lastCorrect, false);
  assert.equal(result.lastAttemptAt, "2026-09-28T10:01:00.000Z");
});

test("state validation keeps only valid known exercise attempts", () => {
  const stateApi = loadStateModule();

  const course = {
    symbols: [],
    words: [],
    database: {
      lessons: [],
      exercises: [{ id: "exercise-1" }],
    },
  };

  const result = stateApi.validateState(
    {
      attempts: [
        {
          exerciseKey: "daily:quiz",
          correct: true,
          attemptedAt: "2026-09-28T10:00:00.000Z",
        },
        {
          exerciseKey: "database:exercise-1",
          correct: false,
          attemptedAt: "2026-09-28T10:01:00.000Z",
        },
        {
          exerciseKey: "database:missing",
          correct: true,
          attemptedAt: "2026-09-28T10:02:00.000Z",
        },
        {
          exerciseKey: "daily:quiz",
          correct: true,
          attemptedAt: "invalid-date",
        },
      ],
    },
    course,
    () => "2026-09-28",
  );

  assert.equal(result.attempts.length, 2);
  assert.equal(result.attempts[0].exerciseKey, "daily:quiz");
  assert.equal(result.attempts[1].exerciseKey, "database:exercise-1");
});

test("state validation keeps retry requests only for known database exercises", () => {
  const stateApi = loadStateModule();
  const course = {
    symbols: [],
    words: [],
    database: {
      lessons: [],
      exercises: [{ id: "exercise-1" }],
    },
  };

  assert.equal(
    stateApi.validateState(
      { retryExerciseKey: "database:exercise-1" },
      course,
      () => "2026-09-28",
    ).retryExerciseKey,
    "database:exercise-1",
  );
  assert.equal(
    stateApi.validateState(
      { retryExerciseKey: "database:missing" },
      course,
      () => "2026-09-28",
    ).retryExerciseKey,
    null,
  );
  assert.equal(
    stateApi.validateState(
      { retryExerciseKey: "quiz:main" },
      course,
      () => "2026-09-28",
    ).retryExerciseKey,
    null,
  );
});

test("failed database attempts request a retry and correct attempts clear it", () => {
  const stateApi = loadStateModule();
  const context = {
    state: stateApi.freshState(),
    recordExerciseAttemptBase: stateApi.recordExerciseAttempt,
  };
  const app = readFileSync("app.js", "utf8");
  const start = app.indexOf("function recordExerciseAttempt(attempt)");
  const end = app.indexOf("async function persistState", start);

  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  vm.runInNewContext(app.slice(start, end), context);
  vm.runInNewContext(
    `recordExerciseAttempt({exerciseKey:"database:exercise-1",correct:false,attemptedAt:"2026-09-28T10:00:00.000Z"});`,
    context,
  );
  assert.equal(context.state.retryExerciseKey, "database:exercise-1");

  vm.runInNewContext(
    `recordExerciseAttempt({exerciseKey:"database:exercise-1",correct:true,attemptedAt:"2026-09-28T10:01:00.000Z"});`,
    context,
  );
  assert.equal(context.state.retryExerciseKey, null);
});

test("attempt result survives state validation and reload", () => {
  const stateApi = loadStateModule();
  const course = {
    symbols: [],
    words: [],
    database: { lessons: [], exercises: [] },
  };
  const state = stateApi.freshState();

  stateApi.recordExerciseAttempt(state, {
    exerciseKey: "quiz:main",
    correct: true,
    attemptedAt: "2026-09-28T10:00:00.000Z",
  });
  stateApi.recordExerciseAttempt(state, {
    exerciseKey: "quiz:main",
    correct: false,
    attemptedAt: "2026-09-28T10:01:00.000Z",
  });

  const reloadedState = stateApi.validateState(
    JSON.parse(JSON.stringify(state)),
    course,
    () => "2026-09-28",
  );

  assert.deepEqual(
    JSON.parse(
      JSON.stringify(
        stateApi.getExerciseResult(reloadedState.attempts, "quiz:main"),
      ),
    ),
    {
      exerciseKey: "quiz:main",
      attempts: 2,
      correct: 1,
      incorrect: 1,
      accuracy: 50,
      lastCorrect: false,
      lastAttemptAt: "2026-09-28T10:01:00.000Z",
    },
  );
});

test("attempt history is bounded to the latest 100 attempts", () => {
  const stateApi = loadStateModule();
  const state = stateApi.freshState();

  for (let index = 0; index < 105; index += 1) {
    stateApi.recordExerciseAttempt(state, {
      exerciseKey: "daily:quiz",
      correct: index % 2 === 0,
      attemptedAt: new Date(Date.UTC(2026, 8, 28, 10, index)).toISOString(),
    });
  }

  assert.equal(state.attempts.length, 100);
});

test("daily assessed exercises record attempts", () => {
  const daily = readFileSync("app/daily-lesson.js", "utf8");
  const app = readFileSync("app.js", "utf8");

  assert.match(
    daily,
    /exerciseKey:\s*"daily:sentence-builder"/,
  );

  assert.match(
    daily,
    /exerciseKey:\s*"daily:quiz"/,
  );

  assert.match(
    app,
    /recordExerciseAttempt:\s*\(attempt\)\s*=>\s*recordExerciseAttemptBase\(state,\s*attempt\)/,
  );
});
test("database assessed exercises record attempts by exercise id", () => {
  const renderer = readFileSync("app/database-renderer.js", "utf8");
  const app = readFileSync("app.js", "utf8");

  assert.match(
    renderer,
    /exerciseKey:\s*"database:"\s*\+\s*String\(exercise\.id\)/,
  );

  const attemptCalls =
    renderer.match(/recordDatabaseAttempt\(exercise,\s*correct\);/g) || [];

  assert.equal(attemptCalls.length, 2);

  assert.match(
    app,
    /getDatabaseLessonStep:[\s\S]*?saveState,\s*recordExerciseAttempt:\s*\(attempt\)\s*=>\s*recordExerciseAttempt\(attempt\),\s*shuffle,\s*escapeHtml,\s*\}\);/,
  );
});
test("main quiz records activity-level attempts", () => {
  const stateApi = loadStateModule();

  const course = {
    symbols: [],
    words: [],
    database: {
      lessons: [],
      exercises: [],
    },
  };

  const validated = stateApi.validateState(
    {
      attempts: [
        {
          exerciseKey: "quiz:main",
          correct: true,
          attemptedAt: "2026-09-28T12:00:00.000Z",
        },
      ],
    },
    course,
    () => "2026-09-28",
  );

  assert.equal(validated.attempts.length, 1);
  assert.equal(validated.attempts[0].exerciseKey, "quiz:main");

  const app = readFileSync("app.js", "utf8");

  assert.match(
    app,
    /recordExerciseAttemptBase\(state,\s*\{\s*exerciseKey:\s*"quiz:main",\s*correct,\s*\}\);/,
  );
});
test("alphabet practice records attempts by symbol", () => {
  const stateApi = loadStateModule();

  const course = {
    symbols: [
      { char: "あ" },
      { char: "い" },
    ],
    words: [],
    database: {
      lessons: [],
      exercises: [],
    },
  };

  const validated = stateApi.validateState(
    {
      attempts: [
        {
          exerciseKey: "alphabet:あ",
          correct: true,
          attemptedAt: "2026-09-28T13:00:00.000Z",
        },
        {
          exerciseKey: "alphabet:missing",
          correct: false,
          attemptedAt: "2026-09-28T13:01:00.000Z",
        },
      ],
    },
    course,
    () => "2026-09-28",
  );

  assert.equal(validated.attempts.length, 1);
  assert.equal(validated.attempts[0].exerciseKey, "alphabet:あ");

  const app = readFileSync("app.js", "utf8");

  assert.match(
    app,
    /exerciseKey:\s*"alphabet:"\s*\+\s*practiceSymbol\.char/,
  );
});
test("pronunciation practice records attempts by word", () => {
  const stateApi = loadStateModule();

  const course = {
    symbols: [],
    words: [
      { term: "こんにちは" },
      { term: "すみません" },
    ],
    database: {
      lessons: [],
      exercises: [],
    },
  };

  const validated = stateApi.validateState(
    {
      attempts: [
        {
          exerciseKey: "pronunciation:こんにちは",
          correct: true,
          attemptedAt: "2026-09-28T14:00:00.000Z",
        },
        {
          exerciseKey: "pronunciation:missing",
          correct: false,
          attemptedAt: "2026-09-28T14:01:00.000Z",
        },
      ],
    },
    course,
    () => "2026-09-28",
  );

  assert.equal(validated.attempts.length, 1);
  assert.equal(
    validated.attempts[0].exerciseKey,
    "pronunciation:こんにちは",
  );

  const app = readFileSync("app.js", "utf8");

  assert.match(
    app,
    /exerciseKey:\s*"pronunciation:"\s*\+\s*word\.term/,
  );
});
