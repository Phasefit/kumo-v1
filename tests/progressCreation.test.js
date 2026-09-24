import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadProgress({ existing = null, concurrent = null, writeError = null, readError = null } = {}) {
  let row = existing;
  let reads = 0;
  let writes = 0;
  const client = {
    from(table) {
      assert.equal(table, "user_progress");
      let payload;
      let operation;
      const filters = {};
      const query = {
        select() { return query; },
        eq(key, value) { filters[key] = value; return query; },
        async maybeSingle() {
          reads++;
          assert.deepEqual(filters, { user_id: "user-1", course_id: "japanese-a1" });
          return { data: row, error: readError };
        },
        insert(value) { payload = value; operation = "insert"; return query; },
        upsert(value) { payload = value; operation = "upsert"; return query; },
        async single() {
          writes++;
          if (writeError) return { data: null, error: writeError };
          if (concurrent) row = concurrent;
          if (row && operation === "insert") return { data: null, error: { code: "23505" } };
          row = { ...row, ...payload };
          return { data: row, error: null };
        },
      };
      return query;
    },
  };
  const context = { window: {
    KumoSupabase: { getClient: () => client },
    KumoServices: { course: { getCourseIdentity: () => ({ courseId: "japanese-a1", databaseLanguage: "japanese" }) } },
  } };
  vm.runInNewContext(readFileSync("services/progressService.js", "utf8"), context);
  return {
    create: () => context.window.KumoServices.progress.getOrCreateProgress("user-1", "ja"),
    stats: () => ({ reads, writes, row }),
  };
}

test("existing progress is returned without a write", async () => {
  const existing = { progress_data: { xp: 80 } };
  const service = loadProgress({ existing });
  assert.equal(await service.create(), existing);
  assert.equal(service.stats().writes, 0);
});

test("missing progress is created with initial state and correct owner", async () => {
  const service = loadProgress();
  const row = await service.create();
  assert.equal(row.user_id, "user-1");
  assert.equal(row.course_id, "japanese-a1");
  assert.equal(row.progress_data.xp, 0);
});

test("concurrently created progress and settings are preserved", async () => {
  const concurrent = { progress_data: { xp: 80, completed: ["lesson-1"] }, settings: { displayMode: "romaji" } };
  const service = loadProgress({ concurrent });
  assert.equal(await service.create(), concurrent);
  assert.equal(service.stats().row, concurrent);
  assert.equal(service.stats().reads, 2);
});

test("write failures are reported without retrying as creation conflicts", async () => {
  const service = loadProgress({ writeError: { code: "42501" } });
  await assert.rejects(service.create(), /Kunne ikke opprette progresjonen/);
  assert.equal(service.stats().reads, 1);
});

test("read failures do not trigger creation", async () => {
  const service = loadProgress({ readError: { code: "42501" } });
  await assert.rejects(service.create(), /Kunne ikke laste progresjonen/);
  assert.equal(service.stats().writes, 0);
});
