function createAudioController({ $, course, getCurrentAudio, setCurrentAudio }) {
  function speak(text, audioBase) {
    const currentAudio = getCurrentAudio();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (!audioBase) return speakWithBrowserVoice(text);
    const audio = new Audio(`audio/${audioBase}.wav`);
    setCurrentAudio(audio);
    audio.volume = 1;
    audio.play().then(() => showToast(`Spiller ${course.name} uttale…`)).catch(() => playMp3Fallback(text, audioBase));
  }

  function playMp3Fallback(text, audioBase) {
    const audio = new Audio(`audio/${audioBase}.mp3`);
    setCurrentAudio(audio);
    audio.play().then(() => showToast(`Spiller ${course.name} uttale…`)).catch(() => speakWithBrowserVoice(text));
  }

  function speakWithBrowserVoice(text) {
    if (!("speechSynthesis" in window)) return showToast("Kunne ikke spille av lyden.");
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = course.speechLang;
    utterance.rate = course.speechRate;
    const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(course.code));
    if (voice) utterance.voice = voice;
    utterance.onerror = () => showToast("Kunne ikke spille av lyden.");
    speechSynthesis.speak(utterance);
  }

  return { speak };
}

window.KumoAudio = { createAudioController };
