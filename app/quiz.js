@'
(function () {
  function createQuizController({
    $,
    $$,
    course,
    state,
    getActiveLanguage,
    getQuizQuestions,
    setQuizQuestions,
    getQuizIndex,
    setQuizIndex,
    getQuizScore,
    setQuizScore,
    getQuizAnswers,
    setQuizAnswers,
    getQuizLocked,
    setQuizLocked,
    getQuizActive,
    setQuizActive,
    ensureDueAt,
    clearDueAt,
    quizCountdown,
    shuffle,
    recordReview,
    saveState,
    markActivity,
    completeLesson,
    saveQuizResult,
    showToast,
  }) {
    function startQuiz() {
      const questions = shuffle([...(course.quiz || [])]);

      setQuizQuestions(questions);
      setQuizIndex(0);
      setQuizScore(0);
      setQuizAnswers([]);
      setQuizLocked(false);
      setQuizActive(true);

      quizCountdown.setDueAt(ensureDueAt("quiz", 8));

      $("#quiz-result").classList.add("hidden");
      $("#quiz-question-area").classList.remove("hidden");

      renderQuizQuestion();
    }

    function renderQuizQuestion() {
      const questions = getQuizQuestions();
      const index = getQuizIndex();
      const question = questions[index];

      if (!question) {
        finishQuiz();
        return;
      }

      setQuizLocked(false);

      $("#quiz-progress-label").textContent =
        `Spørsmål ${index + 1} av ${questions.length}`;

      $("#quiz-score-label").textContent =
        `${getQuizScore()} riktige`;

      $("#quiz-progress").style.width =
        `${(index / questions.length) * 100}%`;

      $("#quiz-type").textContent = question.type;
      $("#quiz-question").textContent = question.question;
      $("#quiz-prompt").textContent = question.prompt;
      $("#quiz-feedback").textContent = "";

      $("#quiz-options").innerHTML = question.options
        .map(
          (option) =>
            `<button class="option-button" data-option="${option}">${option}</button>`,
        )
        .join("");

      $$("#quiz-options .option-button").forEach((button) => {
        button.addEventListener("click", () => answerQuiz(button));
      });
    }

    function answerQuiz(button) {
      if (getQuizLocked()) return;

      setQuizLocked(true);

      const questions = getQuizQuestions();
      const index = getQuizIndex();
      const question = questions[index];
      const selected = button.dataset.option;
      const correct = selected === question.answer;

      const answers = getQuizAnswers();

      answers.push({
        question: question.question,
        prompt: question.prompt,
        selected,
        correctAnswer: question.answer,
        correct,
      });

      setQuizAnswers(answers);

      state.answers += 1;

      $$("#quiz-options .option-button").forEach((item) => {
        item.disabled = true;

        if (item.dataset.option === question.answer) {
          item.classList.add("correct");
        }
      });

      if (correct) {
        setQuizScore(getQuizScore() + 1);
        state.correct += 1;

        $("#quiz-feedback").textContent =
          getActiveLanguage() === "ja"
            ? "正解！ Riktig!"
            : "Doğru! Riktig!";
      } else {
        button.classList.add("wrong");

        $("#quiz-feedback").textContent =
          `Riktig svar: ${question.answer}`;
      }

      const matchingWord = course.words.find(
        (word) =>
          question.prompt.includes(word.term) ||
          question.answer === word.norwegian ||
          question.answer === word.term,
      );

      if (matchingWord) {
        recordReview(matchingWord.term, correct);
      }

      saveState();

      window.setTimeout(() => {
        const nextIndex = getQuizIndex() + 1;
        setQuizIndex(nextIndex);

        if (nextIndex < getQuizQuestions().length) {
          renderQuizQuestion();
        } else {
          finishQuiz();
        }
      }, 1000);
    }

    function finishQuiz() {
      const score = getQuizScore();
      const questions = getQuizQuestions();
      const answers = getQuizAnswers();

      setQuizActive(false);

      quizCountdown.setDueAt(null);

      if (state.dueAt.quiz) {
        clearDueAt("quiz");
      }

      const earned = score * 5;

      state.xp += earned;
      state.bestQuizScore = Math.max(
        state.bestQuizScore,
        score,
      );

      markActivity();

      if (score >= 6) {
        completeLesson("quiz", score);
      }

      saveState();

      saveQuizResult(score, questions.length, answers);

      $("#quiz-question-area").classList.add("hidden");
      $("#quiz-result").classList.remove("hidden");

      $("#quiz-progress").style.width = "100%";
      $("#quiz-progress-label").textContent = "Fullført";
      $("#quiz-score-label").textContent = `${score} riktige`;
      $("#result-score").textContent =
        `${score} / ${questions.length}`;

      $("#result-copy").textContent =
        score >= 7
          ? "Strålende! Dette begynner virkelig å sitte."
          : score >= 5
            ? "God økt. Litt repetisjon, så sitter resten også."
            : "En fin start. Gå gjerne gjennom bokstavene og uttrykkene én gang til.";

      showToast(`+${earned} XP · Quiz fullført`);
    }

    return Object.freeze({
      startQuiz,
      renderQuizQuestion,
      answerQuiz,
      finishQuiz,
    });
  }

  window.KumoQuiz = Object.freeze({
    createQuizController,
  });
})();
'@ | Set-Content -Path ".\app\quiz.js" -Encoding UTF8
