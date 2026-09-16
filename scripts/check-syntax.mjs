import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const ignored = new Set(["node_modules", ".git"]);
const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".js")) {
      files.push(fullPath);
    }
  }
}

walk(root);

const failures = [];
for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    failures.push({ file: relative(root, file), output: error.stderr?.toString() || error.stdout?.toString() || String(error) });
  }
}

if (failures.length) {
  console.error("JavaScript syntax check failed:");
  for (const failure of failures) {
    console.error(`\n[${failure.file}]\n${failure.output}`);
  }
  process.exit(1);
}

console.log(`JavaScript syntax OK: ${files.length} files checked.`);
