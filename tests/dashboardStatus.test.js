import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function createCard(action) {
  const badge = {
    textContent: "",
    className: "",
    setAttribute() {},
  };

  return {
    dataset: { action },
    badge,
    querySelector(selector) {
      return selector === ".dashboard-status" && badge.className
        ? badge
        : null;
    },
    appendChild(element) {
      this.badge = element;
    },
  };
}

test("dashboard uses actual completion keys instead of completed count", () => {
  const cards = [
    createCard("open-kana"),
    createCard("open-words"),
    createCard("open-quiz"),
  ];

  const progress = {
    textContent: "1",
    dataset: {
      completedKeys: JSON.stringify(["words"]),
    },
  };

  const home = {
    querySelectorAll(selector) {
      return selector === ".lesson-card" ? cards : [];
    },
  };

  const document = {
    readyState: "loading",
    addEventListener() {},
    getElementById(id) {
      if (id === "home-view") return home;
      if (id === "completed-lessons") return progress;
      return null;
    },
    createElement() {
      return {
        textContent: "",
        className: "",
        setAttribute() {},
      };
    },
  };

  const context = {
    window: {},
    document,
    MutationObserver: class {
      observe() {}
    },
  };

  vm.runInNewContext(
    readFileSync("app/dashboard-polish.js", "utf8"),
    context,
  );

  context.window.KumoDashboardPolish.updateLessonStatuses();

  assert.deepEqual(
    cards.map((card) => card.dataset.dashboardStatus),
    ["active", "completed", "next"],
  );

  assert.deepEqual(
    cards.map((card) => card.badge.textContent),
    ["Neste steg", "Fullført", "Kommer"],
  );
});
