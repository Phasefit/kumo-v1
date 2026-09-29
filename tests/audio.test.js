import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadAudioController(voices) {
  const spoken = [];
  const synthesis = {
    cancel() {},
    getVoices: () => voices,
    speak: (utterance) => spoken.push(utterance),
  };
  class Utterance {
    constructor(text) { this.text = text; }
  }
  const context = {
    window: { speechSynthesis: synthesis },
    SpeechSynthesisUtterance: Utterance,
  };
  vm.runInNewContext(readFileSync("app/audio.js", "utf8"), context);
  return {
    create: () => context.window.KumoAudio.createAudioController({
      $: () => {},
      course: { code: "ja", speechLang: "ja-JP", speechRate: 0.78 },
      getCurrentAudio: () => null,
      setCurrentAudio: () => {},
    }),
    spoken,
  };
}

test("Japanese speech prefers exact locale and its system default voice", () => {
  const voices = [
    { name: "Generic Japanese", lang: "ja", default: true },
    { name: "Japanese alternate", lang: "ja-JP", default: false },
    { name: "Japanese default", lang: "ja-JP", default: true },
    { name: "English", lang: "en-US", default: true },
  ];
  const { create, spoken } = loadAudioController(voices);

  create().speak("こんにちは");

  assert.equal(spoken[0].voice.name, "Japanese default");
  assert.equal(spoken[0].lang, "ja-JP");
});

test("Japanese speech falls back to another Japanese voice when locale is unavailable", () => {
  const { create, spoken } = loadAudioController([
    { name: "English", lang: "en-US", default: true },
    { name: "Japanese", lang: "ja", default: false },
  ]);

  create().speak("こんにちは");

  assert.equal(spoken[0].voice.name, "Japanese");
});
