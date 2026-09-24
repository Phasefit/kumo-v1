import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

test("explicit reduced-motion setting overrides legacy progress data", () => {
  const context = { window: {} };
  vm.runInNewContext(readFileSync("services/progressService.js", "utf8"), context);
  const { stateFromRow } = context.window.KumoServices.progress;
  assert.equal(stateFromRow({
    settings: { reducedMotion: false },
    progress_data: { reducedMotion: true },
  }).reducedMotion, false);
  assert.equal(stateFromRow({ progress_data: { reducedMotion: true } }).reducedMotion, true);
  assert.equal(stateFromRow(null).reducedMotion, false);
});

test("service-worker activation preserves other apps' caches and current Kumo cache", async () => {
  const handlers = {};
  const deleted = [];
  const waits = [];
  const context = {
    self: {
      addEventListener: (name, handler) => { handlers[name] = handler; },
      clients: { claim: async () => {} },
    },
    caches: {
      keys: async () => ["kumo-v18", "kumo-v19", "other-app-v1"],
      delete: async (key) => { deleted.push(key); return true; },
    },
  };
  vm.runInNewContext(readFileSync("service-worker.js", "utf8"), context);
  handlers.activate({ waitUntil: (promise) => waits.push(promise) });
  await Promise.all(waits);
  assert.deepEqual(deleted, ["kumo-v18"]);
});
