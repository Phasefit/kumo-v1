import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("authenticated app always loads Japanese", () => {
  const source = readFileSync("app.js", "utf8");

  const start = source.indexOf("async function hydrateAuthenticatedApp(");
  const end = source.indexOf("function setAuthMode(", start);

  assert.ok(start >= 0);
  assert.ok(end > start);

  const hydrate = source.slice(start, end);

  assert.match(hydrate, /activeLanguage = "ja";/);
  assert.doesNotMatch(hydrate, /currentProfile\.selected_language/);
});

test("language selection UI is removed", () => {
  const html = readFileSync("index.html", "utf8");

  assert.doesNotMatch(html, /id="language-gate"/);
  assert.doesNotMatch(html, /id="language-select"/);
  assert.doesNotMatch(html, /id="mobile-language-select"/);
  assert.doesNotMatch(html, /id="settings-language-select"/);
  assert.doesNotMatch(html, /id="choose-language-again"/);
  assert.doesNotMatch(html, /data-language-choice=/);
});

test("only Japanese course routing remains", () => {
  const source = readFileSync("services/courseService.js", "utf8");

  assert.match(source, /courseId: "japanese-a1"/);
  assert.doesNotMatch(source, /turkish-a1/);
  assert.doesNotMatch(source, /albanian-a1/);
});

test("legacy Turkish and Albanian product code is removed", () => {
  const app = readFileSync("app.js", "utf8");
  const content = readFileSync("data/courseContent.js", "utf8");
  const profile = readFileSync("services/profileService.js", "utf8");
  const css = readFileSync("styles.css", "utf8");

  assert.doesNotMatch(app, /^  tr: \{/m);
  assert.doesNotMatch(app, /^  sq: \{/m);
  assert.doesNotMatch(app, /tr-TR|Doğru!|switchLanguage\(/);

  assert.doesNotMatch(content, /^    tr: \{/m);

  assert.doesNotMatch(profile, /turkish|albanian|updateSelectedLanguage/);

  assert.doesNotMatch(
    css,
    /hero-art\.turkish|data-course="tr"|language-gate|language-choice|language-switcher|mobile-language-select/,
  );
});
