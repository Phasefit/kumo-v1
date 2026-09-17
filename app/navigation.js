function createNavigation({ $, $$, state, closeAlphabetPractice, startQuiz, renderDailyLesson, renderGrammar, renderProgress, renderDatabaseLesson, getActiveDatabaseLesson, getQuizActive, getReducedMotion, windowObject = window }) {
  let quizLoader = null;

  function loadQuizModule() {
    if (windowObject.KumoQuiz) return Promise.resolve(windowObject.KumoQuiz);
    if (quizLoader) return quizLoader;

    quizLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./app/quiz.js?v=2";
      script.async = true;
      script.onload = () => {
        if (windowObject.KumoQuiz) resolve(windowObject.KumoQuiz);
        else reject(new Error("Quiz-modulen kunne ikke lastes."));
      };
      script.onerror = () => reject(new Error("Quiz-modulen kunne ikke lastes."));
      document.head.appendChild(script);
    }).catch((error) => {
      quizLoader = null;
      throw error;
    });

    return quizLoader;
  }

  function startQuizSession() {
    if (windowObject.KumoQuiz) {
      windowObject.KumoQuiz.startQuiz();
      return;
    }
    loadQuizModule()
      .then((quiz) => quiz.startQuiz())
      .catch(() => startQuiz());
  }

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
    if (name === "quiz") {
      const quizActive = windowObject.KumoQuiz?.isActive?.() ?? getQuizActive();
      if (!quizActive) startQuizSession();
    }
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

function bindNavigationEvents({ $, $$, showView }) {
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
  $$("[data-view-target]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.viewTarget)));
  $$("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const routes = { "start-lesson": "daily", "open-kana": "kana", "open-words": "words", "open-quiz": "quiz" };
      showView(routes[button.dataset.action]);
    });
  });
  $("#menu-button").addEventListener("click", () => {
    const open = $(".sidebar").classList.toggle("open");
    $("#menu-button").setAttribute("aria-expanded", String(open));
  });
}

window.KumoNavigation = { createNavigation, bindNavigationEvents };
