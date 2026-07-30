(function () {
  function client() {
    return window.KumoSupabase.getClient();
  }

  function lessonId(languageCode, activity) {
    return `${languageCode}-${activity}`;
  }

  async function markLessonComplete(userId, languageCode, activity, score = 0) {
    return markLessonCompleteById(userId, lessonId(languageCode, activity), score);
  }

  async function markLessonCompleteById(userId, databaseLessonId, score = 0) {
    const { error } = await client().from("lesson_progress").upsert(
      {
        user_id: userId,
        lesson_id: databaseLessonId,
        status: "completed",
        score,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" },
    );
    if (error) throw new Error("Kunne ikke lagre fullført leksjon.");
  }

  async function saveQuizResult(userId, languageCode, score, totalQuestions, answers) {
    const { error } = await client().from("quiz_results").insert({
      user_id: userId,
      lesson_id: lessonId(languageCode, "quiz"),
      score,
      total_questions: totalQuestions,
      answers,
    });
    if (error) throw new Error("Kunne ikke lagre quizresultatet.");
  }

  window.KumoServices = window.KumoServices || {};
  window.KumoServices.lesson = Object.freeze({
    lessonId,
    markLessonComplete,
    markLessonCompleteById,
    saveQuizResult,
  });
})();
