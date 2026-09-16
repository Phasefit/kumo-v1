const {
  freshState,
  validUniqueItems,
  validReviewStats,
  validNonNegativeInteger,
  validDueAt,
  isDateKey: isDateKeyBase,
  validateState: validateStateBase,
} = window.KumoState;
const courses = {
  ja: {
    code: "ja",
    speechLang: "ja-JP",
    speechRate: 0.78,
    name: "japansk",
    nativeName: "日本語",
    brandMark: "雲",
    navIcon: "あ",
    navLabel: "Kana",
    streakIcon: "火",
    learnedIcon: "葉",
    accuracyIcon: "星",
    learnedLabel: "Lærte tegn",
    heroEyebrow: "今日の一歩 · dagens lille steg",
    heroQuestion: "klar for japansk?",
    heroDescription:
      "Bruk ti rolige minutter. Vi begynner med tegnene, lydene og ordene du faktisk får bruk for.",
    greetings: ["おはようございます、", "こんにちは、", "こんばんは、"],
    alphabetEyebrow: "Skriftsystem · ひらがな",
    alphabetTitle: "Hiragana, ett tegn om gangen",
    alphabetDescription: "Trykk på et kort for å høre lyden. Merk tegn du føler at du kan.",
    practiceQuestion: "Hvilken lyd har dette tegnet?",
    wordsEyebrow: "Ordforråd · ことば",
    quizEyebrow: "Kunnskapssjekk · テスト",
    resultMark: "よくできました！",
    lessonOne: {
      symbol: "あ",
      meta: "5 min · tegn",
      title: "Hiragana: vokaler og stavelser",
      description: "Lær de første 15 hiragana-tegnene med lyd og små huskeregler.",
    },
    lessonTwo: {
      symbol: "話",
      title: "Hilsener i hverdagen",
      description: "Si hei, god morgen og takk på en naturlig måte.",
    },
    lessonThreeSymbol: "問",
    symbols: [
      ["あ", "a", "åpen, kort a-lyd", "kana-a"],
      ["い", "i", "kort i, som i «fin»", "kana-i"],
      ["う", "u", "lepper nesten urundet", "kana-u"],
      ["え", "e", "som e i «se», men kort", "kana-e"],
      ["お", "o", "kort norsk å-lignende lyd", "kana-o"],
      ["か", "ka", "k + åpen a", "kana-ka"],
      ["き", "ki", "k + kort i", "kana-ki"],
      ["く", "ku", "k + urundet u", "kana-ku"],
      ["け", "ke", "k + kort e", "kana-ke"],
      ["こ", "ko", "k + kort å-lignende lyd", "kana-ko"],
      ["さ", "sa", "s + åpen a", "kana-sa"],
      ["し", "shi", "«shi» – ikke norsk «ski»", "kana-shi"],
      ["す", "su", "u-en blir ofte svært svak", "kana-su"],
      ["せ", "se", "s + kort e", "kana-se"],
      ["そ", "so", "s + kort å-lignende lyd", "kana-so"],
    ].map(([char, reading, tip, audio]) => ({ char, reading, tip, audio })),
    words: [
      ["おはようございます", "ohayō gozaimasu", "God morgen", "Høflig standardform. おはよう er uformelt og brukes med familie, venner og nære kolleger.", "word-ohayou"],
      ["こんにちは", "konnichiwa", "Hei / god dag", "En trygg og nøytral hilsen på dagtid. は skrives «ha», men uttales «wa» her.", "word-konnichiwa"],
      ["ありがとうございます", "arigatō gozaimasu", "Takk", "Høflig og trygg standardform. ありがとう alene er uformelt.", "word-arigatou"],
      ["すみません", "sumimasen", "Unnskyld / beklager", "Brukes for å få oppmerksomhet, ved en lett beklagelse og noen ganger som takknemlighet.", "word-sumimasen"],
      ["はい", "hai", "Ja", "Betyr også «jeg hører deg» eller «forstått», og er ikke alltid full enighet.", "word-hai"],
      ["いいえ", "iie", "Nei", "Korrekt, men kan virke direkte. I hverdagen mykner man ofte avslaget.", "word-iie"],
      ["じゃあ、また", "jā, mata", "Da sees vi", "En svært vanlig, uformell avskjed.", "word-jaamata"],
      ["またね", "mata ne", "Vi sees", "Avslappet og vennlig. Brukes med venner og andre du kjenner godt.", "word-matane"],
    ].map(([term, reading, norwegian, note, audio]) => ({ term, reading, norwegian, note, audio })),
    quiz: [
      ["HIRAGANA", "Hvilken lyd har tegnet?", "あ", ["a", "i", "o", "ka"], "a"],
      ["HIRAGANA", "Hvilket tegn er «ki»?", "ki", ["か", "き", "く", "け"], "き"],
      ["ORD", "Hva betyr dette?", "ありがとうございます", ["Unnskyld", "Takk", "God morgen", "Farvel"], "Takk"],
      ["HIRAGANA", "Hvilken lyd har tegnet?", "し", ["sa", "shi", "su", "so"], "shi"],
      ["ORD", "Hvordan sier du «unnskyld»?", "Velg riktig japansk ord", ["はい", "またね", "すみません", "いいえ"], "すみません"],
      ["HIRAGANA", "Hvilket tegn er «o»?", "o", ["う", "え", "お", "こ"], "お"],
      ["ORD", "Hva betyr «じゃあ、また»?", "じゃあ、また", ["Da sees vi", "Takk", "Ja", "God dag"], "Da sees vi"],
      ["HIRAGANA", "Hvilken lyd har tegnet?", "く", ["ke", "ko", "ku", "ka"], "ku"],
    ].map(([type, question, prompt, options, answer]) => ({ type, question, prompt, options, answer })),
  },
  tr: {
    code: "tr",
    speechLang: "tr-TR",
    speechRate: 0.86,
    name: "tyrkisk",
    nativeName: "Türkçe",
    brandMark: "K",
    navIcon: "Ç",
    navLabel: "Alfabet",
    streakIcon: "☀",
    learnedIcon: "Ç",
    accuracyIcon: "★",
    learnedLabel: "Lærte bokstaver",
    heroEyebrow: "Bugünün adımı · dagens lille steg",
    heroQuestion: "klar for tyrkisk?",
    heroDescription:
      "Lær moderne standardtyrkisk fra Tyrkia med tydelig uttale og uttrykk du møter i skole, medier og dagligtale.",
    greetings: ["Günaydın,", "Merhaba,", "İyi akşamlar,"],
    alphabetEyebrow: "Alfabet · Türk alfabesi",
    alphabetTitle: "Tyrkisk alfabet og uttale",
    alphabetDescription:
      "Tyrkisk bruker 29 latinske bokstaver. Trykk for å høre bokstavlyden og merk dem du kjenner.",
    practiceQuestion: "Hvordan uttales denne bokstaven?",
    wordsEyebrow: "Ordforråd · günlük ifadeler",
    quizEyebrow: "Kunnskapssjekk · kısa sınav",
    resultMark: "Çok iyi!",
    lessonOne: {
      symbol: "Ç",
      meta: "7 min · alfabet",
      title: "Det tyrkiske alfabetet",
      description: "Lær alle 29 bokstaver, særlig ı, İ, ç, ğ, ö, ş og ü.",
    },
    lessonTwo: {
      symbol: "Mer",
      title: "Hilsener og høflighet",
      description: "Bruk naturlige høflige og uformelle uttrykk i riktig situasjon.",
    },
    lessonThreeSymbol: "?",
    symbols: [
      ["A a", "a", "åpen a, omtrent som i «far»", "tr-letter-a"],
      ["B b", "b", "b som i «bil»", "tr-letter-b"],
      ["C c", "ce", "djsj-lyd, som engelsk j i «jam»", "tr-letter-c"],
      ["Ç ç", "çe", "tsj-lyd, som i «tsjekk»", "tr-letter-ch"],
      ["D d", "d", "d som i «dag»", "tr-letter-d"],
      ["E e", "e", "kort e; kan være åpnere enn norsk e", "tr-letter-e"],
      ["F f", "f", "f som i «fin»", "tr-letter-f"],
      ["G g", "ge", "alltid tydelig g som i «gate»", "tr-letter-g"],
      ["Ğ ğ", "yumuşak ge", "«myk g»: forlenger ofte vokalen foran", "tr-letter-soft-g"],
      ["H h", "he", "tydelig h, også inne i ord", "tr-letter-h"],
      ["I ı", "ı", "bakre, urundet vokal uten norsk motstykke", "tr-letter-dotless-i"],
      ["İ i", "i", "i som i «fin»; stor bokstav har prikk", "tr-letter-i"],
      ["J j", "je", "sj-lyd som i fransk «journal»", "tr-letter-j"],
      ["K k", "ke", "k som i «katt»", "tr-letter-k"],
      ["L l", "le", "l; lys eller mørk etter vokalen", "tr-letter-l"],
      ["M m", "me", "m som i «mat»", "tr-letter-m"],
      ["N n", "ne", "n som i «natt»", "tr-letter-n"],
      ["O o", "o", "kort, rund o-lyd", "tr-letter-o"],
      ["Ö ö", "ö", "som norsk ø", "tr-letter-oe"],
      ["P p", "pe", "p som i «pil»", "tr-letter-p"],
      ["R r", "re", "kort tungeslag, ikke engelsk r", "tr-letter-r"],
      ["S s", "se", "alltid ustemt s som i «se»", "tr-letter-s"],
      ["Ş ş", "şe", "sj-lyd som i «sju»", "tr-letter-sh"],
      ["T t", "te", "t som i «tak»", "tr-letter-t"],
      ["U u", "u", "rund bakre u, nær norsk o i «bok»", "tr-letter-u"],
      ["Ü ü", "ü", "som norsk y", "tr-letter-ue"],
      ["V v", "ve", "v som i «vin»", "tr-letter-v"],
      ["Y y", "ye", "j-lyd som i «ja»", "tr-letter-y"],
      ["Z z", "ze", "stemt z, som engelsk z", "tr-letter-z"],
    ].map(([char, reading, tip, audio]) => ({ char, reading, tip, audio })),
    words: [
      ["Merhaba", "mer-ha-ba", "Hei", "Nøytral og svært vanlig hilsen. Passer både uformelt og høflig.", "tr-word-merhaba"],
      ["Günaydın", "gü-nay-dın", "God morgen", "Vanlig standardhilsen om morgenen. Kan brukes til både kjente og ukjente.", "tr-word-gunaydin"],
      ["Nasılsınız?", "na-sıl-sı-nız", "Hvordan har De/dere det?", "Høflig form til én person, eller flertall. Til venner sier man Nasılsın?", "tr-word-nasilsiniz"],
      ["Teşekkür ederim", "te-şek-kür e-de-rim", "Takk", "Høflig og trygg standardform. Teşekkürler er kortere og vanlig i dagligtale.", "tr-word-tesekkur"],
      ["Lütfen", "lüt-fen", "Vær så snill", "Brukes i høflige forespørsler. Tyrkisk bruker ofte også verbformer for å uttrykke høflighet.", "tr-word-lutfen"],
      ["Affedersiniz", "af-fe-der-si-niz", "Unnskyld", "Høflig når du vil ha oppmerksomhet eller beklage lett. Afedersin er uformelt.", "tr-word-affedersiniz"],
      ["Evet", "e-vet", "Ja", "Nøytral standardform i både formelle og uformelle samtaler.", "tr-word-evet"],
      ["Hayır", "ha-yır", "Nei", "Nøytral standardform. Et mykere avslag forklares ofte med beklager eller en grunn.", "tr-word-hayir"],
      ["Görüşürüz", "gö-rü-şü-rüz", "Vi sees", "Naturlig og svært vanlig avskjed, både uformelt og nøytralt.", "tr-word-gorusuruz"],
      ["Hoşça kal", "hoş-ça kal", "Ha det bra", "Sies vanligvis av den som går, til den som blir. Svaret er ofte Güle güle.", "tr-word-hoscakal"],
      ["Güle güle", "gü-le gü-le", "Ha det bra", "Sies vanligvis av den som blir igjen, til personen som går."],
      ["Tamam", "ta-mam", "Greit / ok", "Et svært vanlig svar når du godtar, forstår eller bekrefter noe."],
      ["Bilmiyorum", "bil-mi-yo-rum", "Jeg vet ikke", "Nyttig i samtaler. Endelsen -yorum viser at handlingen gjelder jeg i nåtid."],
      ["Anlamıyorum", "an-la-mı-yo-rum", "Jeg forstår ikke", "En viktig frase når du trenger at noen gjentar eller forklarer."],
      ["Yavaş, lütfen", "ya-vaş lüt-fen", "Saktere, takk", "Bruk denne når noen snakker for fort. Yavaş betyr sakte."],
      ["Ne kadar?", "ne ka-dar", "Hvor mye?", "Brukes for å spørre om pris. Du kan også si Bu ne kadar? – Hvor mye koster denne?"],
      ["Nerede?", "ne-re-de", "Hvor?", "Kombineres med stedet du leter etter: Otel nerede? – Hvor er hotellet?"],
      ["Bir bilet", "bir bi-let", "Én billett", "Bir betyr både tallet én og den ubestemte artikkelen en/ei/et."],
      ["Hesap, lütfen", "he-sap lüt-fen", "Regningen, takk", "En kort og naturlig frase på restaurant eller kafé."],
      ["Çok güzel", "çok gü-zel", "Veldig fint / godt", "Güzel brukes om noe som er fint, vakkert eller smaker godt."],
    ].map(([term, reading, norwegian, note, audio]) => ({ term, reading, norwegian, note, audio })),
    quiz: [
      ["ALFABET", "Hvilken lyd har «Ç»?", "Ç ç", ["tsj", "sj", "djsj", "j"], "tsj"],
      ["ALFABET", "Hvilken bokstav mangler prikk?", "Velg riktig tegn", ["I ı", "İ i", "Ö ö", "Ü ü"], "I ı"],
      ["ORD", "Hva betyr dette?", "Teşekkür ederim", ["Unnskyld", "Takk", "God morgen", "Ha det"], "Takk"],
      ["ALFABET", "Hvilken lyd har «Ş»?", "Ş ş", ["s", "sj", "tsj", "z"], "sj"],
      ["ORD", "Hvilken form er høflig?", "Hvordan har De/dere det?", ["Nasılsın?", "Nasılsınız?", "Merhaba", "Görüşürüz"], "Nasılsınız?"],
      ["ALFABET", "Hva gjør «Ğ» vanligvis?", "Ğ ğ", ["Forlenger vokalen foran", "Gir hard g", "Gir sj-lyd", "Er alltid stum"], "Forlenger vokalen foran"],
      ["ORD", "Hva betyr «Görüşürüz»?", "Görüşürüz", ["Vi sees", "Vær så snill", "Nei", "God morgen"], "Vi sees"],
      ["ORD", "Hvem sier vanligvis «Hoşça kal»?", "Hoşça kal", ["Den som går", "Den som blir", "Bare en lærer", "Bare et barn"], "Den som går"],
      ["ORD", "Hvordan ber du noen snakke saktere?", "Velg riktig frase", ["Yavaş, lütfen", "Hesap, lütfen", "Güle güle", "Çok güzel"], "Yavaş, lütfen"],
      ["ORD", "Hva betyr «Anlamıyorum»?", "Anlamıyorum", ["Jeg vet ikke", "Jeg forstår ikke", "Jeg vil ikke", "Jeg kommer ikke"], "Jeg forstår ikke"],
      ["REISE", "Hvordan spør du om prisen?", "Hvor mye?", ["Ne kadar?", "Nerede?", "Nasılsınız?", "Tamam mı?"], "Ne kadar?"],
      ["RESTAURANT", "Hva sier du når du vil betale?", "Regningen, takk", ["Bir bilet", "Hesap, lütfen", "Bir su", "Affedersiniz"], "Hesap, lütfen"],
      ["GRAMMATIKK", "Hva betyr «nerede»?", "nerede", ["hvor", "når", "hvorfor", "hvem"], "hvor"],
      ["ORD", "Hva betyr «Çok güzel»?", "Çok güzel", ["Veldig fint", "Altfor dyrt", "Litt kaldt", "Ganske langt"], "Veldig fint"],
      ["GRAMMATIKK", "Hvilket ord betyr både «én» og «en/ei/et»?", "Velg riktig ord", ["bir", "çok", "ne", "bu"], "bir"],
      ["ORD", "Hva betyr «Bilmiyorum»?", "Bilmiyorum", ["Jeg forstår ikke", "Jeg vet ikke", "Jeg husker ikke", "Jeg snakker ikke"], "Jeg vet ikke"],
    ].map(([type, question, prompt, options, answer]) => ({ type, question, prompt, options, answer })),
  },
  sq: {
    code: "sq",
    speechLang: "sq-AL",
    speechRate: 0.86,
    name: "albansk",
    nativeName: "Shqip",
    brandMark: "K",
    navIcon: "Ë",
    navLabel: "Alfabet",
    streakIcon: "☀",
    learnedIcon: "Ç",
    accuracyIcon: "★",
    learnedLabel: "Lærte bokstaver",
    heroEyebrow: "Hapi i sotëm · dagens lille steg",
    heroQuestion: "klar for albansk?",
    heroDescription:
      "Lær albansk med tydelig uttale, praktiske fraser og norsk forklaring på de viktigste mønstrene.",
    greetings: ["Mirëmëngjes,", "Përshëndetje,", "Mirëmbrëma,"],
    alphabetEyebrow: "Alfabet · alfabeti shqip",
    alphabetTitle: "Albansk alfabet og uttale",
    alphabetDescription:
      "Albansk bruker latinske bokstaver med viktige lyder som ë, ç, gj, nj, sh og xh.",
    practiceQuestion: "Hvordan uttales denne bokstaven eller lyden?",
    wordsEyebrow: "Ordforråd · fjalë të dobishme",
    quizEyebrow: "Kunnskapssjekk · provë e shkurtër",
    resultMark: "Shumë mirë!",
    lessonOne: {
      symbol: "Ë",
      meta: "6 min · alfabet",
      title: "Albanske lyder",
      description: "Lær ë, ç og vanlige bokstavkombinasjoner med enkle huskeregler.",
    },
    lessonTwo: {
      symbol: "Për",
      title: "Hilsener i hverdagen",
      description: "Si hei, god morgen, takk og ha det på en naturlig måte.",
    },
    lessonThreeSymbol: "?",
    symbols: [
      ["A a", "a", "åpen a, omtrent som i «far»"],
      ["Ë ë", "ë", "svak e-lyd, ofte kort og lett"],
      ["Ç ç", "ç", "tsj-lyd, som i «tsjekk»"],
      ["Dh dh", "dh", "stemt th-lyd, som engelsk «this»"],
      ["Gj gj", "gj", "myk g/j-lyd"],
      ["Ll ll", "ll", "mørkere l-lyd"],
      ["Nj nj", "nj", "som nj i «canyon»"],
      ["Rr rr", "rr", "tydelig r-lyd"],
      ["Sh sh", "sh", "sj-lyd, som i «sju»"],
      ["Th th", "th", "ustemt th-lyd, som engelsk «think»"],
      ["X x", "x", "dz-lyd"],
      ["Xh xh", "xh", "djsj-lyd, som engelsk j i «jam»"],
    ].map(([char, reading, tip, audio]) => ({ char, reading, tip, audio })),
    words: [
      ["Përshëndetje", "per-shen-DE-tje", "Hei", "Nøytral hilsen. Sh uttales som sj, og ë er en svak e-lyd."],
      ["Mirëmëngjes", "mi-re-MEN-gjes", "God morgen", "Vanlig morgenhilsen. Gj gir en myk g/j-lyd."],
      ["Faleminderit", "fa-le-min-DE-rit", "Takk", "Trygg og høflig takk-form."],
      ["Mirupafshim", "mi-ru-PAF-shim", "Ha det", "Høflig og vanlig avskjed."],
      ["Po", "po", "Ja", "Kort og tydelig ja."],
      ["Jo", "jo", "Nei", "Kort og tydelig nei."],
      ["Unë", "u-ne", "Jeg", "Ë på slutten er svak og kort."],
      ["Ti", "ti", "Du", "Enkel og vanlig tiltaleform."],
      ["Ujë", "u-je", "Vann", "Nyttig ord på kafé og reise."],
      ["Kafe", "ka-FE", "Kaffe", "Ligner norsk, men trykket ligger ofte mot slutten."],
      ["Shtëpi", "shte-PI", "Hus", "Sh uttales sj; ë er kort."],
      ["Ku?", "ku", "Hvor?", "Brukes i spørsmål som «Ku është hoteli?»."],
    ].map(([term, reading, norwegian, note, audio]) => ({ term, reading, norwegian, note, audio })),
    quiz: [
      ["ALFABET", "Hvilken lyd har «ç»?", "Ç ç", ["tsj", "sj", "r", "dh"], "tsj"],
      ["ALFABET", "Hvilken kombinasjon uttales omtrent som sj?", "Velg riktig", ["sh", "dh", "gj", "rr"], "sh"],
      ["ORD", "Hva betyr dette?", "Faleminderit", ["Takk", "Hei", "Vann", "Hvor"], "Takk"],
      ["ORD", "Hvordan sier du «ja»?", "Velg riktig albansk ord", ["Po", "Jo", "Ku", "Ti"], "Po"],
      ["ORD", "Hva betyr «ujë»?", "ujë", ["Vann", "Kaffe", "Hus", "Takk"], "Vann"],
      ["ALFABET", "Hvilken bokstav er typisk svak e-lyd?", "Velg riktig tegn", ["ë", "ç", "x", "rr"], "ë"],
      ["ORD", "Hva betyr «Mirupafshim»?", "Mirupafshim", ["Ha det", "God morgen", "Jeg", "Kaffe"], "Ha det"],
      ["ORD", "Hva betyr «Ku?»?", "Ku?", ["Hvor?", "Hva?", "Ja", "Nei"], "Hvor?"],
    ].map(([type, question, prompt, options, answer]) => ({ type, question, prompt, options, answer })),
    dailyLesson: {
      title: "Hei, vann og albanske lyder",
      minutes: 7,
      newWords: [
        { norwegian: "Hei", term: "Përshëndetje", reading: "per-shen-DE-tje" },
        { norwegian: "Takk", term: "Faleminderit", reading: "fa-le-min-DE-rit" },
        { norwegian: "Vann", term: "Ujë", reading: "u-je" },
        { norwegian: "Jeg heter Chris", term: "Unë quhem Chris", reading: "u-ne chu-hem Chris" },
      ],
      examples: [
        { norwegian: "Jeg vil ha vann.", target: "Dua ujë.", reading: "du-a u-je" },
        { norwegian: "Hvor er hotellet?", target: "Ku është hoteli?", reading: "ku eshte ho-te-li" },
      ],
      grammar: {
        title: "Nuk lager negasjon",
        copy: "Albansk bruker ofte nuk foran verbet for å lage negative setninger. På A1 kan du lære frasen som et fast mønster.",
        comparison: ["Pi kafe = Jeg drikker kaffe", "Nuk pi kafe = Jeg drikker ikke kaffe"],
      },
      sentence: {
        norwegian: "Jeg vil ha vann.",
        pieces: ["Dua", "ujë"],
        reading: "du-a / u-je",
      },
      quiz: {
        question: "Hva betyr «Përshëndetje»?",
        options: ["Hei", "Takk", "Vann", "Hvor"],
        answer: "Hei",
      },
    },
    grammarNotes: [
      {
        title: "Ë og ç",
        tag: "Uttale",
        copy: "Ë er ofte en svak e-lyd. Ç uttales omtrent tsj. Disse to tegnene er nyttige å mestre tidlig.",
        examples: ["Përshëndetje = hei", "çfarë = hva"],
      },
      {
        title: "Jam og je",
        tag: "Å være",
        copy: "Jam betyr «jeg er», og je betyr «du er». Setningsrekkefølgen er ofte lett å kjenne igjen fra norsk.",
        examples: ["Unë jam Chris = Jeg er Chris", "Ti je nga Norvegjia = Du er fra Norge"],
      },
      {
        title: "Nuk",
        tag: "Negasjon",
        copy: "Nuk står foran verbet og gjør setningen negativ.",
        examples: ["Pi kafe = Jeg drikker kaffe", "Nuk pi kafe = Jeg drikker ikke kaffe"],
      },
    ],
  },
};

