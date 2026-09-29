import { readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const audioDir = join(root, "audio", "ja");
const manifest = JSON.parse(
  await readFile(join(audioDir, "manifest.json"), "utf8"),
);
const baseUrl = process.env.KUMO_VOICEVOX_URL || "http://127.0.0.1:50021";
const overwrite = process.argv.includes("--overwrite");

async function request(path, options) {
  const response = await fetch(new URL(path, baseUrl), options);
  if (!response.ok) {
    throw new Error(`VOICEVOX ${path} returned HTTP ${response.status}`);
  }
  return response;
}

const speakers = await (await request("/speakers")).json();
const metan = speakers.find((speaker) => speaker.name === "四国めたん");
const normalVoice = metan?.styles.find((style) => style.name === "ノーマル");
if (!normalVoice) throw new Error("VOICEVOX normal Shikoku Metan voice is unavailable.");

let generated = 0;
let skipped = 0;
for (const { file, text } of manifest) {
  const outputPath = join(audioDir, file);
  try {
    await stat(outputPath);
    if (!overwrite) {
      skipped += 1;
      continue;
    }
  } catch {
    // Missing audio is generated below.
  }

  const queryUrl = new URL("/audio_query", baseUrl);
  queryUrl.searchParams.set("text", text);
  queryUrl.searchParams.set("speaker", String(normalVoice.id));
  const queryResponse = await fetch(queryUrl, { method: "POST" });
  if (!queryResponse.ok) {
    throw new Error(`VOICEVOX audio query returned HTTP ${queryResponse.status} for ${file}`);
  }
  const query = await queryResponse.json();

  const audioResponse = await request(
    `/synthesis?speaker=${normalVoice.id}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    },
  );
  const audio = Buffer.from(await audioResponse.arrayBuffer());
  if (audio.toString("ascii", 0, 4) !== "RIFF" || audio.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`VOICEVOX returned an invalid WAV for ${file}`);
  }

  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, audio);
  await rename(temporaryPath, outputPath);
  generated += 1;
  console.log(`${file}: ${text} (${audio.length} bytes)`);
}

console.log(`VOICEVOX complete: ${generated} generated, ${skipped} existing files kept.`);
