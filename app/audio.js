function createAudioController({ $, course, getCurrentAudio, setCurrentAudio }) {
  function speak(text, audioBase) {
    const currentAudio = getCurrentAudio();

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    return speakWithBrowserVoice(text);
  }

  function speakWithBrowserVoice(text) {
    if (!("speechSynthesis" in window)) {
      return showToast("Kunne ikke spille av lyden.");
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = course.speechLang;
    utterance.rate = course.speechRate;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoices = voices.filter((item) =>
      item.lang.toLowerCase().startsWith(course.code.toLowerCase()),
    );
    const exactLocaleVoices = matchingVoices.filter(
      (item) => item.lang.toLowerCase() === course.speechLang.toLowerCase(),
    );
    const voicePool = exactLocaleVoices.length ? exactLocaleVoices : matchingVoices;
    const voice = voicePool.find((item) => item.default) || voicePool[0];

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onerror = () => showToast("Kunne ikke spille av lyden.");
    window.speechSynthesis.speak(utterance);
  }

  return { speak };
}

window.KumoAudio = { createAudioController };
