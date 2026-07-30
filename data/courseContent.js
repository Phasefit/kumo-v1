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
          { norwegian: "Hei", kana: "こんにちは", kanji: "", romaji: "konnichiwa", audio: "word-konnichiwa" },
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
    tr: {
      levels: [
        { title: "Første møte", topics: ["Hilsener", "Ja / nei", "Takk", "Alfabet og uttale"] },
        { title: "Finn fram", topics: ["Hvor?", "Transport", "Billetter", "Tall og priser"] },
        { title: "Mat og kafé", topics: ["Bestille", "Drikke", "Regningen", "Smak og ønsker"] },
        { title: "Hverdagsprat", topics: ["Familie", "Jobb og studier", "Tid", "Følelser"] },
        { title: "Bygg tyrkisk", topics: ["Vokalharmoni", "Kasusendelser", "Eierskap", "Nåtid"] },
      ],
      displayModes: false,
      writingSections: [
        { title: "Alfabet og uttale", status: "I gang", copy: "29 bokstaver med faste og tydelige lydverdier." },
        { title: "Vokalharmoni", status: "I gang", copy: "Se hvordan endelser følger fremre og bakre vokaler i vanlige ord." },
        { title: "Tall og priser", status: "Ny", copy: "Spør om pris, forstå mengder og kjøp billetter på en trygg måte." },
        { title: "Reisefraser", status: "I gang", copy: "Restaurant, hotell, transport og shopping." },
        { title: "Hverdagsprat", status: "Ny", copy: "Presenter deg, spør hvordan noen har det og hold en enkel samtale i gang." },
      ],
      practicalPhrases: [
        { norwegian: "Hvor er toalettet?", target: "Tuvalet nerede?", reading: "tu-va-let ne-re-de" },
        { norwegian: "Jeg forstår ikke.", target: "Anlamıyorum.", reading: "an-la-mı-yo-rum" },
        { norwegian: "Kan du gjenta?", target: "Tekrar eder misiniz?", reading: "tek-rar e-der mi-si-niz" },
        { norwegian: "Saktere, takk.", target: "Yavaş, lütfen.", reading: "ya-vaş lüt-fen" },
        { norwegian: "Én vann, takk.", target: "Bir su, lütfen.", reading: "bir su lüt-fen" },
        { norwegian: "Regningen, takk.", target: "Hesap, lütfen.", reading: "he-sap lüt-fen" },
        { norwegian: "Hvor mye koster denne?", target: "Bu ne kadar?", reading: "bu ne ka-dar" },
        { norwegian: "Én billett til sentrum.", target: "Merkeze bir bilet.", reading: "mer-ke-ze bir bi-let" },
        { norwegian: "Hvor er bussholdeplassen?", target: "Otobüs durağı nerede?", reading: "o-to-büs du-ra-ı ne-re-de" },
        { norwegian: "Jeg trenger hjelp.", target: "Yardıma ihtiyacım var.", reading: "yar-dı-ma ih-ti-ya-cım var" },
      ],
      dailyLesson: {
        title: "Hei, hjelp og tyrkiske endelser",
        minutes: 9,
        newWords: [
          { norwegian: "Hei", term: "Merhaba", reading: "mer-ha-ba", audio: "tr-word-merhaba" },
          { norwegian: "Takk", term: "Teşekkürler", reading: "te-şek-kür-ler", audio: "tr-word-tesekkur" },
          { norwegian: "Vann", term: "Su", reading: "su" },
          { norwegian: "Hjelp", term: "Yardım", reading: "yar-dım" },
          { norwegian: "Jeg forstår ikke", term: "Anlamıyorum", reading: "an-la-mı-yo-rum" },
        ],
        examples: [
          { norwegian: "Jeg drikker vann.", target: "Ben su içerim.", reading: "ben su i-che-rim" },
          { norwegian: "Jeg forstår ikke.", target: "Anlamıyorum.", reading: "an-la-mı-yo-rum" },
          { norwegian: "Kan du hjelpe?", target: "Yardım eder misiniz?", reading: "yar-dım e-der mi-si-niz" },
        ],
        grammar: {
          title: "Tyrkisk bygger med endelser",
          copy: "Tyrkisk legger informasjon etter ordstammen. Ett ord kan derfor uttrykke det norsk trenger flere ord til. Endelsene endrer ofte form etter vokalharmoni.",
          comparison: ["ev = hus", "evde = i huset", "evim = huset mitt", "evimde = i huset mitt"],
        },
        sentence: {
          norwegian: "Jeg drikker vann.",
          pieces: ["Ben", "su", "içerim"],
          reading: "ben / su / i-che-rim",
        },
        quiz: {
          question: "Hva betyr «evimde»?",
          options: ["I huset mitt", "Huset ditt", "På hotellet", "Jeg drikker"],
          answer: "I huset mitt",
        },
      },
      grammarNotes: [
        {
          title: "Ord bygges med endelser",
          tag: "Suffikser",
          copy: "Tyrkisk er svært regelmessig og legger endelser bak en ordstamme. Tenk lego: hver del legger til én tydelig betydning.",
          examples: ["ev = hus", "evde = i huset", "evim = huset mitt", "evimde = i huset mitt"],
        },
        {
          title: "Verbet står ofte sist",
          tag: "Ordstilling",
          copy: "Som japansk setter tyrkisk ofte verbet til slutt. «Ben su içerim» kan tenkes som «Jeg vann drikker».",
          examples: ["Ben = jeg", "su = vann", "içerim = drikker"],
        },
        {
          title: "Vokalharmoni",
          tag: "Vokaler",
          copy: "Endelser tilpasser ofte vokalen sin til ordet foran. Fremre vokaler er e, i, ö og ü; bakre vokaler er a, ı, o og u.",
          examples: ["ev + de = evde · i huset", "okul + da = okulda · på skolen", "göl + ler = göller · innsjøer", "kitap + lar = kitaplar · bøker"],
        },
        {
          title: "Personen kan ligge i verbet",
          tag: "Pronomen",
          copy: "Ben betyr «jeg», men verbendelsen kan allerede vise personen. Derfor kan pronomenet ofte utelates når sammenhengen er tydelig.",
          examples: ["Ben = jeg · Sen = du · O = han/hun/det", "Biz = vi · Siz = dere/De · Onlar = de", "İçerim = (Jeg) drikker"],
        },
        {
          title: "Spørsmål med mi",
          tag: "Spørsmål",
          copy: "Ja/nei-spørsmål bruker spørsmålsordet mi, som skrives separat og tilpasser vokalen: mı, mi, mu eller mü.",
          examples: ["Hazır mısınız? = Er De/dere klar?", "Bu doğru mu? = Er dette riktig?", "Türkçe biliyor musun? = Kan du tyrkisk?"],
        },
        {
          title: "Sted med -de og -da",
          tag: "Kasus",
          copy: "Endelsen -de eller -da forteller at noe er i, på eller ved et sted. Formen følger vokalharmonien.",
          examples: ["evde = hjemme / i huset", "otelde = på hotellet", "Ankara'da = i Ankara"],
        },
        {
          title: "Høflige spørsmål",
          tag: "Høflighet",
          copy: "Endelsen -siniz gjør mange uttrykk høflige eller viser flertall. Til en ukjent voksen er den høflige formen et trygt valg.",
          examples: ["Nasılsınız? = Hvordan har De/dere det?", "Yardım eder misiniz? = Kan De hjelpe?", "Tekrar eder misiniz? = Kan De gjenta?"],
        },
      ],
    },
  };
})();