Object.entries(window.KUMO_CONTENT || {}).forEach(([language, content]) => {
  if (courses[language]) Object.assign(courses[language], content);
});

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let waitingServiceWorker = null;

function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker
    .register("./service-worker.js", { updateViaCache: "none" })
    .then((registration) => {
      const offerUpdate = (worker) => {
        if (!worker || !navigator.serviceWorker.controller) return;
        waitingServiceWorker = worker;
        $("#update-banner").classList.remove("hidden");
      };
      if (registration.waiting) offerUpdate(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed") offerUpdate(worker);
        });
      });
      return registration.update();
    })
    .catch(() => undefined);
  navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload());
}

const CountdownTimerClass =
  window.CountdownTimer ||
  class {
    constructor(element, labels) {
      this.element = element;
      this.labels = labels;
      this.intervalId = null;
    }
    setDueAt(dueAt) {
      this.stop();
      if (!dueAt) return this.hide();
      const render = () => {
        const text = window.formatRemainingTime?.(dueAt, this.labels) || "Pågår";
        this.element.textContent = text;
        this.element.classList.remove("hidden");
      };
      render();
      this.intervalId = window.setInterval(render, 60_000);
    }
    hide() {
      this.element.textContent = "";
      this.element.classList.add("hidden");
    }
    stop() {
      if (this.intervalId !== null) window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    destroy() {
      this.stop();
      this.hide();
    }
  };

const countdownLabels = { left: "igjen", overdue: "Forfalt" };
const kanaPracticeCountdown = new CountdownTimerClass($("#kana-practice-countdown"), countdownLabels);
const quizCountdown = new CountdownTimerClass($("#quiz-countdown"), countdownLabels);

let activeLanguage = "ja";
let progressStore = { ja: freshState(), tr: freshState() };
let course = courses[activeLanguage];
let state = progressStore[activeLanguage];
let currentUser = null;
let currentProfile = null;
let passwordRecoveryMode = false;
let isHydrating = false;
let persistenceTimer = null;
let persistenceChain = Promise.resolve();
let lastDifficultWordsSignature = "";
let currentWord = 0;
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswers = [];
let quizLocked = false;
let quizActive = false;
let practiceSymbol = null;
let practiceTimer = null;
let toastTimer;
let currentAudio = null;
let dailyStep = 0;
let dailySentenceAnswer = [];
let reviewOnlyDifficult = false;
let reviewTicker = null;
let activeDatabaseLesson = null;
let databaseLessonSteps = [];
let databaseLessonStep = 0;
let syncPending = false;
const captchaWidgets = {};

function validateState(value, selectedCourse) {
  return validateStateBase(value, selectedCourse, localDateKey);
}

function isDateKey(value) {
  return isDateKeyBase(value, localDateKey);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isStrongPassword(password) {
  return (
    password.length >= 10 &&
    /[A-ZÆØÅ]/.test(password) &&
    /[a-zæøå]/.test(password) &&
    /\d/.test(password)
  );
}

function setupCaptchaProtection() {
  const sitekey = String(window.KUMO_CONFIG?.turnstileSiteKey || "");
  if (!sitekey || document.querySelector('script[data-turnstile]')) return;
  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  script.async = true;
  script.defer = true;
  script.dataset.turnstile = "true";
  script.addEventListener("load", () => {
    $$("[data-captcha-slot]").forEach((slot) => {
      slot.classList.remove("hidden");
      captchaWidgets[slot.dataset.captchaSlot] = window.turnstile.render(slot, {
        sitekey,
        theme: "light",
      });
    });
  });
  document.head.append(script);
}

function captchaToken(name) {
  const widgetId = captchaWidgets[name];
  return widgetId === undefined ? undefined : window.turnstile?.getResponse(widgetId) || undefined;
}

function resetCaptcha(name) {
  const widgetId = captchaWidgets[name];
  if (widgetId !== undefined) window.turnstile?.reset(widgetId);
}

function saveState(showConfirmation = false) {
  progressStore[activeLanguage] = state;
  localStorage.setItem(progressCacheKey(activeLanguage), JSON.stringify(state));
  localStorage.setItem(`${progressCacheKey(activeLanguage)}:pending`, "1");
  updateDashboard();
  if (!currentUser || isHydrating) return false;

  if (showConfirmation) return persistState(true);
  window.clearTimeout(persistenceTimer);
  persistenceTimer = window.setTimeout(() => persistState(false), 350);
  return true;
}

async function persistState(showConfirmation = false) {
  if (!currentUser) return false;
  window.clearTimeout(persistenceTimer);
  persistenceTimer = null;

  const userId = currentUser.id;
  const language = activeLanguage;
  const selectedCourse = course;
  const snapshot = JSON.parse(JSON.stringify(state));
  const difficultSignature = JSON.stringify([...snapshot.difficultWords].sort());

  persistenceChain = persistenceChain
    .catch(() => undefined)
    .then(async () => {
      await window.KumoServices.progress.saveProgress(userId, language, snapshot);
      if (difficultSignature !== lastDifficultWordsSignature) {
        await window.KumoServices.progress.syncDifficultWords(
          userId,
          language,
          snapshot.difficultWords,
        );
        lastDifficultWordsSignature = difficultSignature;
      }
    });

  try {
    await persistenceChain;
    syncPending = false;
    localStorage.removeItem(`${progressCacheKey(language)}:pending`);
    updateSaveStatus();
    if (showConfirmation) showToast(`Progresjonen i ${selectedCourse.name} er lagret.`);
    return true;
  } catch (error) {
    syncPending = true;
    updateConnectivityUi();
    $("#save-status").textContent = "Lagret lokalt · venter på synk";
    if (navigator.onLine) showToast(error.message || "Kunne ikke synkronisere progresjonen.");
    return false;
  }
}

async function flushProgress() {
  if (!currentUser || isHydrating) return;
  if (persistenceTimer) await persistState(false);
  else await persistenceChain.catch(() => undefined);
}

function updateSaveStatus() {
  const time = new Intl.DateTimeFormat("nb-NO", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  $("#save-status").textContent = `Lagret kl. ${time}`;
  updateConnectivityUi();
}

function progressCacheKey(language) {
  return `kumo-progress:${currentUser?.id || "guest"}:${language}`;
}

function courseCacheKey(language) {
  return `kumo-course:${language}`;
}

function updateVisit() {
  const todayKey = localDateKey(new Date());
  state.lastVisit = todayKey;
  saveState();
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function markActivity(date = new Date()) {
  const key = localDateKey(date);
  if (!state.activityDates.includes(key)) state.activityDates.push(key);
  state.activityDates = state.activityDates.slice(-120);
}

function recordReview(term, correct) {
  const previous = state.reviewStats[term] || { intervalDays: 0, correct: 0, incorrect: 0, dueAt: null };
  const intervalDays = correct
    ? Math.min(30, Math.max(1, previous.intervalDays ? Math.round(previous.intervalDays * 1.8) : 1))
    : 0;
  state.reviewStats[term] = {
    intervalDays,
    correct: previous.correct + (correct ? 1 : 0),
    incorrect: previous.incorrect + (correct ? 0 : 1),
    dueAt: new Date(Date.now() + (correct ? intervalDays * 86400000 : 10 * 60000)).toISOString(),
  };
}

function dueReviewWords() {
  const now = Date.now();
  return course.words
    .filter((word) => {
      const review = state.reviewStats[word.term];
      return state.difficultWords.includes(word.term) || !review?.dueAt || new Date(review.dueAt).getTime() <= now;
    })
    .sort((a, b) => {
      const aReview = state.reviewStats[a.term];
      const bReview = state.reviewStats[b.term];
      const aPriority = (aReview?.incorrect || 0) * 10 - (aReview?.correct || 0);
      const bPriority = (bReview?.incorrect || 0) * 10 - (bReview?.correct || 0);
      return bPriority - aPriority;
    });
}

function requiredLessonKeysForLevel(levelNumber) {
  if (levelNumber === 1) return ["alphabet", "words", "quiz", "daily"];
  const databaseLevel = course.database?.levels?.find((item) => item.level_number === levelNumber);
  return databaseLevel
    ? course.database.lessons
        .filter((lesson) => lesson.level_id === databaseLevel.id)
        .map((lesson) => `lesson:${lesson.id}`)
    : [];
}

function calculateUnlockedLevel() {
  let unlocked = 1;
  const levelOneReady =
    requiredLessonKeysForLevel(1).every((key) => state.completed.includes(key)) &&
    state.bestQuizScore >= 6;
  if (!levelOneReady) return unlocked;
  unlocked = 2;
  for (let levelNumber = 2; levelNumber < 5; levelNumber += 1) {
    const requirements = requiredLessonKeysForLevel(levelNumber);
    if (!requirements.length || !requirements.every((key) => state.completed.includes(key))) break;
    unlocked = levelNumber + 1;
  }
  return unlocked;
}

function calendarDayDifference(fromKey, toKey) {
  const from = fromKey.split("-").map(Number);
  const to = toKey.split("-").map(Number);
  return Math.round((Date.UTC(to[0], to[1] - 1, to[2]) - Date.UTC(from[0], from[1] - 1, from[2])) / 86400000);
}

function ensureDueAt(sessionName, durationMinutes) {
  if (!state.dueAt[sessionName]) {
    state.dueAt[sessionName] = new Date(Date.now() + durationMinutes * 60_000).toISOString();
    saveState();
  }
  return state.dueAt[sessionName];
}

function clearDueAt(sessionName) {
  state.dueAt[sessionName] = null;
  saveState();
}

function completeLesson(name, score = 0) {
  if (!state.completed.includes(name)) {
    state.completed.push(name);
    state.xp += 20;
    markActivity();
    recordLessonCompletion(name, score);
    showToast("+20 XP · Leksjon fullført!");
  }
}

function recordLessonCompletion(activity, score = 0) {
  if (!currentUser) return;
  window.KumoServices.lesson
    .markLessonComplete(currentUser.id, activeLanguage, activity, score)
    .catch((error) => showToast(error.message));
}

function completeDatabaseLesson(lesson) {
  const completionKey = `lesson:${lesson.id}`;
  if (state.completed.includes(completionKey)) return;
  state.completed.push(completionKey);
  state.xp += 20;
  markActivity();
  window.KumoServices.lesson
    .markLessonCompleteById(currentUser.id, lesson.id, 100)
    .catch((error) => showToast(error.message));
  saveState();
  showToast("+20 XP · Leksjon fullført!");
}

function updateDashboard() {
  const level = calculateUnlockedLevel();
  state.unlockedLevel = level;
  const accuracy = state.answers ? `${Math.round((state.correct / state.answers) * 100)} %` : "–";
  $("#level-number").textContent = level;
  $("#xp-label").textContent = `${state.xp} XP`;
  const levelRequirements = requiredLessonKeysForLevel(level);
  const completedRequirements = levelRequirements.filter((key) => state.completed.includes(key)).length;
  $("#level-progress").style.width = `${
    levelRequirements.length ? (completedRequirements / levelRequirements.length) * 100 : 100
  }%`;
  const streakText = `${state.streak} ${state.streak === 1 ? "dag" : "dager"}`;
  $("#sidebar-streak").textContent = streakText;
  $("#streak-stat").textContent = streakText;
  $("#learned-count").textContent = state.learnedSymbols.length;
  $("#symbol-total").textContent = course.symbols.length;
  $("#accuracy-stat").textContent = accuracy;
  $("#completed-lessons").textContent = state.completed.length;
  $("#kana-mastered-label").textContent = `${state.learnedSymbols.length} av ${course.symbols.length} mestret`;
  $("#kana-progress").style.width = `${(state.learnedSymbols.length / course.symbols.length) * 100}%`;
  $("#difficult-word-count").textContent = state.difficultWords.length;
  $("#next-review-label").textContent =
    window.formatRemainingTime?.(state.dueAt.review, { left: "igjen", overdue: "Klar nå" }) || "Klar nå";
  renderProgress();
  updateConnectivityUi();
}

function applyCourseUi() {
  document.documentElement.lang = "no";
  document.body.dataset.course = activeLanguage;
  document.title = `Kumo – lær ${course.name}`;
  $("#language-select").value = activeLanguage;
  $("#mobile-language-select").value = activeLanguage;
  $("#settings-language-select").value = activeLanguage;
  $("#display-mode-select").value = state.displayMode;
  $("#weekly-goal-select").value = String(state.weeklyGoal);
  $("#reduced-motion-toggle").checked = state.reducedMotion;
  document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
  $("#display-mode-setting").classList.toggle("hidden", activeLanguage !== "ja");
  $("#brand-language").textContent = `lær ${course.name}`;
  $$(".brand-mark").forEach((mark) => (mark.textContent = course.brandMark));
  $("#alphabet-nav-icon").textContent = course.navIcon;
  $("#alphabet-nav-label").textContent = course.navLabel;
  $("#streak-icon").textContent = course.streakIcon;
  $("#streak-stat-icon").textContent = course.streakIcon;
  $("#learned-stat-icon").textContent = course.learnedIcon;
  $("#accuracy-stat-icon").textContent = course.accuracyIcon;
  $("#learned-stat-label").textContent = course.learnedLabel;
  $("#hero-eyebrow").textContent = course.heroEyebrow;
  $("#hero-question").textContent = course.heroQuestion;
  $("#hero-description").textContent = course.heroDescription;
  $("#alphabet-eyebrow").textContent = course.alphabetEyebrow;
  $("#alphabet-title").textContent = course.alphabetTitle;
  $("#alphabet-description").textContent = course.alphabetDescription;
  $("#practice-question").textContent = course.practiceQuestion;
  $("#words-eyebrow").textContent = course.wordsEyebrow;
  $("#word-language-label").textContent = course.name[0].toUpperCase() + course.name.slice(1);
  $("#quiz-eyebrow").textContent = course.quizEyebrow;
  $("#result-mark").textContent = course.resultMark;
  $("#lesson-one-symbol").textContent = course.lessonOne.symbol;
  $("#lesson-one-meta").textContent = course.lessonOne.meta;
  $("#lesson-one-title").textContent = course.lessonOne.title;
  $("#lesson-one-description").textContent = course.lessonOne.description;
  $("#lesson-two-symbol").textContent = course.lessonTwo.symbol;
  $("#lesson-two-title").textContent = course.lessonTwo.title;
  $("#lesson-two-description").textContent = course.lessonTwo.description;
  $("#lesson-three-symbol").textContent = course.lessonThreeSymbol;
  $(".hero-art").classList.toggle("turkish", activeLanguage === "tr");
  $("#daily-intro").textContent = `${course.dailyLesson.title}. Nye ord, norsk forklaring, lytting og korte oppgaver.`;
  setGreeting();
  renderGrammar();
  renderDailyLesson();
}

function setDateLabel() {
  const label = new Intl.DateTimeFormat("nb-NO", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  $("#today-label").textContent = label.charAt(0).toUpperCase() + label.slice(1);
}

function setGreeting() {
  const hour = new Date().getHours();
  $("#hero-greeting").textContent = course.greetings[hour < 10 ? 0 : hour < 18 ? 1 : 2];
}

async function loadCourseAndProgress(language) {
  if (!currentUser) throw new Error("Innloggingen har utløpt. Logg inn på nytt.");
  isHydrating = true;
  try {
    let bundle;
    let restoredState;
    try {
      const [remoteBundle, progressRow] = await Promise.all([
        window.KumoServices.course.fetchCourseBundle(language),
        window.KumoServices.progress.getOrCreateProgress(currentUser.id, language),
      ]);
      bundle = remoteBundle;
      restoredState = window.KumoServices.progress.stateFromRow(progressRow);
      localStorage.setItem(courseCacheKey(language), JSON.stringify(bundle));
      const cachedProgress = localStorage.getItem(progressCacheKey(language));
      const hasPendingLocalProgress =
        localStorage.getItem(`${progressCacheKey(language)}:pending`) === "1" && cachedProgress;
      if (hasPendingLocalProgress) {
        restoredState = JSON.parse(cachedProgress);
        syncPending = true;
      } else {
        localStorage.setItem(progressCacheKey(language), JSON.stringify(restoredState));
      }
    } catch (error) {
      const cachedBundle = localStorage.getItem(courseCacheKey(language));
      const cachedProgress = localStorage.getItem(progressCacheKey(language));
      if (!cachedBundle || !cachedProgress) throw error;
      bundle = JSON.parse(cachedBundle);
      restoredState = JSON.parse(cachedProgress);
      syncPending = true;
    }
    courses[language].database = bundle;
    progressStore[language] = validateState(restoredState, courses[language]);
    state = progressStore[language];
    lastDifficultWordsSignature = JSON.stringify([...state.difficultWords].sort());
  } finally {
    isHydrating = false;
  }
}

function updateAccountUi() {
  const displayName =
    currentProfile?.display_name || currentUser?.user_metadata?.display_name || currentUser?.email?.split("@")[0] || "Elev";
  const email = currentUser?.email || "";
  $("#account-name").textContent = displayName;
  $("#account-email").textContent = email;
  $("#settings-account-name").textContent = displayName;
  $("#settings-account-email").textContent = email;
}

function showLoading(message = "Laster kontoen din …") {
  $("#app-loading-message").textContent = message;
  $("#app-loading").classList.remove("hidden");
  $("#auth-page").classList.add("hidden");
  $("#app-shell").classList.add("hidden");
  $("#language-gate").classList.add("hidden");
}

function showAuthPage(message = "", success = false) {
  currentUser = null;
  currentProfile = null;
  $("#app-loading").classList.add("hidden");
  $("#app-shell").classList.add("hidden");
  $("#language-gate").classList.add("hidden");
  $("#auth-page").classList.remove("hidden");
  $("#auth-message").textContent = message;
  $("#auth-message").classList.toggle("success", success);
}

async function hydrateAuthenticatedApp(session) {
  if (!session?.user) return showAuthPage();
  showLoading("Laster profil og progresjon …");
  currentUser = session.user;

  try {
    currentProfile = await window.KumoServices.profile.getOrCreateProfile(currentUser);
    activeLanguage =
      { japanese: "ja", turkish: "tr", albanian: "sq" }[currentProfile.selected_language] || "ja";
    course = courses[activeLanguage];
    await loadCourseAndProgress(activeLanguage);
    currentWord = 0;
    reviewOnlyDifficult = false;
    dailyStep = 0;
    applyCourseUi();
    renderSymbols();
    renderWords();
    renderDailyLesson();
    renderGrammar();
    updateAccountUi();
    updateVisit();
    showView("home");
    $("#app-loading").classList.add("hidden");
    $("#auth-page").classList.add("hidden");
    $("#app-shell").classList.remove("hidden");
    if (!currentProfile.selected_language) $("#language-gate").classList.remove("hidden");
  } catch (error) {
    showAuthPage(error.message || "Kunne ikke laste kontoen.");
  }
}

function setAuthMode(mode) {
  const login = mode === "login";
  const signup = mode === "signup";
  const forgot = mode === "forgot";
  const recovery = mode === "recovery";
  $("#login-form").classList.toggle("hidden", !login);
  $("#signup-form").classList.toggle("hidden", !signup);
  $("#forgot-password-form").classList.toggle("hidden", !forgot);
  $("#update-password-form").classList.toggle("hidden", !recovery);
  $(".auth-tabs").classList.toggle("hidden", forgot || recovery);
  $("#show-login").classList.toggle("active", login);
  $("#show-signup").classList.toggle("active", signup);
  $("#show-login").setAttribute("aria-selected", String(login));
  $("#show-signup").setAttribute("aria-selected", String(signup));
  $("#auth-message").textContent = "";
  $("#auth-message").classList.remove("success");
}

async function bootstrapAuthentication() {
  setDateLabel();
  setupCaptchaProtection();
  if (!window.KumoSupabase.isConfigured()) {
    showAuthPage("Supabase må konfigureres før Kumo kan brukes.");
    $("#configuration-help").classList.remove("hidden");
    return;
  }

  $("#configuration-help").classList.add("hidden");
  window.KumoServices.auth.onAuthStateChange((event, session) => {
    window.setTimeout(() => {
      if (event === "SIGNED_OUT") showAuthPage("Du er logget ut.", true);
      if (event === "PASSWORD_RECOVERY") {
        passwordRecoveryMode = true;
        showAuthPage();
        setAuthMode("recovery");
      }
      if (event === "SIGNED_IN" && session && !passwordRecoveryMode) hydrateAuthenticatedApp(session);
    }, 0);
  });

  try {
    const session = await window.KumoServices.auth.getSession();
    if (session) await hydrateAuthenticatedApp(session);
    else showAuthPage();
  } catch {
    showAuthPage("Innloggingen kunne ikke kontrolleres. Prøv å laste siden på nytt.");
  }
}

async function switchLanguage(language) {
  if (!courses[language]) return false;
  if (language === activeLanguage) {
    if (currentUser && !currentProfile?.selected_language) {
      const databaseLanguage = window.KumoServices.course.getCourseIdentity(language).databaseLanguage;
      currentProfile = await window.KumoServices.profile.updateSelectedLanguage(currentUser.id, databaseLanguage);
    }
    $("#language-gate").classList.add("hidden");
    return true;
  }
  const previousLanguage = activeLanguage;
  const previousCourse = course;
  const previousState = state;
  closeAlphabetPractice();
  quizCountdown.setDueAt(null);
  quizActive = false;
  await flushProgress();
  activeLanguage = language;
  course = courses[activeLanguage];
  try {
    await loadCourseAndProgress(activeLanguage);
    if (currentUser) {
      const databaseLanguage = window.KumoServices.course.getCourseIdentity(activeLanguage).databaseLanguage;
      currentProfile = await window.KumoServices.profile.updateSelectedLanguage(
        currentUser.id,
        databaseLanguage,
      );
    }
  } catch (error) {
    activeLanguage = previousLanguage;
    course = previousCourse;
    state = previousState;
    showToast(error.message);
    return false;
  }
  currentWord = 0;
  reviewOnlyDifficult = false;
  dailyStep = 0;
  applyCourseUi();
  renderSymbols();
  renderWords();
  updateVisit();
  showView("home");
  showToast(`${course.nativeName} er valgt. Progresjonen er separat.`);
  return true;
}

const navigation = window.KumoNavigation.createNavigation({
  $,
  $$,
  state,
  closeAlphabetPractice,
  startQuiz,
  renderDailyLesson,
  renderGrammar,
  renderProgress,
  renderDatabaseLesson,
  getActiveDatabaseLesson: () => activeDatabaseLesson,
  getQuizActive: () => quizActive,
  getReducedMotion: () => state.reducedMotion,
});
const showView = navigation.showView;

function openDatabaseLesson(lessonId) {
  const lesson = course.database?.lessons?.find((item) => item.id === lessonId);
  if (!lesson) return showToast("Leksjonen kunne ikke åpnes.");
  const databaseLevel = course.database.levels.find((item) => item.id === lesson.level_id);
  const unlockedLevel = calculateUnlockedLevel();
  if (databaseLevel?.level_number > unlockedLevel) {
    return showToast("Fullfør mer av kurset for å låse opp dette nivået.");
  }

  activeDatabaseLesson = lesson;
  databaseLessonStep = 0;
  databaseLessonSteps = [
    ...(course.database.vocabulary || [])
      .filter((item) => item.lesson_id === lesson.id)
      .map((item) => ({ kind: "vocabulary", item })),
    ...(course.database.grammarNotes || [])
      .filter((item) => item.lesson_id === lesson.id)
      .map((item) => ({ kind: "grammar", item })),
    ...(course.database.exercises || [])
      .filter((item) => item.lesson_id === lesson.id)
      .map((item) => ({ kind: "exercise", item })),
  ];
  if (!databaseLessonSteps.length) databaseLessonSteps.push({ kind: "introduction", item: lesson });
  showView("course-lesson");
}

function renderDatabaseLesson() {
  const lesson = activeDatabaseLesson;
  const step = databaseLessonSteps[databaseLessonStep];
  if (!lesson || !step) return;

  $("#course-lesson-title").textContent = lesson.title;
  $("#course-lesson-description").textContent = lesson.description || "";
  $("#course-lesson-step").textContent = `Steg ${databaseLessonStep + 1} av ${databaseLessonSteps.length}`;
  $("#course-lesson-time").textContent = `ca. ${lesson.estimated_minutes} minutter`;
  $("#course-lesson-progress").style.width = `${((databaseLessonStep + 1) / databaseLessonSteps.length) * 100}%`;
  $("#course-lesson-previous").disabled = databaseLessonStep === 0;
  $("#course-lesson-next").textContent =
    databaseLessonStep === databaseLessonSteps.length - 1 ? "Fullfør leksjonen ✓" : "Neste →";

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
    activeLanguage === "ja" && state.displayMode === "kana"
      ? word.kana || word.target
      : word.kanji || word.target;
  const reading = activeLanguage === "ja" ? word.romaji || word.kana : word.pronunciation_note;
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

function renderSymbols() {
  $("#kana-grid").innerHTML = course.symbols
    .map(
      (item) => `
        <button class="kana-card ${state.learnedSymbols.includes(item.char) ? "mastered" : ""}" data-symbol="${item.char}">
          <span class="kana-character">${item.char}</span>
          <span class="kana-romaji">${item.reading}</span>
          <span class="kana-tip">${item.tip}</span>
        </button>`,
    )
    .join("");
  $$(".kana-card").forEach((card) => {
    card.addEventListener("click", () => {
      const item = course.symbols.find((entry) => entry.char === card.dataset.symbol);
      speak(item.char, item.audio);
      toggleSymbol(item.char);
    });
  });
}

function toggleSymbol(char) {
  if (state.learnedSymbols.includes(char)) {
    state.learnedSymbols = state.learnedSymbols.filter((item) => item !== char);
  } else {
    state.learnedSymbols.push(char);
    if (!state.rewardedSymbols.includes(char)) {
      state.rewardedSymbols.push(char);
      state.xp += 5;
      showToast("+5 XP · Ny bokstav eller nytt tegn mestret");
    }
  }
  if (state.learnedSymbols.length >= Math.min(5, course.symbols.length)) completeLesson("alphabet");
  saveState();
  renderSymbols();
}

function openAlphabetPractice() {
  clearTimeout(practiceTimer);
  practiceTimer = null;
  kanaPracticeCountdown.setDueAt(ensureDueAt("alphabetPractice", 5));
  practiceSymbol = course.symbols[Math.floor(Math.random() * course.symbols.length)];
  const alternatives = shuffle([
    practiceSymbol.reading,
    ...shuffle(course.symbols.filter((item) => item.char !== practiceSymbol.char))
      .map((item) => item.reading)
      .filter((reading, index, all) => reading !== practiceSymbol.reading && all.indexOf(reading) === index)
      .slice(0, 3),
  ]);
  $("#practice-symbol").textContent = practiceSymbol.char;
  $("#kana-feedback").textContent = "";
  $("#kana-options").innerHTML = alternatives
    .map((option) => `<button class="option-button" data-option="${option}">${option}</button>`)
    .join("");
  $("#kana-practice").classList.remove("hidden");
  $$("#kana-options .option-button").forEach((button) => button.addEventListener("click", () => checkAlphabetPractice(button)));
}

function checkAlphabetPractice(button) {
  const correct = button.dataset.option === practiceSymbol.reading;
  $$("#kana-options .option-button").forEach((item) => {
    item.disabled = true;
    if (item.dataset.option === practiceSymbol.reading) item.classList.add("correct");
  });
  if (!correct) button.classList.add("wrong");
  state.answers += 1;
  if (correct) {
    state.correct += 1;
    state.xp += 5;
    $("#kana-feedback").textContent = "Riktig! Flott jobbet.";
  } else {
    $("#kana-feedback").textContent = `Nesten – riktig svar er «${practiceSymbol.reading}».`;
  }
  saveState();
  practiceTimer = setTimeout(openAlphabetPractice, 1200);
}

function closeAlphabetPractice() {
  clearTimeout(practiceTimer);
  practiceTimer = null;
  kanaPracticeCountdown.setDueAt(null);
  if (state?.dueAt?.alphabetPractice) clearDueAt("alphabetPractice");
  $("#kana-practice").classList.add("hidden");
}

function renderWords() {
  const deck = getWordDeck();
  if (!deck.length) {
    reviewOnlyDifficult = false;
    return renderWords();
  }
  currentWord = Math.min(currentWord, deck.length - 1);
  const word = deck[currentWord];
  $("#word-index").textContent = currentWord + 1;
  $("#word-total").textContent = deck.length;
  $("#word-japanese").textContent = displayWordTerm(word);
  $("#word-romaji").textContent = displayWordReading(word);
  $("#word-norwegian").textContent = word.norwegian;
  $("#word-note").textContent = word.note;
  $("#flashcard").classList.remove("flipped");
  $("#phrase-list").innerHTML = deck
    .map(
      (item, index) => `
        <button class="phrase-row ${index === currentWord ? "active" : ""}" data-word-index="${index}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <span><strong>${item.term}</strong><small>${item.norwegian}</small></span>
          <i class="known-dot ${state.knownWords.includes(item.term) ? "known" : ""}"></i>
        </button>`,
    )
    .join("");
  $$(".phrase-row").forEach((row) =>
    row.addEventListener("click", () => {
      currentWord = Number(row.dataset.wordIndex);
      renderWords();
    }),
  );
}

function changeWord(direction) {
  const deck = getWordDeck();
  currentWord = (currentWord + direction + deck.length) % deck.length;
  renderWords();
}

function markWord(status) {
  const word = getWordDeck()[currentWord];
  if (status === "known" && !state.knownWords.includes(word.term)) {
    state.knownWords.push(word.term);
    state.difficultWords = state.difficultWords.filter((item) => item !== word.term);
    state.xp += 10;
    recordReview(word.term, true);
    markActivity();
    showToast("+10 XP · Uttrykket er lagret som kjent");
  }
  if (status === "learning") {
    state.knownWords = state.knownWords.filter((item) => item !== word.term);
    if (!state.difficultWords.includes(word.term)) state.difficultWords.push(word.term);
    scheduleReview();
    recordReview(word.term, false);
    showToast("Lagt til i vanskelige ord");
  }
  if (state.knownWords.length >= 4) completeLesson("words");
  saveState();
  changeWord(1);
}

function getWordDeck() {
  if (!reviewOnlyDifficult) return course.words;
  return dueReviewWords();
}

function displayWordTerm(word) {
  if (activeLanguage !== "ja") return word.term;
  return state.displayMode === "romaji" ? word.reading : word.term;
}

function displayWordReading(word) {
  if (activeLanguage !== "ja") return word.reading;
  return state.displayMode === "kana" ? "kana" : state.displayMode === "romaji" ? "romaji" : word.reading;
}

function scheduleReview(hours = 24) {
  state.dueAt.review = new Date(Date.now() + hours * 60 * 60_000).toISOString();
}

function renderDailyLesson() {
  const lesson = course.dailyLesson;
  const steps = [
    () => renderReviewExercise(),
    () => renderNewWordsExercise(lesson.newWords),
    () => renderGrammarExercise(lesson.grammar),
    () => renderListenRepeatExercise(lesson.examples),
    () => renderSentenceBuilderExercise(lesson.sentence),
    () => renderMultipleChoiceExercise(lesson.quiz),
  ];
  dailyStep = Math.max(0, Math.min(dailyStep, steps.length - 1));
  $("#daily-step-label").textContent = `Steg ${dailyStep + 1} av ${steps.length}`;
  $("#daily-time-label").textContent = `ca. ${lesson.minutes} minutter totalt`;
  $("#daily-progress").style.width = `${((dailyStep + 1) / steps.length) * 100}%`;
  $("#daily-previous").disabled = dailyStep === 0;
  $("#daily-next").textContent = dailyStep === steps.length - 1 ? "Fullfør økten ✓" : "Neste →";
  steps[dailyStep]();
}

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

function renderGrammar() {
  const grammarNotes = Array.isArray(course.grammarNotes) ? course.grammarNotes : [];
  const writingSections = Array.isArray(course.writingSections) ? course.writingSections : [];
  const practicalPhrases = Array.isArray(course.practicalPhrases) ? course.practicalPhrases : [];
  if (!grammarNotes.length && !writingSections.length && !practicalPhrases.length) {
    $("#grammar-grid").innerHTML = "";
    return;
  }
  $("#grammar-grid").innerHTML = `
    ${grammarNotes
      .map(
        (note) => `
          <article class="grammar-note">
            <span>${note.tag}</span>
            <h2>${note.title}</h2>
            <p>${note.copy}</p>
            <div>${(Array.isArray(note?.examples) ? note.examples : []).map((example) => `<code>${example}</code>`).join("")}</div>
          </article>`,
      )
      .join("")}
    <article class="grammar-note course-roadmap">
      <span>Kursinnhold</span>
      <h2>Videre i skrift og uttale</h2>
      ${writingSections
        .map(
          (section) => `
            <div class="roadmap-row">
              <strong>${section.title}</strong>
              <small>${section.copy}</small>
              <i>${section.status}</i>
            </div>`,
        )
        .join("")}
      <div class="practical-phrases">
        <strong>Praktiske fraser</strong>
        ${practicalPhrases
          .map(
            (phrase) => `
              <button data-practical-phrase="${phrase.target}">
                <span>${phrase.norwegian}</span>
                <b>${phrase.target}</b>
                <small>${phrase.reading}</small>
                <i>♪</i>
              </button>`,
          )
          .join("")}
      </div>
    </article>`;
  $$("[data-practical-phrase]").forEach((button) =>
    button.addEventListener("click", () => speak(button.dataset.practicalPhrase)),
  );
}

function renderProgress() {
  if (!course.levels || !$("#progress-overview")) return;
  const level = calculateUnlockedLevel();
  state.unlockedLevel = level;
  const totalActivities =
    4 + (course.database?.lessons?.filter((lesson) => lesson.lesson_number > 4).length || 0);
  const progressPercent = Math.min(100, Math.round((state.completed.length / totalActivities) * 100));
  $("#progress-overview").innerHTML = `
    <article><small>Nivå</small><strong>${level}</strong><span>${course.levels[level - 1].title}</span></article>
    <article><small>Total XP</small><strong>${state.xp}</strong><span>${progressPercent} % av startaktivitetene</span></article>
    <article><small>Dagens økter</small><strong>${state.dailyCompletions}</strong><span>${state.streak} dagers rekke</span></article>
    <article><small>Vanskelige ord</small><strong>${state.difficultWords.length}</strong><span>Klare for repetisjon</span></article>`;
  renderWeeklyProgress();
  $("#level-list").innerHTML = course.levels
    .map(
      (item, index) => `
        <article class="level-row ${index + 1 === level ? "current" : ""} ${index + 1 < level ? "complete" : ""}">
          <span>${index + 1}</span>
          <div><strong>${item.title}</strong><small>${item.topics.join(" · ")}</small></div>
          <i>${index + 1 < level ? "Fullført" : index + 1 === level ? "Åpent" : "Låst"}</i>
        </article>`,
    )
    .join("");
  $$("#level-list .level-row").forEach((row, index) => {
    const databaseLevel = course.database?.levels?.find((entry) => entry.level_number === index + 1);
    const lessons = databaseLevel
      ? course.database.lessons.filter((lesson) => lesson.level_id === databaseLevel.id)
      : [];
    if (!lessons.length) return;
    const catalog = document.createElement("div");
    catalog.className = "level-lessons";
    catalog.innerHTML = lessons
      .filter((lesson) => lesson.lesson_number > 4)
      .map((lesson) => {
        const completed = state.completed.includes(`lesson:${lesson.id}`);
        const locked = index + 1 > level;
        return `<button data-database-lesson-id="${escapeHtml(lesson.id)}" ${locked ? "disabled" : ""}>
          ${completed ? "✓ " : ""}${escapeHtml(lesson.title)}
        </button>`;
      })
      .join("");
    if (!catalog.children.length) return;
    row.querySelector("div").append(catalog);
  });
  $$("[data-database-lesson-id]").forEach((button) =>
    button.addEventListener("click", () => openDatabaseLesson(button.dataset.databaseLessonId)),
  );
}

function startOfCurrentWeek() {
  const date = new Date();
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function renderWeeklyProgress() {
  if (!$("#week-calendar")) return;
  const start = startOfCurrentWeek();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
  const activeThisWeek = days.filter((date) => state.activityDates.includes(localDateKey(date))).length;
  $("#weekly-goal-copy").textContent =
    activeThisWeek >= state.weeklyGoal
      ? `Målet er nådd: ${activeThisWeek} aktive dager.`
      : `${activeThisWeek} av ${state.weeklyGoal} aktive dager.`;
  $("#week-calendar").innerHTML = days
    .map((date) => {
      const key = localDateKey(date);
      const active = state.activityDates.includes(key);
      const today = key === localDateKey(new Date());
      const label = new Intl.DateTimeFormat("nb-NO", { weekday: "short" }).format(date);
      return `<div class="week-day ${active ? "active" : ""} ${today ? "today" : ""}">
        <span>${escapeHtml(label)}</span><strong>${date.getDate()}</strong>
      </div>`;
    })
    .join("");
}

function startQuiz() {
  quizQuestions = shuffle([...course.quiz]);
  quizIndex = 0;
  quizScore = 0;
  quizAnswers = [];
  quizLocked = false;
  quizActive = true;
  quizCountdown.setDueAt(ensureDueAt("quiz", 8));
  $("#quiz-result").classList.add("hidden");
  $("#quiz-question-area").classList.remove("hidden");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = quizQuestions[quizIndex];
  quizLocked = false;
  $("#quiz-progress-label").textContent = `Spørsmål ${quizIndex + 1} av ${quizQuestions.length}`;
  $("#quiz-score-label").textContent = `${quizScore} riktige`;
  $("#quiz-progress").style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
  $("#quiz-type").textContent = question.type;
  $("#quiz-question").textContent = question.question;
  $("#quiz-prompt").textContent = question.prompt;
  $("#quiz-feedback").textContent = "";
  $("#quiz-options").innerHTML = question.options
    .map((option) => `<button class="option-button" data-option="${option}">${option}</button>`)
    .join("");
  $$("#quiz-options .option-button").forEach((button) => button.addEventListener("click", () => answerQuiz(button)));
}

function answerQuiz(button) {
  if (quizLocked) return;
  quizLocked = true;
  const question = quizQuestions[quizIndex];
  const correct = button.dataset.option === question.answer;
  quizAnswers.push({
    question: question.question,
    prompt: question.prompt,
    selected: button.dataset.option,
    correctAnswer: question.answer,
    correct,
  });
  state.answers += 1;
  $$("#quiz-options .option-button").forEach((item) => {
    item.disabled = true;
    if (item.dataset.option === question.answer) item.classList.add("correct");
  });
  if (correct) {
    quizScore += 1;
    state.correct += 1;
    $("#quiz-feedback").textContent = activeLanguage === "ja" ? "正解！ Riktig!" : "Doğru! Riktig!";
  } else {
    button.classList.add("wrong");
    $("#quiz-feedback").textContent = `Riktig svar: ${question.answer}`;
  }
  const matchingWord = course.words.find(
    (word) =>
      question.prompt.includes(word.term) ||
      question.answer === word.norwegian ||
      question.answer === word.term,
  );
  if (matchingWord) recordReview(matchingWord.term, correct);
  saveState();
  setTimeout(() => {
    quizIndex += 1;
    if (quizIndex < quizQuestions.length) renderQuizQuestion();
    else finishQuiz();
  }, 1000);
}

function finishQuiz() {
  quizActive = false;
  quizCountdown.setDueAt(null);
  if (state.dueAt.quiz) clearDueAt("quiz");
  const earned = quizScore * 5;
  state.xp += earned;
  state.bestQuizScore = Math.max(state.bestQuizScore, quizScore);
  markActivity();
  if (quizScore >= 6) completeLesson("quiz", quizScore);
  saveState();
  if (currentUser) {
    window.KumoServices.lesson
      .saveQuizResult(currentUser.id, activeLanguage, quizScore, quizQuestions.length, quizAnswers)
      .catch((error) => showToast(error.message));
  }
  $("#quiz-question-area").classList.add("hidden");
  $("#quiz-result").classList.remove("hidden");
  $("#quiz-progress").style.width = "100%";
  $("#quiz-progress-label").textContent = "Fullført";
  $("#quiz-score-label").textContent = `${quizScore} riktige`;
  $("#result-score").textContent = `${quizScore} / ${quizQuestions.length}`;
  $("#result-copy").textContent =
    quizScore >= 7
      ? "Strålende! Dette begynner virkelig å sitte."
      : quizScore >= 5
        ? "God økt. Litt repetisjon, så sitter resten også."
        : "En fin start. Gå gjerne gjennom bokstavene og uttrykkene én gang til.";
  showToast(`+${earned} XP · Quiz fullført`);
}

function speak(text, audioBase) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (!audioBase) return speakWithBrowserVoice(text);
  currentAudio = new Audio(`audio/${audioBase}.wav`);
  currentAudio.volume = 1;
  currentAudio
    .play()
    .then(() => showToast(`Spiller ${course.name} uttale…`))
    .catch(() => playMp3Fallback(text, audioBase));
}

function playMp3Fallback(text, audioBase) {
  currentAudio = new Audio(`audio/${audioBase}.mp3`);
  currentAudio
    .play()
    .then(() => showToast(`Spiller ${course.name} uttale…`))
    .catch(() => speakWithBrowserVoice(text));
}

function speakWithBrowserVoice(text) {
  if (!("speechSynthesis" in window)) return showToast("Kunne ikke spille av lyden.");
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = course.speechLang;
  utterance.rate = course.speechRate;
  const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(course.code));
  if (voice) utterance.voice = voice;
  utterance.onerror = () => showToast("Kunne ikke spille av lyden.");
  speechSynthesis.speak(utterance);
}

function normalizeSpeech(value) {
  return String(value || "")
    .toLocaleLowerCase(activeLanguage === "tr" ? "tr-TR" : "ja-JP")
    .normalize("NFKC")
    .replace(/[.,!?。、\s]/g, "");
}

function practicePronunciation() {
  const word = getWordDeck()[currentWord];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("#pronunciation-feedback").textContent =
      "Nettleseren støtter ikke talegjenkjenning. Lytt, gjenta og merk selv om uttrykket satt.";
    speak(word.term, word.audio);
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = course.speechLang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  $("#practice-pronunciation").disabled = true;
  $("#pronunciation-feedback").textContent = "Lytter … si uttrykket nå.";
  recognition.onresult = (event) => {
    const alternatives = [...event.results[0]].map((result) => result.transcript);
    const expected = normalizeSpeech(word.term);
    const correct = alternatives.some((transcript) => {
      const heard = normalizeSpeech(transcript);
      return heard === expected || heard.includes(expected) || expected.includes(heard);
    });
    recordReview(word.term, correct);
    state.answers += 1;
    if (correct) {
      state.correct += 1;
      state.xp += 5;
      markActivity();
    }
    saveState();
    $("#pronunciation-feedback").textContent = correct
      ? `Godkjent uttale: «${alternatives[0]}». +5 XP`
      : `Jeg hørte «${alternatives[0]}». Lytt og prøv én gang til.`;
  };
  recognition.onerror = () => {
    $("#pronunciation-feedback").textContent =
      "Mikrofonen eller talegjenkjenningen var ikke tilgjengelig. Du kan fortsatt lytte og gjenta.";
  };
  recognition.onend = () => {
    $("#practice-pronunciation").disabled = false;
  };
  recognition.start();
}

function updateConnectivityUi() {
  const offline = !navigator.onLine;
  $("#connection-banner").classList.toggle("hidden", !offline);
  $("#sync-status-pill").textContent = offline || syncPending ? "Venter på synk" : "Synkronisert";
  $("#sync-status-pill").classList.toggle("pending", offline || syncPending);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function shuffle(items) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

async function resetProgress() {
  if (!window.confirm(`Vil du nullstille progresjonen i ${course.name}? Den andre språkløypen beholdes.`)) return;
  try {
    const row = await window.KumoServices.progress.resetCourseProgress(currentUser.id, activeLanguage);
    state = validateState(window.KumoServices.progress.stateFromRow(row), course);
    lastDifficultWordsSignature = "[]";
  } catch (error) {
    showToast(error.message);
    return;
  }
  progressStore[activeLanguage] = state;
  quizActive = false;
  quizCountdown.setDueAt(null);
  closeAlphabetPractice();
  updateVisit();
  renderSymbols();
  renderWords();
  renderDailyLesson();
  renderGrammar();
  renderProgress();
  showToast(`Progresjonen i ${course.name} er nullstilt.`);
}

$$("button:not([type])").forEach((button) => (button.type = "button"));
window.KumoNavigation.bindNavigationEvents({ $, $, showView });
$("#language-select").addEventListener("change", (event) => switchLanguage(event.target.value));
$("#mobile-language-select").addEventListener("change", (event) => switchLanguage(event.target.value));
$("#practice-kana").addEventListener("click", openAlphabetPractice);
$("#close-kana-practice").addEventListener("click", closeAlphabetPractice);
$("#flashcard").addEventListener("click", () => $("#flashcard").classList.toggle("flipped"));
$("#previous-word").addEventListener("click", () => changeWord(-1));
$("#next-word").addEventListener("click", () => changeWord(1));
$("#speak-word").addEventListener("click", () => {
  const word = getWordDeck()[currentWord];
  speak(word.term, word.audio);
});
$("#practice-pronunciation").addEventListener("click", practicePronunciation);
$$("[data-knowledge]").forEach((button) => button.addEventListener("click", () => markWord(button.dataset.knowledge)));
$("#restart-quiz").addEventListener("click", startQuiz);
$("#save-progress").addEventListener("click", () => saveState(true));
$("#reset-progress").addEventListener("click", resetProgress);
$("#daily-previous").addEventListener("click", () => {
  dailyStep = Math.max(0, dailyStep - 1);
  renderDailyLesson();
});
$("#daily-next").addEventListener("click", () => {
  if (dailyStep >= 5) return finishDailyLesson();
  dailyStep += 1;
  renderDailyLesson();
});
$("#course-lesson-previous").addEventListener("click", () => {
  databaseLessonStep = Math.max(0, databaseLessonStep - 1);
  renderDatabaseLesson();
});
$("#course-lesson-next").addEventListener("click", () => {
  if (databaseLessonStep >= databaseLessonSteps.length - 1) {
    completeDatabaseLesson(activeDatabaseLesson);
    renderProgress();
    return showView("progress");
  }
  databaseLessonStep += 1;
  renderDatabaseLesson();
});
$("#review-difficult").addEventListener("click", () => {
  if (!state.difficultWords.length) return showToast("Merk et ord som vanskelig først.");
  reviewOnlyDifficult = true;
  currentWord = 0;
  renderWords();
  showToast("Viser bare vanskelige ord.");
});
$("#settings-language-select").addEventListener("change", (event) => switchLanguage(event.target.value));
$("#display-mode-select").addEventListener("change", (event) => {
  state.displayMode = event.target.value;
  saveState();
  renderWords();
  renderDailyLesson();
  showToast("Japansk visning er oppdatert.");
});
$("#weekly-goal-select").addEventListener("change", (event) => {
  state.weeklyGoal = Number(event.target.value);
  saveState();
  renderWeeklyProgress();
});
$("#reduced-motion-toggle").addEventListener("change", (event) => {
  state.reducedMotion = event.target.checked;
  document.documentElement.classList.toggle("reduce-motion", state.reducedMotion);
  saveState();
});
$("#apply-update").addEventListener("click", () => {
  waitingServiceWorker?.postMessage({ type: "SKIP_WAITING" });
});
$("#dismiss-update").addEventListener("click", () => $("#update-banner").classList.add("hidden"));
$("#choose-language-again").addEventListener("click", () => $("#language-gate").classList.remove("hidden"));
$$("[data-language-choice]").forEach((button) =>
  button.addEventListener("click", async () => {
    const changed = await switchLanguage(button.dataset.languageChoice);
    if (changed) $("#language-gate").classList.add("hidden");
  }),
);
$("#show-login").addEventListener("click", () => setAuthMode("login"));
$("#show-signup").addEventListener("click", () => setAuthMode("signup"));
$("#show-forgot-password").addEventListener("click", () => {
  $("#forgot-email").value = $("#login-email").value.trim();
  setAuthMode("forgot");
});
$("#back-to-login").addEventListener("click", () => setAuthMode("login"));
$("#forgot-password-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");
  button.disabled = true;
  $("#auth-message").textContent = "Sender tilbakestillingslenke …";
  $("#auth-message").classList.remove("success");
  try {
    await window.KumoServices.auth.sendPasswordReset(
      $("#forgot-email").value.trim(),
      captchaToken("reset"),
    );
    $("#auth-message").textContent = "Sjekk e-posten din for en lenke til å velge nytt passord.";
    $("#auth-message").classList.add("success");
  } catch (error) {
    $("#auth-message").textContent = error.message;
  } finally {
    resetCaptcha("reset");
    button.disabled = false;
  }
});
$("#resend-confirmation").addEventListener("click", async () => {
  const email = $("#signup-email").value.trim();
  if (!email) {
    $("#auth-message").textContent = "Skriv inn e-postadressen først.";
    return;
  }
  const button = $("#resend-confirmation");
  button.disabled = true;
  $("#auth-message").textContent = "Sender bekreftelsesmail …";
  $("#auth-message").classList.remove("success");
  try {
    await window.KumoServices.auth.resendConfirmation(email);
    $("#auth-message").textContent = "Bekreftelsesmailen er sendt på nytt.";
    $("#auth-message").classList.add("success");
  } catch (error) {
    $("#auth-message").textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
$("#update-password-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = $("#new-password").value;
  const confirmation = $("#confirm-new-password").value;
  if (!isStrongPassword(password)) {
    $("#auth-message").textContent = "Bruk minst 10 tegn, stor og liten bokstav, og ett tall.";
    return;
  }
  if (password !== confirmation) {
    $("#auth-message").textContent = "Passordene er ikke like.";
    return;
  }
  const button = event.currentTarget.querySelector("button[type='submit']");
  button.disabled = true;
  $("#auth-message").textContent = "Lagrer nytt passord …";
  $("#auth-message").classList.remove("success");
  try {
    await window.KumoServices.auth.updatePassword(password);
    passwordRecoveryMode = false;
    await window.KumoServices.auth.signOut();
    showAuthPage("Passordet er oppdatert. Du kan logge inn nå.", true);
    setAuthMode("login");
  } catch (error) {
    $("#auth-message").textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
$("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");
  button.disabled = true;
  $("#auth-message").textContent = "Logger inn …";
  $("#auth-message").classList.remove("success");
  try {
    await window.KumoServices.auth.signIn({
      email: $("#login-email").value.trim(),
      password: $("#login-password").value,
    });
    showLoading("Laster kontoen din …");
  } catch (error) {
    $("#auth-message").textContent = error.message;
  } finally {
    button.disabled = false;
  }
});
$("#signup-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");
  button.disabled = true;
  $("#auth-message").textContent = "Oppretter konto …";
  $("#auth-message").classList.remove("success");
  try {
    const password = $("#signup-password").value;
    if (!isStrongPassword(password)) {
      throw new Error("Bruk minst 10 tegn, stor og liten bokstav, og ett tall.");
    }
    const data = await window.KumoServices.auth.signUp({
      displayName: $("#signup-name").value.trim(),
      email: $("#signup-email").value.trim(),
      password,
      captchaToken: captchaToken("signup"),
    });
    if (data.session) showLoading("Laster den nye kontoen …");
    else {
      $("#auth-message").textContent = "Kontoen er opprettet. Sjekk e-posten din for å bekrefte adressen.";
      $("#auth-message").classList.add("success");
    }
  } catch (error) {
    $("#auth-message").textContent = error.message;
  } finally {
    resetCaptcha("signup");
    button.disabled = false;
  }
});

async function logout() {
  try {
    await flushProgress();
    await window.KumoServices.auth.signOut();
    showAuthPage("Du er logget ut.", true);
  } catch (error) {
    showToast(error.message);
  }
}

$("#logout-button").addEventListener("click", logout);
$("#settings-logout-button").addEventListener("click", logout);
window.addEventListener("pagehide", () => {
  if (currentUser && !isHydrating) persistState(false);
  kanaPracticeCountdown.destroy();
  quizCountdown.destroy();
  window.clearInterval(reviewTicker);
});
window.addEventListener("offline", updateConnectivityUi);
window.addEventListener("online", async () => {
  updateConnectivityUi();
  if (syncPending && currentUser) await persistState(false);
});

reviewTicker = window.setInterval(updateDashboard, 60_000);
document.documentElement.classList.add("app-ready");
setupServiceWorker();
updateConnectivityUi();
bootstrapAuthentication();
