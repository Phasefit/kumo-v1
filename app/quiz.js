(function () {
  let quizQuestions = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswers = [];
  let quizLocked = false;
  let quizActive = false;
  let restartButton = null;
  let bound = false;

  function syncLegacyState() {
    quizActive = Boolean(quizActive);
    if (typeof window !== "undefined") window.kumoQuizActive = quizActive;
  }

  function startQuiz() {
    quizQuestions = shuffle([...(course.quiz || [])]);
    quizIndex = 0;
    quizScore = 0;
    quizAnswers = [];
    quizLocked = false;
    quizActive = true;
    syncLegacyState();

    quizCountdown.setDueAt(ensureDueAt("quiz", 8));

    $("#quiz-result").classList.add("hidden");
    $("#quiz-question-area").classList.remove("hidden");

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const question = quizQuestions[quizIndex];
    if (!question) return finishQuiz();

    quizLocked = false;
    $("#quiz-progress-label").textContent = `Spørsmål ${quizIndex + 1} av ${quizQuestions.length}`;
    $("#quiz-score-label").textContent = `${quizScore} riktige`;
    $("#quiz-progress").style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
    $("#quiz-type").textContent = question.type;
    $("#quiz-question").textContent = question.question;
    $("#quiz-prompt").textContent = question.prompt;
    $("#quiz-feedback").textContent = "";
    $("#quiz-options").innerHTML = question.options
      .map((option) => `<button class="option-button" data-option="${option}">${option}</button>`)
      .join("");

    $$("#quiz-options .option-button").forEach((button) => {
      button.addEventListener("click", () => answerQuiz(button));
    });
  }

  function answerQuiz(button) {
    if (quizLocked) return;
    quizLocked = true;

    const question = quizQuestions[quizIndex];
    const correct = button.dataset.option === question.answer;

    quizAnswers.push({
      question: question.question,
      prompt: question.prompt,
      selected: button.dataset.option,
      correctAnswer: question.answer,
      correct,
    });

    state.answers += 1;

    $$("#quiz-options .option-button").forEach((item) => {
      item.disabled = true;
      if (item.dataset.option === question.answer) item.classList.add("correct");
    });

    if (correct) {
      quizScore += 1;
      state.correct += 1;
      $("#quiz-feedback").textContent = activeLanguage === "ja" ? "正解！ Riktig!" : "Doğru! Riktig!";
    } else {
      button.classList.add("wrong");
      $("#quiz-feedback").textContent = `Riktig svar: ${question.answer}`;
    }

    const matchingWord = course.words.find(
      (word) =>
        question.prompt.includes(word.term) ||
        question.answer === word.norwegian ||
        question.answer === word.term,
    );

    if (matchingWord) recordReview(matchingWord.term, correct);
    saveState();

    window.setTimeout(() => {
      quizIndex += 1;
      if (quizIndex < quizQuestions.length) renderQuizQuestion();
      else finishQuiz();
    }, 1000);
  }

  function finishQuiz() {
    quizActive = false;
    syncLegacyState();
    quizCountdown.setDueAt(null);

    if (state.dueAt.quiz) clearDueAt("quiz");

    const earned = quizScore * 5;
    state.xp += earned;
    state.bestQuizScore = Math.max(state.bestQuizScore, quizScore);
    markActivity();

    if (quizScore >= 6) completeLesson("quiz", quizScore);

    saveState();

    if (currentUser) {
      window.KumoServices.lesson
        .saveQuizResult(currentUser.id, activeLanguage, quizScore, quizQuestions.length, quizAnswers)
        .catch((error) => showToast(error.message));
    }

    $("#quiz-question-area").classList.add("hidden");
    $("#quiz-result").classList.remove("hidden");
    $("#quiz-progress").style.width = "100%";
    $("#quiz-progress-label").textContent = "Fullført";
    $("#quiz-score-label").textContent = `${quizScore} riktige`;
    $("#result-score").textContent = `${quizScore} / ${quizQuestions.length}`;
    $("#result-copy").textContent =
      quizScore >= 7
        ? "Strålende! Dette begynner virkelig å sitte."
        : quizScore >= 5
          ? "God økt. Litt repetisjon, så sitter resten også."
          : "En fin start. Gå gjerne gjennom bokstavene og uttrykkene én gang til.";

    showToast(`+${earned} XP · Quiz fullført`);
  }

  function stopQuiz() {
    quizActive = false;
    quizLocked = true;
    syncLegacyState();
    quizCountdown.setDueAt(null);
  }

  function replaceRestartHandler() {
    const current = $("#restart-quiz");
    if (!current || current === restartButton) return;

    const replacement = current.cloneNode(true);
    current.replaceWith(replacement);
    replacement.addEventListener("click", startQuiz);
    restartButton = replacement;
  }

  function bindLifecycleEvents() {
    if (bound) return;
    bound = true;
    replaceRestartHandler();

    ["#language-select", "#mobile-language-select", "#settings-language-select"].forEach((selector) => {
      $(selector)?.addEventListener("change", () => stopQuiz());
    });
    $("#reset-progress")?.addEventListener("click", () => stopQuiz());
  }

  function isActive() {
    return quizActive;
  }

  bindLifecycleEvents();

  window.KumoQuiz = Object.freeze({
    startQuiz,
    renderQuizQuestion,
    answerQuiz,
    finishQuiz,
    stopQuiz,
    isActive,
  });
})();
