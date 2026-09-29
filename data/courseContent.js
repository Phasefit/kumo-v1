(function () {
  const sharedLevels = [
    { title: "Overlevelsesspråk", topics: ["Hei", "Takk", "Ja / nei", "Hvor er toalettet?", "Jeg forstår ikke"] },
    { title: "Presentasjon", topics: ["Jeg heter …", "Jeg er fra Norge", "Jeg lærer språket"] },
    { title: "Reise", topics: ["Restaurant", "Hotell", "Transport", "Shopping"] },
    { title: "Samtale", topics: ["Hobbyer", "Familie", "Jobb", "Følelser"] },
    { title: "Grammatikk", topics: ["Tid", "Spørsmål", "Negasjon", "Partikler / endelser"] },
  ];

  window.KUMO_CONTENT = {
    ja: {
      levels: sharedLevels,
      displayModes: true,
      writingSections: [
        { title: "Hiragana", status: "I gang", copy: "Grunnskriften for japanske ord og bøyninger." },
        { title: "Katakana", status: "Kommer", copy: "Brukes særlig for lånord og utenlandske navn." },
        { title: "Grunnleggende kanji", status: "Kommer", copy: "En rolig introduksjon til vanlige tegn som 水 (vann)." },
      ],
      practicalPhrases: [
        { norwegian: "Hvor er toalettet?", target: "トイレはどこですか？", reading: "toire wa doko desu ka?" },
        { norwegian: "Jeg forstår ikke.", target: "わかりません。", reading: "wakarimasen" },
        { norwegian: "Én vann, takk.", target: "水を一つお願いします。", reading: "mizu o hitotsu onegaishimasu" },
      ],
      dailyLesson: {
        title: "Hei, vann og japansk ordstilling",
        minutes: 8,
        newWords: [
          { norwegian: "Hei", kana: "こんにちは", kanji: "", romaji: "konnichiwa", audio: "./audio/ja/konnichiwa.wav" },
          { norwegian: "Takk", kana: "ありがとう", kanji: "", romaji: "arigatou", audio: "word-arigatou" },
          { norwegian: "Vann", kana: "みず", kanji: "水", romaji: "mizu" },
          { norwegian: "Jeg er norsk", kana: "わたしはノルウェーじんです", kanji: "私はノルウェー人です", romaji: "watashi wa noruwee-jin desu" },
        ],
        examples: [
          { norwegian: "Jeg drikker vann.", target: "私は水を飲みます。", reading: "watashi wa mizu o nomimasu" },
          { norwegian: "Jeg er norsk.", target: "私はノルウェー人です。", reading: "watashi wa noruwee-jin desu" },
        ],
        grammar: {
          title: "Verbet kommer ofte til slutt",
          copy: "På norsk sier vi «Jeg spiser sushi». Japansk legger ofte verbet sist. Tenk derfor: «Jeg sushi spiser». Partiklene は og を viser hva setningen handler om og hva handlingen treffer.",
          comparison: ["Norsk: Jeg spiser sushi.", "Japansk struktur: Jeg / sushi / spiser."],
        },
        sentence: {
          norwegian: "Jeg drikker vann.",
          pieces: ["私は", "水を", "飲みます"],
          reading: "watashi wa / mizu o / nomimasu",
        },
        quiz: {
          question: "Hva betyr みず / 水?",
          options: ["Vann", "Hus", "Takk", "Hotell"],
          answer: "Vann",
        },
      },
      grammarNotes: [
        {
          title: "Verbet til slutt",
          tag: "Ordstilling",
          copy: "Japansk har ofte rekkefølgen tema–objekt–verb. For en nordmann føles det som at handlingen blir spart til slutt.",
          examples: ["Jeg spiser sushi.", "私は寿司を食べます。", "Jeg / sushi / spiser."],
        },
        {
          title: "Partikler er små skilt",
          tag: "は · を",
          copy: "Partikler står etter et ord og forteller hvilken jobb ordet har. は markerer tema, mens を markerer det direkte objektet.",
          examples: ["私は = når det gjelder meg", "水を = vann som objekt"],
        },
        {
          title: "Tre skriftsystemer",
          tag: "Kana + kanji",
          copy: "Hiragana brukes til grammatikk og mange japanske ord. Katakana brukes ofte til lånord. Kanji bærer betydning. Du trenger ikke lære alt samtidig.",
          examples: ["みず = mizu i hiragana", "水 = vann i kanji"],
        },
      ],
    },
  };
})();
