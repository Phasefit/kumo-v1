function createNavigation({ $, $$, state, closeAlphabetPractice, startQuiz, renderDailyLesson, renderGrammar, renderProgress, renderDatabaseLesson, getActiveDatabaseLesson, getQuizActive, getReducedMotion, windowObject = window }) {
  function showView(name) {
    if (name !== "kana") closeAlphabetPractice();
    $$(".view").forEach((view) => view.classList.toggle("active", view.id === `${name}-view`));
    $$(".nav-item").forEach((item) => {
      const active = item.dataset.view === name;
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    $(".sidebar").classList.remove("open");
    windowObject.scrollTo({ top: 0, behavior: getReducedMotion() ? "auto" : "smooth" });
    if (name === "quiz" && !getQuizActive()) startQuiz();
    if (name === "daily") renderDailyLesson();
    if (name === "grammar") renderGrammar();
    if (name === "progress") renderProgress();
    if (name === "course-lesson" && getActiveDatabaseLesson()) renderDatabaseLesson();
    const heading = $(`#${name}-view h1`);
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
  return { showView };
}

window.KumoNavigation = { createNavigation };
