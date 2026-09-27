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

test("state replacement preserves renderer object identity", () => {
  const stateApi = loadStateModule();

  assert.equal(typeof stateApi.replaceStateContents, "function");

  const original = {
    xp: 4,
    answers: 1,
    obsolete: true,
  };

  const replacement = {
    xp: 42,
    answers: 8,
    correct: 6,
  };

  const result = stateApi.replaceStateContents(original, replacement);

  assert.equal(result, original);
  assert.equal(original.xp, 42);
  assert.equal(original.answers, 8);
  assert.equal(original.correct, 6);
  assert.equal("obsolete" in original, false);
});

test("course hydration does not replace the shared state reference", () => {
  const source = readFileSync("app.js", "utf8");

  assert.match(
    source,
    /replaceStateContents\(\s*state,\s*validateState\(restoredState,\s*courses\[language\]\),?\s*\)/s,
  );

  assert.doesNotMatch(
    source,
    /state\s*=\s*progressStore\[language\]/,
  );
});