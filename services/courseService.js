(function () {
  const languageMap = Object.freeze({
    ja: { databaseLanguage: "japanese", courseId: "japanese-a1" },
    tr: { databaseLanguage: "turkish", courseId: "turkish-a1" },
    sq: { databaseLanguage: "albanian", courseId: "albanian-a1" },
  });

  function client() {
    return window.KumoSupabase.getClient();
  }

  function getCourseIdentity(languageCode) {
    const identity = languageMap[languageCode];
    if (!identity) throw new Error("Ukjent kursspråk.");
    return identity;
  }

  async function fetchCourseBundle(languageCode) {
    const { courseId } = getCourseIdentity(languageCode);
    const [courseResult, levelsResult, lessonsResult, vocabularyResult, grammarResult, exerciseResult] =
      await Promise.all([
        client().from("courses").select("*").eq("id", courseId).single(),
        client().from("levels").select("*").eq("course_id", courseId).order("level_number"),
        client().from("lessons").select("*").eq("course_id", courseId).order("lesson_number"),
        client().from("vocabulary").select("*").eq("course_id", courseId),
        client().from("grammar_notes").select("*").eq("course_id", courseId),
        client().from("exercises").select("*").eq("course_id", courseId),
      ]);

    const firstError = [
      courseResult,
      levelsResult,
      lessonsResult,
      vocabularyResult,
      grammarResult,
      exerciseResult,
    ].find((result) => result.error)?.error;
    if (firstError) throw new Error("Kunne ikke laste kursinnholdet fra Supabase.");

    return {
      course: courseResult.data,
      levels: levelsResult.data || [],
      lessons: lessonsResult.data || [],
      vocabulary: vocabularyResult.data || [],
      grammarNotes: grammarResult.data || [],
      exercises: exerciseResult.data || [],
    };
  }

  window.KumoServices = window.KumoServices || {};
  window.KumoServices.course = Object.freeze({
    getCourseIdentity,
    fetchCourseBundle,
  });
})();
