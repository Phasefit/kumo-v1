import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadProgressStorage() {
  const values = new Map();
  const timers = [];
  const clearedTimers = [];
  const context = { window: {} };
  vm.runInNewContext(readFileSync("app/storage.js", "utf8"), context);

  return {
    create: context.window.KumoStorage.createProgressStorage,
    values,
    timers,
    clearedTimers,
  };
}

function setupStorage() {
  const loaded = loadProgressStorage();
  const localStorage = {
    setItem: (key, value) => loaded.values.set(key, value),
  };
  let currentUser = null;
  let activeLanguage = "ja";
  let state = { xp: 4 };
  let isHydrating = false;
  let persistenceTimer = null;
  const store = {};
  const persistCalls = [];
  let dashboardUpdates = 0;

  const storage = loaded.create({
    getCurrentUser: () => currentUser,
    getActiveLanguage: () => activeLanguage,
    getState: () => state,
    setState: (nextState) => { store[activeLanguage] = nextState; },
    getIsHydrating: () => isHydrating,
    getPersistenceTimer: () => persistenceTimer,
    setPersistenceTimer: (timer) => { persistenceTimer = timer; },
    persistState: (showConfirmation) => {
      persistCalls.push(showConfirmation);
      return "persisted";
    },
    updateDashboard: () => { dashboardUpdates += 1; },
    windowObject: {
      localStorage,
      clearTimeout: (timer) => loaded.clearedTimers.push(timer),
      setTimeout: (callback, delay) => {
        const timer = { callback, delay };
        loaded.timers.push(timer);
        return timer;
      },
    },
  });

  return {
    ...loaded,
    storage,
    store,
    persistCalls,
    get currentUser() { return currentUser; },
    set currentUser(value) { currentUser = value; },
    set activeLanguage(value) { activeLanguage = value; },
    set state(value) { state = value; },
    set isHydrating(value) { isHydrating = value; },
    get persistenceTimer() { return persistenceTimer; },
    get dashboardUpdates() { return dashboardUpdates; },
  };
}

test("progress storage uses the current user and language and saves locally while logged out", () => {
  const setup = setupStorage();
  const state = setup.store;

  assert.equal(setup.storage.saveState(), false);
  assert.equal(setup.values.get("kumo-progress:guest:ja"), '{"xp":4}');
  assert.equal(state.ja.xp, 4);
  assert.equal(setup.values.get("kumo-progress:guest:ja:pending"), "1");
  assert.equal(setup.dashboardUpdates, 1);
  assert.equal(setup.timers.length, 0);
});

test("progress storage debounces persistence for the current signed-in user", () => {
  const setup = setupStorage();
  setup.currentUser = { id: "user-1" };
  setup.activeLanguage = "ja";

  assert.equal(setup.storage.saveState(), true);
  assert.equal(setup.values.get("kumo-progress:user-1:ja"), '{"xp":4}');
  assert.equal(setup.timers.length, 1);
  assert.equal(setup.timers[0].delay, 350);
  setup.timers[0].callback();
  assert.deepEqual(setup.persistCalls, [false]);

  setup.activeLanguage = "ja";
  assert.equal(setup.storage.saveState(true), "persisted");
  assert.deepEqual(setup.persistCalls, [false, true]);
  assert.equal(setup.clearedTimers.length, 1);
});

test("progress storage writes during hydration but does not schedule a save", () => {
  const setup = setupStorage();
  setup.currentUser = { id: "user-1" };
  setup.isHydrating = true;

  assert.equal(setup.storage.saveState(), false);
  assert.equal(setup.values.get("kumo-progress:user-1:ja"), '{"xp":4}');
  assert.equal(setup.timers.length, 0);
  assert.equal(setup.persistCalls.length, 0);
});

test("cache key helpers reflect the current account", () => {
  const setup = setupStorage();
  assert.equal(setup.storage.progressCacheKey("ja"), "kumo-progress:guest:ja");
  assert.equal(setup.storage.courseCacheKey("ja"), "kumo-course:ja");
  setup.currentUser = { id: "user-2" };
  assert.equal(setup.storage.progressCacheKey("ja"), "kumo-progress:user-2:ja");
});

test("browser loads progress storage before app composition and avoids duplicate helpers", () => {
  const html = readFileSync("index.html", "utf8");
  const appSource = readFileSync("app.js", "utf8");

  assert.ok(
    html.indexOf('src="app/storage.js?v=2"') < html.indexOf('src="app.js?v=26"'),
  );
  assert.match(appSource, /window\.KumoStorage\.createProgressStorage/);
  assert.doesNotMatch(appSource, /function saveState\(/);
  assert.doesNotMatch(appSource, /function progressCacheKey\(/);
  assert.doesNotMatch(appSource, /function courseCacheKey\(/);
});
