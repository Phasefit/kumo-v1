(function () {
  function client() {
    return window.KumoSupabase.getClient();
  }

  function baseState() {
    return {
      xp: 0,
      streak: 0,
      learnedSymbols: [],
      rewardedSymbols: [],
      knownWords: [],
      difficultWords: [],
      answers: 0,
      correct: 0,
      completed: [],
      dailyCompletions: 0,
      lastDailyCompletion: null,
      bestQuizScore: 0,
      unlockedLevel: 1,
      reviewStats: {},
      activityDates: [],
      weeklyGoal: 3,
      reducedMotion: false,
      displayMode: "kanji",
      dueAt: { alphabetPractice: null, quiz: null, review: null },
      lastVisit: null,
    };
  }

  async function getOrCreateProgress(userId, languageCode) {
    const { courseId, databaseLanguage } = window.KumoServices.course.getCourseIdentity(languageCode);
    const { data, error } = await client()
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();
    if (error) throw new Error("Kunne ikke laste progresjonen.");
    if (data) return data;

    const { data: created, error: createError } = await client()
      .from("user_progress")
      .insert(
        {
          user_id: userId,
          course_id: courseId,
          selected_language: databaseLanguage,
          progress_data: baseState(),
          settings: { displayMode: "kanji" },
        },
      )
      .select()
      .single();
    if (createError?.code === "23505") {
      // Another tab may have created progress after the initial read.
      const { data: existing, error: readError } = await client()
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();
      if (readError || !existing) throw new Error("Kunne ikke laste progresjonen.");
      return existing;
    }
    if (createError) throw new Error("Kunne ikke opprette progresjonen.");
    return created;
  }

  function stateFromRow(row) {
    return {
      ...baseState(),
      ...(row?.progress_data || {}),
      xp: Number(row?.xp || 0),
      streak: Math.max(0, Number(row?.streak || 0)),
      displayMode: row?.settings?.displayMode || row?.progress_data?.displayMode || "kanji",
      weeklyGoal: Number(row?.settings?.weeklyGoal || row?.progress_data?.weeklyGoal || 3),
      reducedMotion: Boolean(row?.settings?.reducedMotion ?? row?.progress_data?.reducedMotion),
    };
  }

  async function saveProgress(userId, languageCode, state) {
    const { courseId, databaseLanguage } = window.KumoServices.course.getCourseIdentity(languageCode);
    const payload = {
      user_id: userId,
      course_id: courseId,
      selected_language: databaseLanguage,
      current_level: Math.min(5, Math.max(1, Number(state.unlockedLevel || 1))),
      xp: state.xp,
      streak: state.streak,
      last_lesson_date: state.lastDailyCompletion,
      settings: {
        displayMode: state.displayMode,
        weeklyGoal: state.weeklyGoal,
        reducedMotion: state.reducedMotion,
      },
      progress_data: state,
    };
    const { data, error } = await client()
      .from("user_progress")
      .upsert(payload, { onConflict: "user_id,course_id" })
      .select()
      .single();
    if (error) throw new Error("Kunne ikke lagre progresjonen.");
    return data;
  }

  async function syncDifficultWords(userId, languageCode, terms) {
    const { courseId } = window.KumoServices.course.getCourseIdentity(languageCode);
    const { data: vocabulary, error: vocabularyError } = await client()
      .from("vocabulary")
      .select("id,target")
      .eq("course_id", courseId);
    if (vocabularyError) throw new Error("Kunne ikke laste ordlisten.");

    const selectedIds = (vocabulary || []).filter((word) => terms.includes(word.target)).map((word) => word.id);
    const { data: existing, error: existingError } = await client()
      .from("difficult_words")
      .select("id,vocabulary_id")
      .eq("user_id", userId);
    if (existingError) throw new Error("Kunne ikke laste vanskelige ord.");

    const courseVocabularyIds = new Set((vocabulary || []).map((word) => word.id));
    const obsoleteIds = (existing || [])
      .filter((row) => courseVocabularyIds.has(row.vocabulary_id) && !selectedIds.includes(row.vocabulary_id))
      .map((row) => row.id);
    if (obsoleteIds.length) {
      const { error } = await client().from("difficult_words").delete().in("id", obsoleteIds);
      if (error) throw new Error("Kunne ikke oppdatere vanskelige ord.");
    }
    if (selectedIds.length) {
      const { error } = await client().from("difficult_words").upsert(
        selectedIds.map((vocabularyId) => ({
          user_id: userId,
          vocabulary_id: vocabularyId,
          last_reviewed_at: new Date().toISOString(),
        })),
        { onConflict: "user_id,vocabulary_id" },
      );
      if (error) throw new Error("Kunne ikke lagre vanskelige ord.");
    }
  }

  async function resetCourseProgress(userId, languageCode) {
    const { courseId } = window.KumoServices.course.getCourseIdentity(languageCode);
    const [{ data: lessons, error: lessonError }, { data: vocabulary, error: vocabularyError }] = await Promise.all([
      client().from("lessons").select("id").eq("course_id", courseId),
      client().from("vocabulary").select("id").eq("course_id", courseId),
    ]);
    if (lessonError || vocabularyError) throw new Error("Kunne ikke forberede nullstilling.");

    const lessonIds = (lessons || []).map((row) => row.id);
    const vocabularyIds = (vocabulary || []).map((row) => row.id);
    const operations = [
      client().from("user_progress").delete().eq("user_id", userId).eq("course_id", courseId),
    ];
    if (lessonIds.length) {
      operations.push(client().from("lesson_progress").delete().eq("user_id", userId).in("lesson_id", lessonIds));
      operations.push(client().from("quiz_results").delete().eq("user_id", userId).in("lesson_id", lessonIds));
    }
    if (vocabularyIds.length) {
      operations.push(
        client().from("difficult_words").delete().eq("user_id", userId).in("vocabulary_id", vocabularyIds),
      );
    }
    const results = await Promise.all(operations);
    if (results.some((result) => result.error)) throw new Error("Kunne ikke nullstille progresjonen.");
    return getOrCreateProgress(userId, languageCode);
  }

  window.KumoServices = window.KumoServices || {};
  window.KumoServices.progress = Object.freeze({
    getOrCreateProgress,
    stateFromRow,
    saveProgress,
    syncDifficultWords,
    resetCourseProgress,
  });
})();
