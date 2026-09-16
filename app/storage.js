export function createProgressStorage({ currentUser, activeLanguage, state, setState, isHydrating, persistenceTimer, setPersistenceTimer, persistState, updateDashboard, windowObject = window }) {
  const progressCacheKey = (language) => `kumo-progress:${currentUser?.id || "guest"}:${language}`;
  const courseCacheKey = (language) => `kumo-course:${language}`;

  function saveState(showConfirmation = false) {
    setState(state);
    windowObject.localStorage.setItem(progressCacheKey(activeLanguage), JSON.stringify(state));
    windowObject.localStorage.setItem(`${progressCacheKey(activeLanguage)}:pending`, "1");
    updateDashboard();
    if (!currentUser || isHydrating) return false;

    if (showConfirmation) return persistState(true);
    windowObject.clearTimeout(persistenceTimer);
    setPersistenceTimer(windowObject.setTimeout(() => persistState(false), 350));
    return true;
  }

  return { progressCacheKey, courseCacheKey, saveState };
}
