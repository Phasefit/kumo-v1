import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadFormatter() {
  const context = { window: {} };
  vm.runInNewContext(readFileSync("lib/formatRemainingTime.js", "utf8"), context);
  return context.window.formatRemainingTime;
}

test("returns null for missing and invalid dates", () => {
  const formatRemainingTime = loadFormatter();
  assert.equal(formatRemainingTime(null), null);
  assert.equal(formatRemainingTime("not-a-date"), null);
});

test("returns overdue label for past dates", () => {
  const formatRemainingTime = loadFormatter();
  assert.equal(
    formatRemainingTime("2000-01-01T00:00:00Z", { left: "igjen", overdue: "Forfalt" }),
    "Forfalt",
  );
});

test("formats remaining days, hours and minutes", () => {
  const formatRemainingTime = loadFormatter();
  const originalNow = Date.now;
  Date.now = () => Date.parse("2026-01-01T00:00:00Z");

  try {
    assert.equal(
      formatRemainingTime("2026-01-02T02:03:00Z", { left: "igjen", overdue: "Forfalt" }),
      "1d 2h igjen",
    );
    assert.equal(
      formatRemainingTime("2026-01-01T02:03:00Z", { left: "igjen", overdue: "Forfalt" }),
      "2h 3m igjen",
    );
    assert.equal(
      formatRemainingTime("2026-01-01T00:03:00Z", { left: "igjen", overdue: "Forfalt" }),
      "3m igjen",
    );
  } finally {
    Date.now = originalNow;
  }
});
