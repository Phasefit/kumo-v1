(function () {
  function freshState() {
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

  function validNonNegativeInteger(value) {
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }

  function validDueAt(value) {
    return typeof value === "string" && !Number.isNaN(new Date(value).getTime()) ? value : null;
  }

  function isDateKey(value, localDateKey) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split("-").map(Number);
    return localDateKey(new Date(year, month - 1, day)) === value;
  }

  function validUniqueItems(value, allowedItems) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((item) => allowedItems.includes(item)))];
  }

  function validReviewStats(value, allowedWords) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value)
        .filter(([term]) => allowedWords.includes(term))
        .map(([term, item]) => [
          term,
          {
            intervalDays: Math.min(30, Math.max(0, Number(item?.intervalDays || 0))),
            correct: validNonNegativeInteger(item?.correct),
            incorrect: validNonNegativeInteger(item?.incorrect),
            dueAt: validDueAt(item?.dueAt),
          },
        ]),
    );
  }

  function validateState(value, selectedCourse, localDateKey) {
    const base = freshState();
    if (!value || typeof value !== "object" || Array.isArray(value)) return base;
    const allowedSymbols = selectedCourse.symbols.map((item) => item.char);
    const allowedWords = selectedCourse.words.map((item) => item.term);
    const learnedSymbols = validUniqueItems(value.learnedSymbols, allowedSymbols);
    return {
      xp: validNonNegativeInteger(value.xp),
      streak: validNonNegativeInteger(value.streak),
      learnedSymbols,
      rewardedSymbols: Array.isArray(value.rewardedSymbols)
        ? validUniqueItems(value.rewardedSymbols, allowedSymbols)
        : [...learnedSymbols],
      knownWords: validUniqueItems(value.knownWords, allowedWords),
      difficultWords: validUniqueItems(value.difficultWords, allowedWords),
      answers: validNonNegativeInteger(value.answers),
      correct: Math.min(validNonNegativeInteger(value.correct), validNonNegativeInteger(value.answers)),
      completed: validUniqueItems(value.completed, [
        "alphabet", "words", "quiz", "daily",
        ...(selectedCourse.database?.lessons || []).map((lesson) => `lesson:${lesson.id}`),
      ]),
      dailyCompletions: validNonNegativeInteger(value.dailyCompletions),
      lastDailyCompletion: isDateKey(value.lastDailyCompletion, localDateKey) ? value.lastDailyCompletion : null,
      bestQuizScore: Math.min(8, validNonNegativeInteger(value.bestQuizScore)),
      unlockedLevel: Math.min(5, Math.max(1, validNonNegativeInteger(value.unlockedLevel) || 1)),
      reviewStats: validReviewStats(value.reviewStats, allowedWords),
      activityDates: Array.isArray(value.activityDates)
        ? [...new Set(value.activityDates.filter((date) => isDateKey(date, localDateKey)))].slice(-120)
        : [],
      weeklyGoal: [2, 3, 4, 5, 7].includes(Number(value.weeklyGoal)) ? Number(value.weeklyGoal) : 3,
      reducedMotion: Boolean(value.reducedMotion),
      displayMode: ["romaji", "kana", "kanji"].includes(value.displayMode) ? value.displayMode : "kanji",
      dueAt: {
        alphabetPractice: validDueAt(value.dueAt?.alphabetPractice),
        quiz: validDueAt(value.dueAt?.quiz),
        review: validDueAt(value.dueAt?.review),
      },
      lastVisit: isDateKey(value.lastVisit, localDateKey) ? value.lastVisit : null,
    };
  }

  window.KumoState = Object.freeze({
    freshState,
    validNonNegativeInteger,
    validDueAt,
    isDateKey,
    validUniqueItems,
    validReviewStats,
    validateState,
  });
})();
