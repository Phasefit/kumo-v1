import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadFormatter(now) {
  const context = { window: {} };
  if (now !== undefined) {
    const RealDate = Date;
    context.Date = class extends RealDate {
    static now() {
      return now;
    }
    };
  }
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
  const fixedNow = Date.parse("2026-01-01T00:00:00Z");
  const formatRemainingTime = loadFormatter(fixedNow);

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
});
