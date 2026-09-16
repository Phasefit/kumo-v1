function createDailyLessonRenderer({ $, $$, course, state, activeLanguage, dailySentenceAnswerRef, setDailySentenceAnswer, speak, saveState, shuffle, dueReviewWords, displayWordTerm, dailyWordTarget, dailyWordReading }) {
function renderReviewExercise() {
  const reviewWords = dueReviewWords();
  const words = reviewWords.length ? reviewWords.slice(0, 3) : course.words.slice(0, 3);
  $("#daily-card").innerHTML = `
    <span class="exercise-kicker">Repetisjon</span>
    <h2>Varm opp med ord du har sett før</h2>
    <p class="exercise-help">${reviewWords.length ? "Vanskelige og kjente ord prioriteres." : "Første økt? Vi bruker tre nyttige startord."}</p>
    <div class="mini-flashcard-grid">
      ${words
        .map(
          (word) => `
            <button class="mini-flashcard" data-review-term="${word.term}">
              <strong>${displayWordTerm(word)}</strong>
              <span>${word.norwegian}</span>
            </button>`,
        )
        .join("")}
    </div>`;
  $$("[data-review-term]").forEach((button) =>
    button.addEventListener("click", () => {
      const word = course.words.find((item) => item.term === button.dataset.reviewTerm);
      button.classList.toggle("revealed");
      speak(word.term, word.audio);
    }),
  );
}

function renderNewWordsExercise(words) {
  $("#daily-card").innerHTML = `
    <span class="exercise-kicker">Nye ord</span>
    <h2>Fire små byggesteiner</h2>
    <p class="exercise-help">Trykk på et ord for å høre uttalen. Manglende lyd bruker nettleserstemme som midlertidig støtte.</p>
    <div class="daily-word-list">
      ${words
        .map(
          (word, index) => `
            <button class="daily-word" data-daily-word="${index}">
              <span><small>${word.norwegian}</small><strong>${dailyWordTarget(word)}</strong></span>
              <span class="daily-reading">${dailyWordReading(word)}</span>
              <i>♪</i>
            </button>`,
        )
        .join("")}
    </div>`;
  $$("[data-daily-word]").forEach((button) =>
    button.addEventListener("click", () => {
      const word = words[Number(button.dataset.dailyWord)];
      speak(word.kanji || word.kana || word.term, word.audio);
    }),
  );
}

function dailyWordTarget(word) {
  if (activeLanguage !== "ja") return word.term;
  if (state.displayMode === "romaji") return word.romaji;
  if (state.displayMode === "kana") return word.kana;
  return word.kanji ? `${word.kana} · ${word.kanji}` : word.kana;
}

function dailyWordReading(word) {
  if (activeLanguage !== "ja") return word.reading;
  return state.displayMode === "romaji" ? "romaji" : word.romaji;
}

function renderGrammarExercise(note) {
  $("#daily-card").innerHTML = `
    <span class="exercise-kicker">Grammatikk på norsk</span>
    <h2>${note.title}</h2>
    <p class="grammar-copy">${note.copy}</p>
    <div class="comparison-stack">
      ${note.comparison.map((line) => `<span>${line}</span>`).join("")}
    </div>`;
}

function renderListenRepeatExercise(examples) {
  $("#daily-card").innerHTML = `
    <span class="exercise-kicker">Lytt og gjenta</span>
    <h2>Hør rytmen, og si setningen høyt</h2>
    <p class="exercise-help">Lydknappen bruker nettleserstemme når det ikke finnes et eget opptak ennå. Dette er en tydelig lydplassholder for senere studiokvalitet.</p>
    <div class="listen-repeat-list">
      ${examples
        .map(
          (example, index) => `
            <article>
              <span>${example.norwegian}</span>
              <strong>${example.target}</strong>
              <small>${example.reading}</small>
              <button class="listen-button" data-listen-example="${index}">♪ Hør og gjenta</button>
            </article>`,
        )
        .join("")}
    </div>`;
  $$("[data-listen-example]").forEach((button) =>
    button.addEventListener("click", () => speak(examples[Number(button.dataset.listenExample)].target)),
  );
}

function renderSentenceBuilderExercise(sentence) {
  dailySentenceAnswer = [];
  const shuffledPieces = shuffle([...sentence.pieces]);
  $("#daily-card").innerHTML = `
    <span class="exercise-kicker">Bygg setningen</span>
    <h2>${sentence.norwegian}</h2>
    <p class="exercise-help">Trykk delene i riktig rekkefølge.</p>
    <div class="sentence-answer" id="sentence-answer"><span>Setningen din vises her</span></div>
    <div class="sentence-pieces">
      ${shuffledPieces.map((piece) => `<button data-sentence-piece="${piece}">${piece}</button>`).join("")}
    </div>
    <button class="secondary-button sentence-reset" id="sentence-reset">Prøv på nytt</button>
    <p class="feedback" id="sentence-feedback"></p>`;
  $$("[data-sentence-piece]").forEach((button) =>
    button.addEventListener("click", () => {
      dailySentenceAnswer.push(button.dataset.sentencePiece);
      button.disabled = true;
      updateSentenceBuilder(sentence);
    }),
  );
  $("#sentence-reset").addEventListener("click", () => renderSentenceBuilderExercise(sentence));
}

function updateSentenceBuilder(sentence) {
  $("#sentence-answer").innerHTML = dailySentenceAnswer.map((piece) => `<strong>${piece}</strong>`).join("");
  if (dailySentenceAnswer.length !== sentence.pieces.length) return;
  const correct = dailySentenceAnswer.every((piece, index) => piece === sentence.pieces[index]);
  $("#sentence-feedback").textContent = correct
    ? `Riktig! ${sentence.reading}`
    : `Nesten. Riktig rekkefølge er: ${sentence.pieces.join(" / ")}`;
  $("#sentence-feedback").classList.toggle("success", correct);
  state.answers += 1;
  if (correct) {
    state.correct += 1;
    state.xp += 5;
  }
  saveState();
}

function renderMultipleChoiceExercise(quiz) {
  $("#daily-card").innerHTML = `
    <span class="exercise-kicker">Minisjekk</span>
    <h2>${quiz.question}</h2>
    <p class="exercise-help">Velg ett svar. Dette avslutter dagens korte økt.</p>
    <div class="quiz-options daily-quiz-options">
      ${quiz.options.map((option) => `<button class="option-button" data-daily-option="${option}">${option}</button>`).join("")}
    </div>
    <p class="feedback" id="daily-quiz-feedback"></p>`;
  $$("[data-daily-option]").forEach((button) =>
    button.addEventListener("click", () => {
      const correct = button.dataset.dailyOption === quiz.answer;
      $$("[data-daily-option]").forEach((item) => {
        item.disabled = true;
        if (item.dataset.dailyOption === quiz.answer) item.classList.add("correct");
      });
      if (!correct) button.classList.add("wrong");
      $("#daily-quiz-feedback").textContent = correct ? "Riktig! Dette sitter." : `Riktig svar er «${quiz.answer}».`;
      state.answers += 1;
      if (correct) {
        state.correct += 1;
        state.xp += 5;
      }
      saveState();
    }),
  );
}

function finishDailyLesson() {
  const today = localDateKey(new Date());
  if (state.lastDailyCompletion !== today) {
    if (state.lastDailyCompletion) {
      const difference = calendarDayDifference(state.lastDailyCompletion, today);
      state.streak = difference === 1 ? state.streak + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastDailyCompletion = today;
    state.dailyCompletions += 1;
    state.xp += 30;
    markActivity();
    if (!state.completed.includes("daily")) state.completed.push("daily");
    recordLessonCompletion("daily");
    scheduleReview();
    saveState();
    showToast("+30 XP · Dagens økt fullført!");
  } else {
    showToast("Dagens økt er allerede fullført. Flott jobbet!");
  }
  dailyStep = 0;
  showView("home");
}

}

window.KumoDailyLesson = { createDailyLessonRenderer };
