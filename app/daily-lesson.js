function createDailyLessonRenderer({
  $,
  $$,
  course,
  state,
  activeLanguage,
  dailySentenceAnswerRef,
  setDailySentenceAnswer,
  speak,
  saveState,
  shuffle,
  dueReviewWords,
  displayWordTerm,
}) {
  function updateDailyShell() {
    const label = $("#daily-step-label");
    const progress = $("#daily-progress");
    const card = $("#daily-card");
    if (!label || !progress || !card) return;

    const match = label.textContent.match(/Steg (\d+) av (\d+)/);
    if (!match) return;
    const step = Number(match[1]);
    const total = Number(match[2]);
    const shell = document.querySelector(".daily-progress-shell");
    if (!shell) return;

    let track = shell.querySelector(".daily-step-track");
    if (!track) {
      track = document.createElement("div");
      track.className = "daily-step-track";
      track.setAttribute("aria-hidden", "true");
      shell.appendChild(track);
    }
    track.innerHTML = Array.from({ length: total }, (_, index) => {
      const number = index + 1;
      const status = number < step ? "complete" : number === step ? "current" : "upcoming";
      return `<i class="daily-step-dot ${status}"></i>`;
    }).join("");

    shell.dataset.dailyStep = String(step);
    shell.dataset.dailyTotal = String(total);
    card.dataset.dailyStep = String(step);
    card.dataset.dailyFinal = String(step === total);

    let context = shell.querySelector(".daily-progress-context");
    if (!context) {
      context = document.createElement("small");
      context.className = "daily-progress-context";
      context.setAttribute("aria-live", "polite");
      shell.appendChild(context);
    }
    const contexts = [
      "Start rolig — hent frem ord du allerede kjenner.",
      "Bygg ordforrådet med fire nye byggesteiner.",
      "Se ett grammatikkmønster i praksis.",
      "Lytt, gjenta og få rytmen inn.",
      "Sett kunnskapen sammen til en hel setning.",
      "Avslutt med en rask sjekk — så er økten i mål.",
    ];
    context.textContent = contexts[step - 1] || "Fortsett i ditt eget tempo.";
  }

  function installDailyPolish() {
    const styleId = "kumo-daily-polish";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        #daily-view .daily-progress-shell {
          position: relative;
          gap: 10px;
          overflow: hidden;
        }
        #daily-view .daily-progress-shell > div:first-child {
          min-width: 150px;
        }
        #daily-view .daily-progress-context {
          display: block;
          color: var(--muted, #7f8a85);
          line-height: 1.45;
        }
        #daily-view .daily-step-track {
          display: flex;
          gap: 6px;
          width: 100%;
          order: 3;
        }
        #daily-view .daily-step-dot {
          display: block;
          height: 4px;
          flex: 1;
          border-radius: 999px;
          background: color-mix(in srgb, currentColor 12%, transparent);
          opacity: .55;
        }
        #daily-view .daily-step-dot.complete {
          opacity: .9;
        }
        #daily-view .daily-step-dot.current {
          opacity: 1;
          transform: scaleY(1.35);
        }
        #daily-view .daily-card {
          transition: opacity .18s ease, transform .18s ease;
        }
        #daily-view .daily-card[data-daily-final="true"] {
          border-color: color-mix(in srgb, currentColor 24%, transparent);
        }
        #daily-view .exercise-kicker {
          letter-spacing: .08em;
        }
        #daily-view .daily-actions {
          align-items: center;
        }
        #daily-view #daily-next:not(:disabled) {
          min-width: 150px;
        }
        @media (max-width: 720px) {
          #daily-view .daily-progress-shell {
            align-items: stretch;
          }
          #daily-view .daily-progress-shell > div:first-child {
            min-width: 0;
          }
          #daily-view .daily-progress-context {
            font-size: .82rem;
          }
          #daily-view .daily-actions {
            position: sticky;
            bottom: 12px;
            z-index: 5;
            padding: 10px;
            margin-inline: -10px;
            border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
            border-radius: 16px;
            background: color-mix(in srgb, var(--surface, #fff) 92%, transparent);
            backdrop-filter: blur(12px);
          }
          #daily-view .daily-actions button {
            min-height: 46px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const label = $("#daily-step-label");
    if (!label || label.dataset.dailyPolishBound === "true") return;
    label.dataset.dailyPolishBound = "true";
    const observer = new MutationObserver(updateDailyShell);
    observer.observe(label, { childList: true, characterData: true, subtree: true });
    updateDailyShell();
  }

  function renderReviewExercise() {
    const reviewWords = dueReviewWords();
    const words = reviewWords.length
      ? reviewWords.slice(0, 3)
      : course.words.slice(0, 3);
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
        const word = course.words.find(
          (item) => item.term === button.dataset.reviewTerm,
        );
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
      button.addEventListener("click", () =>
        speak(examples[Number(button.dataset.listenExample)].target),
      ),
    );
  }

  function renderSentenceBuilderExercise(sentence) {
    setDailySentenceAnswer([]);
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
        setDailySentenceAnswer([
          ...dailySentenceAnswerRef(),
          button.dataset.sentencePiece,
        ]);
        button.disabled = true;
        updateSentenceBuilder(sentence);
      }),
    );
    $("#sentence-reset").addEventListener("click", () =>
      renderSentenceBuilderExercise(sentence),
    );
  }

  function updateSentenceBuilder(sentence) {
    const dailySentenceAnswer = dailySentenceAnswerRef();
    $("#sentence-answer").innerHTML = dailySentenceAnswer
      .map((piece) => `<strong>${piece}</strong>`)
      .join("");
    if (dailySentenceAnswer.length !== sentence.pieces.length) return;
    const correct = dailySentenceAnswer.every(
      (piece, index) => piece === sentence.pieces[index],
    );
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
          if (item.dataset.dailyOption === quiz.answer)
            item.classList.add("correct");
        });
        if (!correct) button.classList.add("wrong");
        $("#daily-quiz-feedback").textContent = correct
          ? "Riktig! Dette sitter."
          : `Riktig svar er «${quiz.answer}».`;
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
        const difference = calendarDayDifference(
          state.lastDailyCompletion,
          today,
        );
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

  installDailyPolish();

  return {
    renderReviewExercise,
    renderNewWordsExercise,
    renderGrammarExercise,
    renderListenRepeatExercise,
    renderSentenceBuilderExercise,
    updateSentenceBuilder,
    renderMultipleChoiceExercise,
    finishDailyLesson,
  };
}

window.KumoDailyLesson = { createDailyLessonRenderer };