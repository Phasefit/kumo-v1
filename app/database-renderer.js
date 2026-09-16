function createDatabaseRenderer({ $, $$, state, activeLanguage, getActiveLanguage, getActiveDatabaseLesson, getDatabaseLessonStep, speak, saveState, shuffle, escapeHtml }) {
function renderDatabaseLesson() {
  const lesson = getActiveDatabaseLesson();
  const { step, index: databaseLessonStep, total: databaseLessonStepCount } = getDatabaseLessonStep();
  if (!lesson || !step) return;

  $("#course-lesson-title").textContent = lesson.title;
  $("#course-lesson-description").textContent = lesson.description || "";
  $("#course-lesson-step").textContent = `Steg ${databaseLessonStep + 1} av ${databaseLessonStepCount}`;
  $("#course-lesson-time").textContent = `ca. ${lesson.estimated_minutes} minutter`;
  $("#course-lesson-progress").style.width = `${((databaseLessonStep + 1) / databaseLessonStepCount) * 100}%`;
  $("#course-lesson-previous").disabled = databaseLessonStep === 0;
  $("#course-lesson-next").textContent =
    databaseLessonStep === databaseLessonStepCount - 1 ? "Fullfør leksjonen ✓" : "Neste →";

  if (step.kind === "vocabulary") renderDatabaseVocabulary(step.item);
  else if (step.kind === "grammar") renderDatabaseGrammar(step.item);
  else if (step.kind === "exercise") renderDatabaseExercise(step.item);
  else {
    $("#course-lesson-card").innerHTML = `
      <span class="exercise-kicker">Introduksjon</span>
      <h2>${escapeHtml(lesson.title)}</h2>
      <p class="exercise-help">${escapeHtml(lesson.description)}</p>`;
  }
}

function renderDatabaseVocabulary(word) {
  const target =
    getActiveLanguage() === "ja" && state.displayMode === "kana"
      ? word.kana || word.target
      : word.kanji || word.target;
  const reading = getActiveLanguage() === "ja" ? word.romaji || word.kana : word.pronunciation_note;
  $("#course-lesson-card").innerHTML = `
    <span class="exercise-kicker">Nytt ord eller uttrykk</span>
    <h2>${escapeHtml(word.norwegian)}</h2>
    <div class="database-word">
      <strong>${escapeHtml(target)}</strong>
      ${reading ? `<span>${escapeHtml(reading)}</span>` : ""}
      ${word.pronunciation_note ? `<small>${escapeHtml(word.pronunciation_note)}</small>` : ""}
      <button class="listen-button" id="course-lesson-listen">♪ Hør uttale</button>
    </div>`;
  $("#course-lesson-listen").addEventListener("click", () => speak(word.target));
}

function renderDatabaseGrammar(note) {
  const examples = Array.isArray(note.examples) ? note.examples : [];
  $("#course-lesson-card").innerHTML = `
    <span class="exercise-kicker">Grammatikk på norsk</span>
    <h2>${escapeHtml(note.title)}</h2>
    <p class="grammar-copy">${escapeHtml(note.explanation_no)}</p>
    <div class="comparison-stack">
      ${examples.map((example) => `<span>${escapeHtml(example)}</span>`).join("")}
    </div>`;
}

function renderDatabaseExercise(exercise) {
  const data = exercise.data || {};
  if (exercise.type === "sentence_builder") {
    const pieces = Array.isArray(data.pieces) ? data.pieces : [];
    const answer = [];
    $("#course-lesson-card").innerHTML = `
      <span class="exercise-kicker">Bygg setningen</span>
      <h2>${escapeHtml(exercise.prompt_no)}</h2>
      <div class="sentence-answer" id="database-sentence-answer"><span>Setningen din vises her</span></div>
      <div class="sentence-pieces">
        ${shuffle([...pieces]).map((piece) => `<button data-database-piece="${escapeHtml(piece)}">${escapeHtml(piece)}</button>`).join("")}
      </div>
      <button class="secondary-button sentence-reset" id="database-sentence-reset">Prøv på nytt</button>
      <p class="feedback" id="database-exercise-feedback"></p>`;
    $$("[data-database-piece]").forEach((button) =>
      button.addEventListener("click", () => {
        answer.push(button.dataset.databasePiece);
        button.disabled = true;
        $("#database-sentence-answer").innerHTML = answer
          .map((piece) => `<strong>${escapeHtml(piece)}</strong>`)
          .join("");
        if (answer.length !== pieces.length) return;
        const correct = answer.every((piece, index) => piece === pieces[index]);
        $("#database-exercise-feedback").textContent = correct
          ? `Riktig! ${data.reading || ""}`
          : `Nesten. Riktig rekkefølge er: ${pieces.join(" / ")}`;
        $("#database-exercise-feedback").classList.toggle("success", correct);
        state.answers += 1;
        if (correct) state.correct += 1;
        saveState();
      }),
    );
    $("#database-sentence-reset").addEventListener("click", () => renderDatabaseExercise(exercise));
    return;
  }

  const options = Array.isArray(data.options) ? data.options : [];
  $("#course-lesson-card").innerHTML = `
    <span class="exercise-kicker">Minisjekk</span>
    <h2>${escapeHtml(exercise.prompt_no)}</h2>
    <div class="quiz-options">
      ${options.map((option) => `<button class="option-button" data-database-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
    </div>
    <p class="feedback" id="database-exercise-feedback"></p>`;
  $$("[data-database-option]").forEach((button) =>
    button.addEventListener("click", () => {
      const correct = button.dataset.databaseOption === String(data.answer);
      $$("[data-database-option]").forEach((item) => {
        item.disabled = true;
        if (item.dataset.databaseOption === String(data.answer)) item.classList.add("correct");
      });
      if (!correct) button.classList.add("wrong");
      $("#database-exercise-feedback").textContent = correct
        ? "Riktig!"
        : `Riktig svar er «${data.answer}».`;
      state.answers += 1;
      if (correct) state.correct += 1;
      saveState();
    }),
  );
}

  return { renderDatabaseLesson, renderDatabaseVocabulary, renderDatabaseGrammar, renderDatabaseExercise };
}

window.KumoDatabaseRenderer = { createDatabaseRenderer };
