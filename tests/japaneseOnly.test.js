import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("authenticated app always loads Japanese", () => {
  const source = readFileSync("app.js", "utf8");

  const start = source.indexOf("async function hydrateAuthenticatedApp(");
  const end = source.indexOf("function setAuthMode(", start);

  assert.ok(start >= 0, "hydrateAuthenticatedApp not found");
  assert.ok(end > start, "hydrateAuthenticatedApp end not found");

  const hydrate = source.slice(start, end);

  assert.match(hydrate, /activeLanguage = "ja";/);
  assert.doesNotMatch(
    hydrate,
    /\{ japanese: "ja", turkish: "tr", albanian: "sq" \}/,
  );
  assert.doesNotMatch(hydrate, /currentProfile\.selected_language/);
});

test("legacy language selection UI is hidden in Japanese-only mode", () => {
  const css = readFileSync("styles.css", "utf8");

  assert.match(css, /\/\* Japanese-only product scope \*\//);
  assert.match(css, /\.language-gate,/);
  assert.match(css, /\.language-switcher,/);
  assert.match(css, /#mobile-language-select,/);
  assert.match(css, /#choose-language-again,/);
  assert.match(
    css,
    /#settings-view \.setting-row:has\(#settings-language-select\)/,
  );
  assert.match(css, /display: none !important;/);
});