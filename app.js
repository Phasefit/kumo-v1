import {
  freshState,
  validateState as validateStateBase,
  validUniqueItems,
  validReviewStats,
  validNonNegativeInteger,
  validDueAt,
  isDateKey as isValidDateKey,
} from "./app/state.js";

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
  return isValidDateKey(value, localDateKey);
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


