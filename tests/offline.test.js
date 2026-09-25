import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

function profileService() {
  const localStorage = storage();
  const navigator = { onLine: true };
  let requests = 0;
  const profile = { id: "user-1", display_name: "Elev", selected_language: "turkish" };
  const query = {
    select() { return this; },
    eq() { return this; },
    async maybeSingle() { requests++; return { data: profile, error: null }; },
  };
  const context = { navigator, localStorage, window: { KumoSupabase: { getClient: () => ({ from: () => query }) } } };
  vm.runInNewContext(readFileSync("services/profileService.js", "utf8"), context);
  return { localStorage, navigator, profile, requests: () => requests, service: context.window.KumoServices.profile };
}

test("offline profile uses the signed-in user's cached profile without a request", async () => {
  const setup = profileService();
  await setup.service.getOrCreateProfile({ id: "user-1" });
  setup.navigator.onLine = false;
  const result = await setup.service.getOrCreateProfile({ id: "user-1" });
  assert.equal(result.selected_language, "turkish");
  assert.equal(setup.requests(), 1);
});

test("offline profile cannot use another user's cache", async () => {
  const setup = profileService();
  await setup.service.getOrCreateProfile({ id: "user-1" });
  setup.navigator.onLine = false;
  await assert.rejects(setup.service.getOrCreateProfile({ id: "user-2" }), /Koble til nettet/);
  assert.equal(setup.requests(), 1);
});

test("invalid or mismatched cached profiles report an offline error", async () => {
  for (const cached of ["broken json", JSON.stringify({ id: "other-user", selected_language: "turkish" })]) {
    const setup = profileService();
    setup.localStorage.setItem("kumo-profile:user-1", cached);
    setup.navigator.onLine = false;
    await assert.rejects(setup.service.getOrCreateProfile({ id: "user-1" }), /Koble til nettet/);
    assert.equal(setup.requests(), 0);
  }
});

test("unavailable cache storage does not prevent online profile loading", async () => {
  const setup = profileService();
  setup.localStorage.setItem = () => { throw new Error("storage unavailable"); };
  assert.equal(await setup.service.getOrCreateProfile({ id: "user-1" }), setup.profile);
});

test("offline saves remain pending and can sync after reconnection", async () => {
  const localStorage = storage();
  localStorage.setItem("progress:tr:pending", "1");
  let writes = 0;
  const context = {
    currentUser: { id: "user-1" }, navigator: { onLine: false }, localStorage,
    persistenceTimer: null, persistenceChain: Promise.resolve(), syncPending: false,
    activeLanguage: "tr", course: { name: "tyrkisk" }, state: { xp: 42, difficultWords: [] },
    lastDifficultWordsSignature: "[]", progressCacheKey: (language) => `progress:${language}`,
    updateConnectivityUi() {}, updateSaveStatus() {}, $: () => ({}),
    window: { clearTimeout() {}, KumoServices: { progress: {
      async saveProgress(userId, language, snapshot) {
        writes++;
        assert.equal(userId, "user-1");
        assert.equal(language, "tr");
        assert.equal(snapshot.xp, 42);
      },
    } } },
  };
  const source = readFileSync("app.js", "utf8");
  vm.runInNewContext(source.slice(source.indexOf("async function persistState("), source.indexOf("async function flushProgress(")), context);
  assert.equal(await context.persistState(), false);
  assert.equal(writes, 0);
  assert.equal(context.syncPending, true);
  assert.equal(localStorage.getItem("progress:tr:pending"), "1");
  localStorage.removeItem = (key) => localStorage.setItem(key, null);
  context.navigator.onLine = true;
  assert.equal(await context.persistState(), true);
  assert.equal(writes, 1);
  assert.equal(context.syncPending, false);
  assert.equal(localStorage.getItem("progress:tr:pending"), null);
});

// Evaluate the existing orchestration function with controlled dependencies.
function loadCourseContext(cached = true) {
  const localStorage = storage();
  if (cached) {
    localStorage.setItem("course:tr", JSON.stringify({ lessons: ["lesson-1"] }));
    localStorage.setItem("progress:user-1:tr", JSON.stringify({ xp: 42, difficultWords: [] }));
  }
  let requests = 0;
  const context = {
    currentUser: { id: "user-1" }, navigator: { onLine: false }, localStorage,
    isHydrating: false, syncPending: false, courses: { tr: {} }, progressStore: {},
    state: null, lastDifficultWordsSignature: "",
    courseCacheKey: (language) => `course:${language}`,
    progressCacheKey: (language) => `progress:user-1:${language}`,
    validateState: (state) => state,
    window: { KumoServices: {
      course: { fetchCourseBundle: async () => { requests++; throw new Error("network request"); } },
      progress: { getOrCreateProgress: async () => { requests++; throw new Error("network request"); } },
    } },
  };
  const source = readFileSync("app.js", "utf8");
  vm.runInNewContext(source.slice(source.indexOf("async function loadCourseAndProgress("), source.indexOf("function updateAccountUi(")), context);
  return { context, requests: () => requests };
}

test("offline course loading restores local progress without remote reads", async () => {
  const setup = loadCourseContext();
  await setup.context.loadCourseAndProgress("tr");
  assert.equal(setup.requests(), 0);
  assert.equal(setup.context.state.xp, 42);
  assert.equal(setup.context.syncPending, true);
  assert.equal(setup.context.isHydrating, false);
});

test("offline course without cache reports a useful error and exits hydration", async () => {
  const setup = loadCourseContext(false);
  await assert.rejects(setup.context.loadCourseAndProgress("tr"), /Koble til nettet/);
  assert.equal(setup.context.isHydrating, false);
});

test("service-worker installation caches every local script loaded by the page", async () => {
  const handlers = {};
  let assets;
  let completion;
  vm.runInNewContext(readFileSync("service-worker.js", "utf8"), {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    caches: { open: async () => ({ addAll: async (urls) => { assets = urls; } }) },
  });
  handlers.install({ waitUntil: (promise) => { completion = promise; } });
  await completion;
  const html = readFileSync("index.html", "utf8");
  for (const [, src] of html.matchAll(/<script src="([^"]+)"/g)) {
    if (!src.startsWith("http")) assert.ok(assets.includes(`./${src}`), `Not precached: ${src}`);
  }
});
