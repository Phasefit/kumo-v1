import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "service-worker.js",
  "config/runtime-config.js",
  "lib/supabaseClient.js",
  "services/authService.js",
  "services/courseService.js",
  "services/lessonService.js",
  "services/profileService.js",
  "services/progressService.js",
  "data/courseContent.js",
];

test("core application files exist", () => {
  for (const file of requiredFiles) {
    assert.equal(existsSync(file), true, `Missing required file: ${file}`);
  }
});

test("runtime config contains no Supabase service-role secret", () => {
  const config = readFileSync("config/runtime-config.js", "utf8");
  assert.equal(/service_role/i.test(config), false);
});

test("PWA manifest declares required icons", () => {
  const manifest = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
  assert.equal(manifest.name, "Kumo – lær japansk, tyrkisk og albansk");
  assert.ok(Array.isArray(manifest.icons));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
});
