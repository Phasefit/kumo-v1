import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

function loadAudioController(voices) {
  const spoken = [];
  const audioInstances = [];
  let currentAudio = null;
  const synthesis = {
    cancel() {},
    getVoices: () => voices,
    speak: (utterance) => spoken.push(utterance),
  };
  class Utterance {
    constructor(text) { this.text = text; }
  }
  class AudioFile {
    constructor(src) { this.src = src; this.paused = false; audioInstances.push(this); }
    play() { this.played = true; return Promise.resolve(); }
    pause() { this.paused = true; }
  }
  const context = {
    window: { speechSynthesis: synthesis, Audio: AudioFile },
    SpeechSynthesisUtterance: Utterance,
  };
  vm.runInNewContext(readFileSync("app/audio.js", "utf8"), context);
  return {
    create: () => context.window.KumoAudio.createAudioController({
      $: () => {},
      course: { code: "ja", speechLang: "ja-JP", speechRate: 0.78 },
      getCurrentAudio: () => currentAudio,
      setCurrentAudio: (audio) => { currentAudio = audio; },
    }),
    spoken,
    audioInstances,
    getCurrentAudio: () => currentAudio,
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

test("local Japanese audio files play before browser speech synthesis", () => {
  const { create, spoken, audioInstances, getCurrentAudio } = loadAudioController([]);

  create().speak("こんにちは", "./audio/ja/word-konnichiwa.wav");

  assert.equal(audioInstances[0].src, "./audio/ja/word-konnichiwa.wav");
  assert.equal(audioInstances[0].played, true);
  assert.equal(getCurrentAudio(), audioInstances[0]);
  assert.equal(spoken.length, 0);
});

test("failed local audio falls back to browser speech only once", () => {
  const { create, spoken, audioInstances, getCurrentAudio } = loadAudioController([
    { name: "Japanese", lang: "ja-JP", default: true },
  ]);

  create().speak("こんにちは", "./audio/ja/missing.wav");
  audioInstances[0].onerror();
  audioInstances[0].onerror();

  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].text, "こんにちは");
  assert.equal(getCurrentAudio(), null);
});
