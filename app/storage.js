(function () {
  function createProgressStorage({
    getCurrentUser,
    getActiveLanguage,
    getState,
    setState,
    getIsHydrating,
    getPersistenceTimer,
    setPersistenceTimer,
    persistState,
    updateDashboard,
    windowObject = window,
  }) {
    const progressCacheKey = (language) =>
      `kumo-progress:${getCurrentUser()?.id || "guest"}:${language}`;
    const courseCacheKey = (language) => `kumo-course:${language}`;

    function saveState(showConfirmation = false) {
      const language = getActiveLanguage();
      const state = getState();
      setState(state);
      windowObject.localStorage.setItem(
        progressCacheKey(language),
        JSON.stringify(state),
      );
      windowObject.localStorage.setItem(`${progressCacheKey(language)}:pending`, "1");
      updateDashboard();
      if (!getCurrentUser() || getIsHydrating()) return false;

      if (showConfirmation) return persistState(true);
      windowObject.clearTimeout(getPersistenceTimer());
      setPersistenceTimer(
        windowObject.setTimeout(() => persistState(false), 350),
      );
      return true;
    }

    return { progressCacheKey, courseCacheKey, saveState };
  }

  window.KumoStorage = Object.freeze({ createProgressStorage });
})();
