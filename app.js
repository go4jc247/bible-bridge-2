document.getElementById("spLogo").src=IMG.logo;


var ICONS={"home": "<path d=\"M5 12l-2 0l9 -9l9 9l-2 0\" /> <path d=\"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7\" /> <path d=\"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6\" />", "book-2": "<path d=\"M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12\" /> <path d=\"M19 16h-12a2 2 0 0 0 -2 2\" /> <path d=\"M9 8h6\" />", "calendar-event": "<path d=\"M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12\" /> <path d=\"M16 3l0 4\" /> <path d=\"M8 3l0 4\" /> <path d=\"M4 11l16 0\" /> <path d=\"M8 15h2v2h-2l0 -2\" />", "settings": "<path d=\"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065\" /> <path d=\"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" />", "headphones": "<path d=\"M4 15a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2l0 -3\" /> <path d=\"M15 15a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2l0 -3\" /> <path d=\"M4 15v-3a8 8 0 0 1 16 0v3\" />", "chevron-right": "<path d=\"M9 6l6 6l-6 6\" />", "chevron-down": "<path d=\"M6 9l6 6l6 -6\" />", "chevron-left": "<path d=\"M15 6l-6 6l6 6\" />", "arrow-left": "<path d=\"M5 12l14 0\" /> <path d=\"M5 12l6 6\" /> <path d=\"M5 12l6 -6\" />", "plus": "<path d=\"M12 5l0 14\" /> <path d=\"M5 12l14 0\" />", "trash": "<path d=\"M4 7l16 0\" /> <path d=\"M10 11l0 6\" /> <path d=\"M14 11l0 6\" /> <path d=\"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12\" /> <path d=\"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3\" />", "check": "<path d=\"M5 12l5 5l10 -10\" />", "search": "<path d=\"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\" /> <path d=\"M21 21l-6 -6\" />", "x": "<path d=\"M18 6l-12 12\" /> <path d=\"M6 6l12 12\" />", "world": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M3.6 9h16.8\" /> <path d=\"M3.6 15h16.8\" /> <path d=\"M11.5 3a17 17 0 0 0 0 18\" /> <path d=\"M12.5 3a17 17 0 0 1 0 18\" />", "circle-check": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" /> <path d=\"M9 12l2 2l4 -4\" />", "sun-moon": "<path d=\"M9.173 14.83a4 4 0 1 1 5.657 -5.657\" /> <path d=\"M11.294 12.707l.174 .247a7.5 7.5 0 0 0 8.845 2.492a9 9 0 0 1 -14.671 2.914\" /> <path d=\"M3 12h1\" /> <path d=\"M12 3v1\" /> <path d=\"M5.6 5.6l.7 .7\" /> <path d=\"M3 21l18 -18\" />", "player-play": "<path d=\"M7 4v16l13 -8l-13 -8\" />", "alert-circle": "<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 8v4\" /> <path d=\"M12 16h.01\" />", "dots": "<path d=\"M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />", "edit": "<path d=\"M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1\" /> <path d=\"M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415\" /> <path d=\"M16 5l3 3\" />", "refresh": "<path d=\"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4\" /> <path d=\"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4\" />", "list-details": "<path d=\"M13 5h8\" /> <path d=\"M13 9h5\" /> <path d=\"M13 15h8\" /> <path d=\"M13 19h5\" /> <path d=\"M3 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4\" /> <path d=\"M3 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4\" />", "language": "<path d=\"M9 6.371c0 4.418 -2.239 6.629 -5 6.629\" /> <path d=\"M4 6.371h7\" /> <path d=\"M5 9c0 2.144 2.252 3.908 6 4\" /> <path d=\"M12 20l4 -9l4 9\" /> <path d=\"M19.1 18h-6.2\" /> <path d=\"M6.694 3l.793 .582\" />"};
var TILES=IMG.tiles;
var BOOKICONS=IMG.bookicons;
var ROOT="https://www.biblegateway.com/audio/";

/* [url abbreviation, chapters, English, Russian] — first 39 are Old Testament */
var BOOKS=[
["Gen",50,"Genesis","Бытие"],["Exod",40,"Exodus","Исход"],["Lev",27,"Leviticus","Левит"],
["Num",36,"Numbers","Числа"],["Deut",34,"Deuteronomy","Второзаконие"],["Josh",24,"Joshua","Иисус Навин"],
["Judg",21,"Judges","Судьи"],["Ruth",4,"Ruth","Руфь"],["1 Sam",31,"1 Samuel","1 Царств"],
["2 Sam",24,"2 Samuel","2 Царств"],["1 Kgs",22,"1 Kings","3 Царств"],["2 Kgs",25,"2 Kings","4 Царств"],
["1 Chr",29,"1 Chronicles","1 Паралипоменон"],["2 Chr",36,"2 Chronicles","2 Паралипоменон"],["Ezra",10,"Ezra","Ездра"],
["Neh",13,"Nehemiah","Неемия"],["Esth",10,"Esther","Есфирь"],["Job",42,"Job","Иов"],
["Ps",150,"Psalms","Псалтирь"],["Prov",31,"Proverbs","Притчи"],["Eccl",12,"Ecclesiastes","Екклесиаст"],
["Song",8,"Song of Solomon","Песня Песней"],["Isa",66,"Isaiah","Исаия"],["Jer",52,"Jeremiah","Иеремия"],
["Lam",5,"Lamentations","Плач Иеремии"],["Ezek",48,"Ezekiel","Иезекииль"],["Dan",12,"Daniel","Даниил"],
["Hos",14,"Hosea","Осия"],["Joel",3,"Joel","Иоиль"],["Amos",9,"Amos","Амос"],
["Obad",1,"Obadiah","Авдий"],["Jonah",4,"Jonah","Иона"],["Mic",7,"Micah","Михей"],
["Nah",3,"Nahum","Наум"],["Hab",3,"Habakkuk","Аввакум"],["Zeph",3,"Zephaniah","Софония"],
["Hag",2,"Haggai","Аггей"],["Zech",14,"Zechariah","Захария"],["Mal",4,"Malachi","Малахия"],
["Matt",28,"Matthew","От Матфея"],["Mark",16,"Mark","От Марка"],["Luke",24,"Luke","От Луки"],
["John",21,"John","От Иоанна"],["Acts",28,"Acts","Деяния"],["Rom",16,"Romans","Римлянам"],
["1 Cor",16,"1 Corinthians","1 Коринфянам"],["2 Cor",13,"2 Corinthians","2 Коринфянам"],["Gal",6,"Galatians","Галатам"],
["Eph",6,"Ephesians","Ефесянам"],["Phil",4,"Philippians","Филиппийцам"],["Col",4,"Colossians","Колоссянам"],
["1 Thess",5,"1 Thessalonians","1 Фессалоникийцам"],["2 Thess",3,"2 Thessalonians","2 Фессалоникийцам"],
["1 Tim",6,"1 Timothy","1 Тимофею"],["2 Tim",4,"2 Timothy","2 Тимофею"],["Titus",3,"Titus","Титу"],
["Phlm",1,"Philemon","Филимону"],["Heb",13,"Hebrews","Евреям"],["Jas",5,"James","Иакова"],
["1 Pet",5,"1 Peter","1 Петра"],["2 Pet",3,"2 Peter","2 Петра"],["1 John",5,"1 John","1 Иоанна"],
["2 John",1,"2 John","2 Иоанна"],["3 John",1,"3 John","3 Иоанна"],["Jude",1,"Jude","Иуды"],
["Rev",22,"Revelation","Откровение"]
];
var OT_COUNT=39;

/* Audio languages and recordings. path = reader/version as used by BibleGateway. nt = New Testament only. */
var LANGS=[
 {id:"en",flag:"🇺🇸",nat:"English",en:"English",ru:"Английский",top:1},
 {id:"zh",flag:"🇨🇳",nat:"汉语",en:"Chinese",ru:"Китайский",top:1},
 {id:"es",flag:"🇪🇸",nat:"Español",en:"Spanish",ru:"Испанский",top:1},
 {id:"ar",flag:"🇸🇦",nat:"العربية",en:"Arabic",ru:"Арабский",top:1},
 {id:"pt",flag:"🇧🇷",nat:"Português",en:"Portuguese",ru:"Португальский",top:1},
 {id:"ru",flag:"🇷🇺",nat:"Русский",en:"Russian",ru:"Русский",top:1},
 {id:"fr",flag:"🇫🇷",nat:"Français",en:"French",ru:"Французский",top:1},
 {id:"de",flag:"🇩🇪",nat:"Deutsch",en:"German",ru:"Немецкий",top:1},
 {id:"ja",flag:"🇯🇵",nat:"日本語",en:"Japanese",ru:"Японский",top:1},
 {id:"cs",flag:"🇨🇿",nat:"Čeština",en:"Czech",ru:"Чешский"},
 {id:"fa",flag:"🇮🇷",nat:"فارسی",en:"Persian (Farsi)",ru:"Персидский (фарси)"},
 {id:"pl",flag:"🇵🇱",nat:"Polski",en:"Polish",ru:"Польский"},
 {id:"pdt",flag:"🌐",nat:"Plautdietsch",en:"Plautdietsch",ru:"Плаутдич"},
 {id:"ro",flag:"🇷🇴",nat:"Română",en:"Romanian",ru:"Румынский"},
 {id:"sk",flag:"🇸🇰",nat:"Slovenčina",en:"Slovak",ru:"Словацкий"},
 {id:"sw",flag:"🇰🇪",nat:"Kiswahili",en:"Swahili",ru:"Суахили"},
 {id:"sv",flag:"🇸🇪",nat:"Svenska",en:"Swedish",ru:"Шведский"},
 {id:"th",flag:"🇹🇭",nat:"ภาษาไทย",en:"Thai",ru:"Тайский"}
];
/* more languages that BibleGateway offers (text only; menus stay in the app languages above) */
var XLANGS=[{"id":"sq","flag":"🇦🇱","nat":"Shqip","en":"Albanian"},{"id":"amu","flag":"🌐","nat":"Amuzgo de Guerrero","en":"Amuzgo (Guerrero)"},{"id":"awa","flag":"🇮🇳","nat":"अवधी","en":"Awadhi"},{"id":"bn","flag":"🇧🇩","nat":"বাংলা","en":"Bengali"},{"id":"bg","flag":"🇧🇬","nat":"Български","en":"Bulgarian"},{"id":"ceb","flag":"🇵🇭","nat":"Cebuano","en":"Cebuano"},{"id":"chr","flag":"🌐","nat":"ᏣᎳᎩ","en":"Cherokee"},{"id":"hne","flag":"🇮🇳","nat":"छत्तीसगढ़ी","en":"Chhattisgarhi"},{"id":"ny","flag":"🇲🇼","nat":"Chichewa","en":"Chichewa"},{"id":"cco","flag":"🌐","nat":"Chinanteco de Comaltepec","en":"Chinantec (Comaltepec)"},{"id":"hr","flag":"🇭🇷","nat":"Hrvatski","en":"Croatian"},{"id":"da","flag":"🇩🇰","nat":"Dansk","en":"Danish"},{"id":"nl","flag":"🇳🇱","nat":"Nederlands","en":"Dutch"},{"id":"fi","flag":"🇫🇮","nat":"Suomi","en":"Finnish"},{"id":"grc","flag":"🇬🇷","nat":"Ἑλληνική","en":"Greek (Koine)"},{"id":"gu","flag":"🇮🇳","nat":"ગુજરાતી","en":"Gujarati"},{"id":"ht","flag":"🇭🇹","nat":"Kreyòl ayisyen","en":"Haitian Creole"},{"id":"hwc","flag":"🇺🇸","nat":"Hawai‘i Pidgin","en":"Hawai‘i Pidgin"},{"id":"he","flag":"🇮🇱","nat":"עברית","en":"Hebrew"},{"id":"hil","flag":"🇵🇭","nat":"Hiligaynon","en":"Hiligaynon"},{"id":"hi","flag":"🇮🇳","nat":"हिन्दी","en":"Hindi"},{"id":"hu","flag":"🇭🇺","nat":"Magyar","en":"Hungarian"},{"id":"is","flag":"🇮🇸","nat":"Íslenska","en":"Icelandic"},{"id":"id","flag":"🇮🇩","nat":"Bahasa Indonesia","en":"Indonesian"},{"id":"it","flag":"🇮🇹","nat":"Italiano","en":"Italian"},{"id":"jac","flag":"🇬🇹","nat":"Jakalteko","en":"Jakaltek"},{"id":"kn","flag":"🇮🇳","nat":"ಕನ್ನಡ","en":"Kannada"},{"id":"ckw","flag":"🇬🇹","nat":"Kaqchikel","en":"Kaqchikel"},{"id":"kek","flag":"🇬🇹","nat":"Q’eqchi’","en":"Kekchi"},{"id":"ko","flag":"🇰🇷","nat":"한국어","en":"Korean"},{"id":"qut","flag":"🇬🇹","nat":"K’iche’","en":"K’iche’"},{"id":"la","flag":"🇻🇦","nat":"Latina","en":"Latin"},{"id":"lg","flag":"🇺🇬","nat":"Luganda","en":"Luganda"},{"id":"mk","flag":"🇲🇰","nat":"Македонски","en":"Macedonian"},{"id":"mvc","flag":"🇬🇹","nat":"Mam (Central)","en":"Mam, Central"},{"id":"mvj","flag":"🇬🇹","nat":"Mam (Todos Santos)","en":"Mam, Todos Santos"},{"id":"mi","flag":"🇳🇿","nat":"Te Reo Māori","en":"Maori"},{"id":"mr","flag":"🇮🇳","nat":"मराठी","en":"Marathi"},{"id":"ngu","flag":"🇲🇽","nat":"Náhuatl de Guerrero","en":"Nahuatl (Guerrero)"},{"id":"ne","flag":"🇳🇵","nat":"नेपाली","en":"Nepali"},{"id":"no","flag":"🇳🇴","nat":"Norsk","en":"Norwegian"},{"id":"or","flag":"🇮🇳","nat":"ଓଡ଼ିଆ","en":"Odia"},{"id":"ppl","flag":"🇸🇻","nat":"Nawat (Pipil)","en":"Pipil"},{"id":"pa","flag":"🇮🇳","nat":"ਪੰਜਾਬੀ","en":"Punjabi"},{"id":"qu","flag":"🇪🇨","nat":"Runa Shimi","en":"Quichua"},{"id":"sr","flag":"🇷🇸","nat":"Српски","en":"Serbian"},{"id":"so","flag":"🇸🇴","nat":"Soomaali","en":"Somali"},{"id":"ckb","flag":"🌐","nat":"کوردیی ناوەندی","en":"Sorani Kurdish"},{"id":"tl","flag":"🇵🇭","nat":"Tagalog","en":"Tagalog"},{"id":"ta","flag":"🇮🇳","nat":"தமிழ்","en":"Tamil"},{"id":"te","flag":"🇮🇳","nat":"తెలుగు","en":"Telugu"},{"id":"twi","flag":"🇬🇭","nat":"Twi","en":"Twi"},{"id":"uk","flag":"🇺🇦","nat":"Українська","en":"Ukrainian"},{"id":"ur","flag":"🇵🇰","nat":"اردو","en":"Urdu"},{"id":"usp","flag":"🇬🇹","nat":"Uspanteko","en":"Uspanteko"},{"id":"vi","flag":"🇻🇳","nat":"Tiếng Việt","en":"Vietnamese"},{"id":"cy","flag":"🌐","nat":"Cymraeg","en":"Welsh"},{"id":"yo","flag":"🇳🇬","nat":"Yorùbá","en":"Yoruba"}];
/* path = reader/version as used in BibleGateway audio links. nt = New Testament only.
   Some paths are best guesses; if a link fails, only that line needs correcting. */
var VERSIONS=[
 {id:"esv-mclean",lang:"en",label:"ESV · Max McLean",path:"mclean/esv"},
 {id:"esv-heath",lang:"en",label:"ESV · David Cochran Heath",path:"heath/esv"},
 {id:"esv-laughlin",lang:"en",label:"ESV · Marquis Laughlin (NT)",path:"laughlin/esv",nt:1},
 {id:"niv-mclean",lang:"en",label:"NIV · Max McLean",path:"mclean/niv"},
 {id:"niv-dramatized",lang:"en",label:"NIV · Dramatized",path:"dramatized/niv"},
 {id:"niv-sarris",lang:"en",label:"NIV · George W. Sarris",path:"sarris/niv"},
 {id:"nivuk-suchet",lang:"en",label:"NIVUK · David Suchet",path:"suchet/nivuk"},
 {id:"kjv-mims",lang:"en",label:"KJV · Paul Mims",path:"mims/kjv"},
 {id:"kjv-mclean",lang:"en",label:"KJV · Max McLean",path:"mclean/kjv"},
 {id:"kjv-dramatized",lang:"en",label:"KJV · Dramatized",path:"dramatized/kjv"},
 {id:"nkjv-bubb",lang:"en",label:"NKJV · Simon Bubb",path:"bubb/nkjv"},
 {id:"nkjv-laraye",lang:"en",label:"NKJV · Tinasha LaRaye",path:"laraye/nkjv"},
 {id:"nasb-mcconachie",lang:"en",label:"NASB · Dale McConachie",path:"mcconachie/nasb"},
 {id:"nasb95-mcconachie",lang:"en",label:"NASB1995 · Dale McConachie",path:"mcconachie/nasb1995"},
 {id:"csb-mohr",lang:"en",label:"CSB · Jon Mohr",path:"mohr/csb"},
 {id:"hcsb-mcconachie",lang:"en",label:"HCSB · Dale McConachie",path:"mcconachie/hcsb"},
 {id:"nlt-breathe",lang:"en",label:"NLT · Breathe",path:"breathe/nlt"},
 {id:"msg-dolan",lang:"en",label:"MSG · Kelly Ryan Dolan",path:"dolan/msg"},
 {id:"gnv-cook",lang:"en",label:"GNV · Steve Cook",path:"cook/gnv"},
 {id:"leb-logos",lang:"en",label:"LEB · Logos (NT)",path:"logos/leb",nt:1},
 {id:"app-kjv",lang:"en",label:"KJV · In-app reader",app:"kjv"},
 {id:"app-web",lang:"en",label:"WEB · In-app reader",app:"web",noaudio:1},
 {id:"app-bsb",lang:"en",label:"BSB · In-app reader",app:"bsb",noaudio:1},
 {id:"app-asv",lang:"en",label:"ASV · In-app reader",app:"asv",noaudio:1},
 {id:"app-darby",lang:"en",label:"DBY · In-app reader",app:"darby",noaudio:1},
 {id:"app-webster",lang:"en",label:"WBS · In-app reader",app:"webster",noaudio:1},
 {id:"app-ylt",lang:"en",label:"YLT · In-app reader",app:"ylt",noaudio:1},
 {id:"ccb-biblica",lang:"zh",label:"CCB · Biblica",path:"biblica/ccb"},
 {id:"ccbt-biblica",lang:"zh",label:"CCBT · Biblica",path:"biblica/ccbt"},
 {id:"csbs-hao",lang:"zh",label:"CSBS · Ran Hao (NT)",path:"hao/csbs",nt:1},
 {id:"csbt-hao",lang:"zh",label:"CSBT · Ran Hao (NT)",path:"hao/csbt",nt:1},
 {id:"lbla-montoya",lang:"es",label:"LBLA · Samuel Montoya H (NT)",path:"montoya/lbla",nt:1},
 {id:"nvi-cruz",lang:"es",label:"NVI · Rafael Cruz",path:"cruz/nvi"},
 {id:"nvi-ev",lang:"es",label:"NVI · Experiencia Viva (NT)",path:"ev/nvi",nt:1},
 {id:"app-rv1909",lang:"es",label:"RV1909 · In-app reader",app:"rv1909",noaudio:1},
 {id:"nav-biblica",lang:"ar",label:"NAV · Biblica",path:"biblica/nav"},
 {id:"nvipt-biblica",lang:"pt",label:"NVI-PT · Biblica",path:"biblica/nvipt"},
 {id:"rst-isa",lang:"ru",label:"Синодальный (RUSV) · Чтец · ISA · Digital Bible Society",bg:"RUSV",src:"dbs",home:"https://dbs.org/bibles/audio/RUSS76_ISA_FB_N"},
 {id:"rst-fcbh",lang:"ru",label:"Синодальный (RUSV) · Драматизированный · Faith Comes By Hearing",bg:"RUSV",src:"fcbh",home:"https://live.bible.is/bible/RUSSYN"},
 {id:"nrt-biblica",lang:"ru",label:"NRT · Biblica",path:"biblica/nrt"},
 {id:"app-rst",lang:"ru",label:"RST · In-app reader",app:"rst"},
 {id:"bds-biblica",lang:"fr",label:"BDS · Biblica",path:"biblica/bds"},
 {id:"hof-biblica",lang:"de",label:"HOF · Biblica",path:"biblica/hof"},
 {id:"jlb-biblica",lang:"ja",label:"JLB · Biblica (NT)",path:"biblica/jlb",nt:1},
 {id:"bk-hodul",lang:"cs",label:"BK · Joseph Hodul (NT)",path:"hodul/bk",nt:1},
 {id:"farsi-as",lang:"fa",label:"Farsi · Audio Scriptures",path:"as/farsi"},
 {id:"reimer",lang:"pdt",label:"REIMER · Elmer Reimer",path:"reimer/reimer"},
 {id:"ntlr-biblica",lang:"ro",label:"NTLR · Biblica",path:"biblica/ntlr"},
 {id:"slo1979-hodul",lang:"sk",label:"SLO1979 · Joseph Hodul (NT)",path:"hodul/slo1979",nt:1},
 {id:"snt-biblica",lang:"sw",label:"SNT · Biblica (NT)",path:"biblica/snt",nt:1},
 {id:"sfb",lang:"sv",label:"SFB · Svenska Folkbibeln",path:"sfb/sfb"},
 {id:"sfb15",lang:"sv",label:"SFB15 · Svenska Folkbibeln",path:"sfb/sfb15"},
 {id:"tncv-biblica",lang:"th",label:"TNCV · Biblica",path:"biblica/tncv"}
];

/* BibleGateway text versions: [language, code, name, level (1 whole Bible, 2 New Testament only, 3 Old Testament only), more].
   more = a version of one of the main languages above; shown only under "All languages". */
var BGV=[["amu","AMU","Amuzgo de Guerrero",2,0],["ar","ERV-AR","Arabic Bible: Easy-to-Read Version",1,1],["awa","ERV-AWA","Awadhi Bible: Easy-to-Read Version",1,0],["bg","BG1940","1940 Bulgarian Bible",1,0],["bg","BULG","Bulgarian Bible",1,0],["bg","ERV-BG","Bulgarian New Testament: Easy-to-Read Version",2,0],["bg","BOB","Библия, синодално издание",1,0],["bg","BPB","Библия, ревизирано издание",1,0],["bg","CBT","Библия, нов превод от оригиналните езици (с неканоничните книги)",1,0],["bn","BERV","Bengali: পবিত্র বাইবেল",1,0],["cco","CCO","Chinanteco de Comaltepec",2,0],["ceb","APSD-CEB","Ang Pulong Sa Dios",1,0],["chr","CHR","Cherokee New Testament",2,0],["ckb","KSS","Kurdi Sorani Standard",1,0],["ckw","CKW","Cakchiquel Occidental",2,0],["cs","B21","Bible 21",1,1],["cs","SNC","Slovo na cestu",1,1],["cy","BWM","Beibl William Morgan",1,0],["da","BPH","Bibelen på hverdagsdansk",1,0],["da","DN1933","Dette er Biblen på dansk",1,0],["de","LUTH1545","Luther Bibel 1545",1,1],["de","NGU-DE","Neue Genfer Übersetzung",1,1],["de","SCH1951","Schlachter 1951",1,1],["de","SCH2000","Schlachter 2000",1,1],["en","KJ21","21st Century King James Version",1,1],["en","AMP","Amplified Bible",1,1],["en","AMPC","Amplified Bible, Classic Edition",1,1],["en","BRG","BRG Bible",1,1],["en","CSBA","Christian Standard Bible Anglicised",1,1],["en","CEB","Common English Bible",1,1],["en","CJB","Complete Jewish Bible",1,1],["en","CEV","Contemporary English Version",1,1],["en","DLNT","Disciples' Literal New Testament",2,1],["en","DRA","Douay-Rheims 1899 American Edition",1,1],["en","ERV","Easy-to-Read Version",1,1],["en","EASY","EasyEnglish Bible",1,1],["en","EHV","Evangelical Heritage Version",1,1],["en","ESVUK","English Standard Version Anglicised",1,1],["en","EXB","Expanded Bible",1,1],["en","GW","GOD'S WORD Translation",1,1],["en","GNT","Good News Translation",1,1],["en","ICB","International Children's Bible",1,1],["en","ISV","International Standard Version",1,1],["en","PHILLIPS","J.B. Phillips New Testament",2,1],["en","JUB","Jubilee Bible 2000",1,1],["en","AKJV","Authorized (King James) Version",1,1],["en","LSB","Legacy Standard Bible",1,1],["en","TLB","Living Bible",1,1],["en","MEV","Modern English Version",1,1],["en","MOUNCE","Mounce Reverse Interlinear New Testament",2,1],["en","NOG","Names of God Bible",1,1],["en","NABRE","New American Bible (Revised Edition)",1,1],["en","NCB","New Catholic Bible",1,1],["en","NCV","New Century Version",1,1],["en","NET","New English Translation",1,1],["en","NIRV","New International Reader's Version",1,1],["en","NLV","New Life Version",1,1],["en","NMB","New Matthew Bible",1,1],["en","NRSVA","New Revised Standard Version, Anglicised",1,1],["en","NRSVACE","New Revised Standard Version, Anglicised Catholic Edition",1,1],["en","NRSVCE","New Revised Standard Version Catholic Edition",1,1],["en","NRSVUE","New Revised Standard Version Updated Edition",1,1],["en","NTFE","New Testament for Everyone",2,1],["en","OJB","Orthodox Jewish Bible",1,1],["en","RGT","Revised Geneva Translation",1,1],["en","RSV","Revised Standard Version",1,1],["en","RSVCE","Revised Standard Version Catholic Edition",1,1],["en","TLV","Tree of Life Version",1,1],["en","VOICE","The Voice",1,1],["en","WE","Worldwide English (New Testament)",2,1],["en","WYC","Wycliffe Bible",1,1],["es","JBS","Biblia del Jubileo",1,1],["es","DHH","Dios Habla Hoy",1,1],["es","NBLA","Nueva Biblia de las Américas",1,1],["es","NBV","Nueva Biblia Viva",1,1],["es","NTV","Nueva Traducción Viviente",1,1],["es","CST","Nueva Versión Internacional (Castilian)",1,1],["es","PDT","Palabra de Dios para Todos",1,1],["es","BLP","La Palabra (España)",1,1],["es","BLPH","La Palabra (Hispanoamérica)",1,1],["es","RVA-2015","Reina Valera Actualizada",1,1],["es","RVC","Reina Valera Contemporánea",1,1],["es","RVR1960","Reina-Valera 1960",1,1],["es","RVR1977","Reina Valera Revisada",1,1],["es","RVR1995","Reina-Valera 1995",1,1],["es","RVA","Reina-Valera Antigua",1,1],["es","SRV-BRG","Spanish Blue Red and Gold Letter Edition",1,1],["es","TLA","Traducción en lenguaje actual",1,1],["fi","R1933","Raamattu 1933/38",1,0],["fr","LSG","Louis Segond",1,1],["fr","NEG1979","Nouvelle Edition de Genève – NEG1979",1,1],["fr","SG21","Segond 21",1,1],["grc","TR1550","1550 Stephanus New Testament",2,0],["grc","WHNU","1881 Westcott-Hort New Testament",2,0],["grc","TR1894","1894 Scrivener New Testament",2,0],["grc","SBLGNT","SBL Greek New Testament",2,0],["grc","THGNT","Tyndale House Greek New Testament",2,0],["gu","GERV","Gujarati: પવિત્ર બાઈબલ",1,0],["he","HHH","Habrit Hakhadasha/Haderekh",2,0],["he","WLC","The Westminster Leningrad Codex",3,0],["hi","ERV-HI","Hindi Bible: Easy-to-Read Version",1,0],["hi","SHB","Saral Hindi Bible",1,0],["hil","HLGN","Ang Pulong Sang Dios",1,0],["hne","NCA","New Chhattisgarhi Translation (नवां नियम छत्तीसगढ़ी)",2,0],["hr","SHP","Biblija: suvremeni hrvatski prijevod",1,0],["hr","HNZ-RI","Hrvatski Novi Zavjet – Rijeka 2001",2,0],["hr","CRO","Knijga O Kristu",2,0],["ht","HCV","Haitian Creole Version",1,0],["ht","VKF","Nouvo Testaman: Vèsyon Kreyòl Fasil",2,0],["hu","KAR","Hungarian Károli",1,0],["hu","ERV-HU","Hungarian Bible: Easy-to-Read Version",1,0],["hu","NT-HU","Hungarian New Translation",1,0],["hwc","HWP","Hawai‘i Pidgin",1,0],["id","AMD","Alkitab Mudah Dibaca",1,0],["is","ICELAND","Icelandic Bible",1,0],["it","BDG","La Bibbia della Gioia",1,0],["it","CEI","Conferenza Episcopale Italiana",1,0],["it","LND","La Nuova Diodati",1,0],["it","NR1994","Nuova Riveduta 1994",1,0],["it","NR2006","Nuova Riveduta 2006",1,0],["ja","JERV","Japanese Bible: Easy-to-Read Version",1,1],["jac","JAC","Jacalteco, Oriental",2,0],["kek","KEK","Kekchi",2,0],["kn","KERV","Kannada Holy Bible: Easy-to-Read Version",1,0],["ko","KOERV","Korean Bible: Easy-to-Read Version",1,0],["ko","KLB","Korean Living Bible",1,0],["la","VULGATE","Biblia Sacra Vulgata",1,0],["lg","LCB","Endagaano Enkadde nʼEndagaano Empya",1,0],["mi","MAORI","Maori Bible",1,0],["mk","MNT","Macedonian New Testament",2,0],["mr","ERV-MR","Marathi Bible: Easy-to-Read Version",1,0],["mvc","MVC","Mam, Central",2,0],["mvj","MVJ","Mam de Todos Santos Chuchumatán",2,0],["ne","ERV-NE","Nepali Bible: Easy-to-Read Version",1,0],["ngu","NGU","Náhuatl de Guerrero",2,0],["nl","BB","BasisBijbel",1,0],["nl","HTB","Het Boek",1,0],["no","DNB1930","Det Norsk Bibelselskap 1930",1,0],["no","LB","En Levende Bok",1,0],["ny","CCL","Mawu a Mulungu mu Chichewa Chalero",1,0],["or","ERV-OR","Odia Holy Bible: Easy-to-Read Version",1,0],["pa","ERV-PA","Punjabi Bible: Easy-to-Read Version",1,0],["pl","NP","Nowe Przymierze",2,0],["pl","SZ-PL","Słowo Życia",1,0],["pl","UBG","Updated Gdańsk Bible",1,0],["ppl","NBTN","Ne Bibliaj Tik Nawat",2,0],["pt","ARC","Almeida Revista e Corrigida 2009",1,1],["pt","VFL","Portuguese New Testament: Easy-to-Read Version",2,1],["pt","NTLH","Nova Traduҫão na Linguagem de Hoje 2000",1,1],["pt","NVT","Nova Versão Transformadora",1,1],["pt","OL","O Livro",1,1],["qu","MTDS","Mushuj Testamento Diospaj Shimi",2,0],["qut","QUT","Quiché, Centro Occidental",2,0],["ro","RMNN","Cornilescu 1924 - Revised 2010, 2014",1,1],["ru","ERV-RU","Russian New Testament: Easy-to-Read Version",2,1],["ru","CARS","Священное Писание (Восточный Перевод)",1,1],["ru","CARST","Священное Писание (Восточный перевод), версия для Таджикистана",1,1],["ru","CARSA","Священное Писание (Восточный перевод), версия с «Аллахом»",1,1],["sk","NPK","Nádej pre kazdého",1,1],["so","SOM","Somali Bible",1,0],["sq","ALB","Albanian Bible",1,0],["sr","NSP","New Serbian Translation",1,0],["sr","ERV-SR","Serbian New Testament: Easy-to-Read Version",2,0],["sv","NUB","nuBibeln (Swedish Contemporary Bible)",1,1],["sv","SV1917","Svenska 1917",1,1],["sv","SVL","Swedish New Living Bible (Nya Levande Bibeln)",1,1],["sw","TKU","Agano Jipya: Tafsiri ya Kusoma-Kwa-Urahisi",2,1],["ta","ERV-TA","Tamil Bible: Easy-to-Read Version",1,0],["te","TERV","Telugu Holy Bible: Easy-to-Read Version",1,0],["th","NTV-BIBLE","New Thai Version",1,1],["th","ERV-TH","Thai New Testament: Easy-to-Read Version",2,1],["tl","FSV","Ang Bagong Tipan: Filipino Standard Version",2,0],["tl","ABTAG1978","Ang Biblia (1978)",1,0],["tl","ABTAG2001","Ang Biblia, 2001",1,0],["tl","ADB1905","Ang Dating Biblia (1905)",1,0],["tl","ASND","Ang Salita ng Dios (Tagalog Contemporary Bible)",1,0],["tl","MBBTAG","Magandang Balita Biblia",1,0],["tl","MBBTAG-DC","Magandang Balita Biblia (with Deuterocanon)",1,0],["tl","SND","Ang Salita ng Diyos",1,0],["twi","NA-TWI","Nkwa Asem",1,0],["uk","UKR","Ukrainian Bible",1,0],["uk","ERV-UK","Ukrainian Bible: Easy-to-Read Version",1,0],["ur","ERV-UR","Urdu Bible: Easy-to-Read Version",1,0],["usp","USP","Uspanteco",2,0],["vi","BD2011","Bản Dịch 2011",1,0],["vi","NVB","New Vietnamese Bible",1,0],["vi","BPT","Vietnamese Bible: Easy-to-Read Version",1,0],["yo","BYO","Bíbélì Mímọ́ Yorùbá Òde Òn",1,0],["zh","ERV-ZH","Chinese New Testament: Easy-to-Read Version",2,1],["zh","CNVS","Chinese New Version (Simplified)",1,1],["zh","CNVT","Chinese New Version (Traditional)",1,1],["zh","CUVS","Chinese Union Version (Simplified)",1,1],["zh","CUV","Chinese Union Version (Traditional)",1,1],["zh","CUVMPS","Chinese Union Version Modern Punctuation (Simplified)",1,1],["zh","CUVMPT","Chinese Union Version Modern Punctuation (Traditional)",1,1],["zh","RCU17SS","Revised Chinese Union Version (Simplified Script) Shen Edition",1,1],["zh","RCU17TS","Revised Chinese Union Version (Traditional Script) Shen Edition",1,1]];
BGV.forEach(function(r){VERSIONS.push({id:"bg-"+r[0]+"-"+r[1].toLowerCase(),lang:r[0],label:r[1]+" \u00b7 "+r[2],bg:r[1],noaudio:1,more:r[4]?1:0,bgl:r[3],bgn:r[2]})});

var USFM=["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG","ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL","MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD","REV"];
function pad(n,w){return String(n).padStart(w,"0")}
function bgCode(v){return v.bg||v.label.split(" ")[0]}
function readUrl(v,i,ch){
  return "https://www.biblegateway.com/passage/?search="+encodeURIComponent(BEN[i]+" "+ch)+"&version="+encodeURIComponent(bgCode(v));
}
function chapterUrl(v,i,ch){
  var b=BOOKS[i];
  if(v.src==="dbs"){
    var nm=pad(i+1,2)+"_"+BEN[i].replace(/ /g,"");
    return "https://dbs.org/cdn/audio/RUSS76_ISA_FB_N/"+(i<OT_COUNT?"OT":"NT")+"_RUSS76/"+nm+"/"+nm+"_"+pad(ch,3)+".mp3";
  }
  if(v.src==="fcbh")return "https://live.bible.is/bible/RUSSYN/"+USFM[i]+"/"+ch;
  return ROOT+v.path+"/"+encodeURIComponent(b[0])+"."+ch;
}



var COLORS=["#2f5a3a","#b5622b","#1f5f7a","#3a5f7d","#9a7a46","#5a3f86","#4a6b34","#a8742a","#2f5f93","#2c4f72","#1f7a73","#9a5522","#85353a","#5d3d7a","#2c5348"];
var GCOLORS=["#3f7d4e","#c4622d","#2f6f9a","#7a4fa0","#b8862b"];
var QUICK=[["Law",0,4],["History",5,16],["Poetry",17,21],["Major Prophets",22,26],["Minor Prophets",27,38],["Gospels",39,42],["Acts",43,43],["Paul\u2019s letters",44,56],["General letters",57,64],["Revelation",65,65],["Whole Old Testament",0,38],["Whole New Testament",39,65]];
var PRESETS=[
 {id:"cover",cat:"whole",name:"Cover to cover in a year",days:365,groups:[rng(0,65)],desc:"Genesis to Revelation in order, about 3 chapters a day"},
 {id:"year",cat:"whole",name:"Bible in a year",days:365,groups:[rng(0,16),rng(17,21),rng(22,38),rng(39,65)],desc:"4 groups: Law and History, Poetry, Prophets, New Testament"},
 {id:"weave",cat:"whole",name:"Interwoven year",days:365,groups:[rng(0,16),rng(22,38),[18],[17,19,20,21],rng(39,65)],desc:"5 tracks side by side: Law and History, Prophets, Psalms, Wisdom, New Testament. Psalms and Wisdom days are lighter"},
 {id:"chron",cat:"whole",name:"Chronological (by book)",days:365,order:"picked",groups:[[0,17,1,2,3,4,5,6,7,8,9,12,18,19,20,21,10,11,13,30,28,31,29,27,22,32,33,35,23,24,34,26,25,14,36,37,16,15,38,39,40,41,42,43,58,47,51,52,45,46,44,48,49,50,56,53,55,54,59,60,57,64,61,62,63,65]],desc:"Books arranged in the order events happened, such as Job beside Genesis and the prophets beside the kings. Books stay whole, so this is an approximation"},
 {id:"mcheyne",cat:"whole",name:"M\u2019Cheyne-style, 4 tracks",days:365,order:"picked",groups:[rng(0,16),[17].concat(rng(19,38)),rng(39,65).concat([18]),[18].concat(rng(39,65))],desc:"Old Testament once; New Testament and Psalms twice. An adaptation of Robert Murray M\u2019Cheyne\u2019s classic plan, using whole chapters"},
 {id:"bible90",cat:"whole",name:"Whole Bible in 90 days",days:90,groups:[rng(0,65)],desc:"Genesis to Revelation, about 13 chapters a day"},
 {id:"ot365",cat:"ot",name:"Old Testament in a year",days:365,groups:[rng(0,38)],desc:"Genesis to Malachi, about 2\u20133 chapters a day"},
 {id:"ps30",cat:"ot",name:"Psalms in 30 days",days:30,groups:[[18]],desc:"All 150 psalms, 5 a day"},
 {id:"prov31",cat:"ot",name:"Proverbs in 31 days",days:31,groups:[[19]],desc:"About one chapter of Proverbs a day"},
 {id:"psprov60",cat:"ot",name:"Psalms and Proverbs in 60 days",days:60,groups:[[18],[19]],desc:"2 tracks: Psalms about 2\u20133 a day, Proverbs about half a chapter a day"},
 {id:"gos30",cat:"nt",name:"Gospels in 30 days",days:30,groups:[rng(39,42)],desc:"Matthew to John, about 3 chapters a day"},
 {id:"paul30",cat:"nt",name:"Paul\u2019s letters in 30 days",days:30,groups:[rng(44,56)],desc:"Romans to Philemon, about 3 chapters a day"},
 {id:"nt90",cat:"nt",name:"New Testament in 90 days",days:90,groups:[rng(39,65)],desc:"Matthew to Revelation, about 3 chapters a day"},
 {id:"nt180",cat:"nt",name:"New Testament in 6 months",days:180,groups:[rng(39,65)],desc:"Matthew to Revelation, about 1\u20132 chapters a day"}
];
var PCATS=[["whole","Whole Bible"],["ot","Old Testament only"],["nt","New Testament only"]];
function rng(a,b){var r=[];for(var i=a;i<=b;i++)r.push(i);return r}

/* ---------- interface language ---------- */
var I18N={};
function uiLang(){return (typeof state!=="undefined"&&state&&state.prefs&&state.prefs.ui)||"en"}
function _(s){
  var d=I18N[uiLang()];if(!d||typeof s!=="string")return s;
  if(d[s]!=null)return d[s];
  if(/\d/.test(s)){var v=[],k=s.replace(/\d[\d,]*\d|\d/g,function(m){v.push(m);return"{"+(v.length-1)+"}"});
    if(d[k]!=null)return d[k].replace(/\{(\d+)\}/g,function(m,i){return v[i]!=null?v[i]:""})}
  return s}
/* translate a sentence with {0}, {1} placeholders, then fill them in */
function _f(s,a){return _(s).replace(/\{(\d+)\}/g,function(m,i){return a&&a[i]!=null?a[i]:m})}
var BEN=BOOKS.map(function(b){return b[2]});
var BN={};
var RICO=IMG.rico;
function applyBookNames(){var n=BN[uiLang()];BOOKS.forEach(function(b,i){b[2]=n&&n[i]?n[i]:BEN[i]})}

/* ---------- helpers ---------- */
function $(id){return document.getElementById(id)}
function h(tag,p,kids){var e=document.createElement(tag);p=p||{};for(var k in p){if(p[k]==null)continue;if(k==="class")e.className=p[k];else if(k==="text")e.textContent=_(p[k]);else if(k==="html")e.innerHTML=p[k];else if(k.slice(0,2)==="on")e[k]=p[k];else e.setAttribute(k,(k==="aria-label"||k==="placeholder"||k==="title"||k==="alt")?_(p[k]):p[k])}(kids||[]).forEach(function(c){if(c)e.appendChild(typeof c==="string"?document.createTextNode(_(c)):c)});return e}
function ic(n){return h("span",{class:"ic",html:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||"")+'</svg>'})}
function pad2(n){return String(n).padStart(2,"0")}
function fdate(d){return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate())}
function pdate(s){var q=s.split("-");return new Date(+q[0],+q[1]-1,+q[2])}
function todayStr(){return fdate(new Date())}
function addDays(s,n){var d=pdate(s);d.setDate(d.getDate()+n);return fdate(d)}
function diffDays(a,b){return Math.round((pdate(a)-pdate(b))/86400000)}
var LOC={"en":"en-US"};
function loc(){return LOC[uiLang()]||"en-US"}
function nice(s){return pdate(s).toLocaleDateString(loc(),{weekday:"short",month:"short",day:"numeric"})}
function niceY(s){return pdate(s).toLocaleDateString(loc(),{month:"short",day:"numeric",year:"numeric"})}
function toast(msg){var t=$("toast");t.textContent=_(msg);t.style.display="block";clearTimeout(toast._t);toast._t=setTimeout(function(){t.style.display="none"},2200)}

/* ---------- state ---------- */
var KEY="audio-bible-draft11";
var state=null,viewDay=null,query="";
function allLangs(){return LANGS.concat(XLANGS)}
function langById(id){return LANGS.filter(function(l){return l.id===id})[0]||XLANGS.filter(function(l){return l.id===id})[0]||LANGS[0]}
function versionsFor(l){return VERSIONS.filter(function(v){return v.lang===l&&!v.more})}
function versionsAll(l){var a=versionsFor(l);return a.concat(VERSIONS.filter(function(v){return v.lang===l&&v.more}))}
function curVersion(){var v=VERSIONS.filter(function(x){return x.id===state.prefs.ver})[0];if(!v||v.lang!==state.prefs.lang){v=versionsFor(state.prefs.lang)[0];state.prefs.ver=v.id}return v}
function seed(){
  var t=todayStr();
  return {prefs:{lang:"en",ver:"esv-mclean",mode:"listen",tab:"plans",theme:"auto"},
   plans:[],customs:[],active:null};
}
function load(){try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&s.prefs&&s.plans){s.plans=s.plans.filter(function(p){return p.id!=="p-sample"});if(s.active==="p-sample"||!s.plans.some(function(p){return p.id===s.active}))s.active=s.plans.length?s.plans[0].id:null;if(!s.customs)s.customs=[];state=s;return}}catch(e){}state=seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state,function(k,v){return k.charAt(0)==="_"?undefined:v}))}catch(e){}}
function activePlan(){return state.plans.filter(function(p){return p.id===state.active})[0]||null}
function applyTheme(){var r=document.documentElement,t=state.prefs.theme;if(t==="light"||t==="dark")r.setAttribute("data-theme",t);else r.removeAttribute("data-theme")}

/* ---------- schedule ---------- */
var PROV=19;
var PV=[33,22,35,27,23,35,27,36,18,32,31,28,25,35,33,33,28,24,29,30,31,29,35,34,28,28,27,28,27,33,31];
function unitsOf(books){var L=[];books.forEach(function(b){
  if(b===PROV){for(var c=1;c<=PV.length;c++){var n=PV[c-1],k=Math.ceil(n/15),base=Math.floor(n/k),rem=n%k,v=1;for(var i=0;i<k;i++){var sz=base+(i<rem?1:0);L.push({b:b,c:c,v1:v,v2:v+sz-1});v+=sz}}}
  else for(var c2=1;c2<=BOOKS[b][1];c2++)L.push({b:b,c:c2,v1:0,v2:0});
});return L}
function totalChapters(books){return books.reduce(function(n,b){return n+BOOKS[b][1]},0)}
function orderBooks(g,order){return order==="picked"?g.slice():g.slice().sort(function(a,b){return a-b})}
function schedule(plan){
  if(plan._s)return plan._s;
  var D=plan.days,lists=plan.groups.map(function(g){return unitsOf(orderBooks(g,plan.order))}),days=[];
  for(var d=0;d<D;d++)days.push(lists.map(function(L){var n=L.length;return L.slice(Math.floor(n*d/D),Math.floor(n*(d+1)/D))}));
  plan._s=days;return days;
}
function segs(units){var s=[];units.forEach(function(u){var l=s[s.length-1];if(l&&l.b===u.b)l.units.push(u);else s.push({b:u.b,units:[u]})});return s}
function propRange(u){var f=u[0],l=u[u.length-1],fw=f.v1===1,lw=l.v2===PV[l.c-1];
  if(f.c===l.c)return(fw&&lw)?""+f.c:f.c+":"+f.v1+"\u2013"+l.v2;
  if(fw&&lw)return f.c+"\u2013"+l.c;
  return f.c+":"+f.v1+"\u2013"+l.c+":"+l.v2}
function segLabel(sg){var bn=BOOKS[sg.b][2],u=sg.units;
  if(sg.b===PROV)return bn+" "+propRange(u);
  var a=u[0].c,z=u[u.length-1].c;return bn+" "+(a===z?a:a+"\u2013"+z)}
function itemsText(units){return units.length?segs(units).map(segLabel).join(" \u00b7 "):"Rest day"}
function planDayIndex(plan){return diffDays(todayStr(),plan.start)}
function doneCount(plan){var n=0;for(var k in plan.done)if(plan.done[k])n++;return n}

/* ---------- behind schedule ---------- */
/* first day before today that still has reading and is not checked off; -1 when you are caught up */
function firstMissed(plan){
  var t=Math.min(planDayIndex(plan),plan.days);
  for(var i=0;i<t;i++){if(!plan.done[i]&&dayUnits(plan,i).length)return i}
  return -1;
}
function missedCount(plan){
  var t=Math.min(planDayIndex(plan),plan.days),n=0;
  for(var i=0;i<t;i++){if(!plan.done[i]&&dayUnits(plan,i).length)n++}
  return n;
}
function behindSheet(plan,idx){
  var L=firstMissed(plan),n=missedCount(plan),t=Math.min(planDayIndex(plan),plan.days);
  if(L<0){choosePlayDay(plan,idx);return}
  openSheet(function(box){
    box.appendChild(sheetHead(_("You\u2019ve fallen behind")));
    box.appendChild(h("p",{class:"muted",text:_("It looks like you\u2019ve fallen behind on your Bible reading.")+" "+_f(n===1?"{0} day is not checked off.":"{0} days are not checked off.",[n])}));
    var g=h("div",{style:"display:grid;gap:8px;margin-top:10px"});
    function opt(label,sub,cls,fn){
      g.appendChild(h("button",{class:"btn"+(cls?" "+cls:""),type:"button",style:"flex-direction:column;align-items:flex-start;text-align:left;gap:2px;padding:10px 14px",onclick:fn},[
        h("span",{text:label}),h("span",{class:"small",style:"font-weight:400;opacity:.85",text:sub})]));
    }
    opt("I already read these","Check off every day before today.","",function(){
      completeThrough(plan,t-1);closeSheet();toast("Checked off");refreshPlanViews()});
    opt("Move the plan forward",_f("Today becomes Day {0}. The end date moves later.",[L+1]),"alt",function(){
      plan.start=addDays(plan.start,planDayIndex(plan)-L);viewDay=null;save();closeSheet();toast("Plan moved forward");refreshAll()});
    opt("Go to my first missed day",_f("Catch up by reading Day {0} first.",[L+1]),"alt",function(){
      viewDay=L;closeSheet();renderPlansTab()});
    opt("Just play this day","Leave the earlier days as they are.","ghost",function(){
      closeSheet();choosePlayDay(plan,idx)});
    box.appendChild(g);
  });
}
/* ---------- chapter marks + done circle ---------- */
var fpRebuild=null;
function chKey(d,u){return d+":"+u.b+":"+u.c+":"+(u.v1||0)}
function dayUnits(plan,d){var a=[];(schedule(plan)[d]||[]).forEach(function(g){g.forEach(function(u){a.push(u)})});return a}
function chMark(plan,d,u){return plan.ch&&plan.ch[chKey(d,u)]||""}
function effMark(plan,d,u){var m=chMark(plan,d,u);return !m&&plan.done&&plan.done[d]?"c":m}
function checkChapter(plan,d,u){setMark(plan,d,u,"c");autoDone(plan,d);save()}
function uncheckChapter(plan,d,u){
  if(plan.done[d])dayUnits(plan,d).forEach(function(x){if(!chMark(plan,d,x))setMark(plan,d,x,"c")});
  setMark(plan,d,u,"");plan.done[d]=0;save()}
function setDayDone(plan,d,on){
  dayUnits(plan,d).forEach(function(x){setMark(plan,d,x,on?"c":"")});
  plan.done[d]=on?1:0;save()}
function setMark(plan,d,u,m){if(!plan.ch)plan.ch={};if(m)plan.ch[chKey(d,u)]=m;else delete plan.ch[chKey(d,u)]}
function refreshPlanViews(){renderPlansTab();if(fpRebuild)fpRebuild()}
/* the reader reports a chapter whose audio played to the end: leave a light-green "played" mark in the active plan */
function autoDone(plan,d){
  var us=dayUnits(plan,d);
  if(us.length&&us.every(function(x){var m=chMark(plan,d,x);return m==="p"||m==="c"}))plan.done[d]=1;
}
function markPlayed(b,c){
  var plan=activePlan();if(!plan||plan.completed)return;
  var D=plan.days,t=planDayIndex(plan),cur=viewDay!=null?viewDay:Math.min(Math.max(t,0),D-1),order=[cur],i;
  for(i=cur-1;i>=0;i--)order.push(i);
  for(i=0;i<order.length;i++){
    var d=order[i],us=dayUnits(plan,d).filter(function(u){return u.b===b&&u.c===c});
    if(!us.length)continue;
    us.forEach(function(u){var m=chMark(plan,d,u);if(m!=="c"&&m!=="p")setMark(plan,d,u,"p")});
    autoDone(plan,d);save();return;
  }
}
function markOpenedDay(plan,idx){
  dayUnits(plan,idx).forEach(function(u){if(!chMark(plan,idx,u))setMark(plan,idx,u,"o")});
  save();setTimeout(refreshPlanViews,0);
}
function completeThrough(plan,d){
  for(var i=0;i<=d;i++){dayUnits(plan,i).forEach(function(x){setMark(plan,i,x,"c")});plan.done[i]=1}
  save();
}
function paintPill(el,m,base){
  el.classList.remove("mp","mc","mo");if(m)el.classList.add("m"+m);
  var t=m==="p"?"Played through in the app":m==="c"?"Confirmed":m==="o"?"Opened in another app":"";
  el.setAttribute("aria-label",base+(t?", "+_(t):""));if(t)el.title=_(t);else el.removeAttribute("title");
}
function dayMenu(plan,d,refresh){
  openSheet(function(box){
    box.appendChild(sheetHead(_("Day ")+(d+1)));
    box.appendChild(h("button",{class:"btn",type:"button",style:"width:100%;margin-top:6px",onclick:function(){completeThrough(plan,d);closeSheet();refresh()}},["Mark everything completed up to here"]));
    box.appendChild(h("button",{class:"btn ghost",type:"button",style:"width:100%;margin-top:6px",onclick:closeSheet},["Cancel"]));
  });
}
/* tap: a ring draws itself and the circle turns green. Press and hold on a green circle: it turns red and undraws; let it finish and it goes back to grey. */
function doneCircle(isDone,label,onSet,onClear,small,onMenu){
  var b=h("button",{class:"dcirc"+(small?" sm":"")+(isDone?" on":""),type:"button","aria-pressed":isDone?"true":"false","aria-label":label+(isDone?_(" (press and hold to undo)"):"")},[h("span",{class:"dcin"},[ic("check")])]);
  var raf=0,busy=false,holding=false;
  function ring(p,a){b.style.setProperty("--p",p);b.style.setProperty("--a",a||0)}
  /* both directions go clockwise: drawing moves the leading end round, undoing moves the trailing end round */
  function anim(mode,ms,fin){var t0=performance.now();function f(){var k=Math.min(1,(performance.now()-t0)/ms);if(mode==="draw")ring(100*k,0);else ring(100,100*k);if(k<1)raf=requestAnimationFrame(f);else{raf=0;fin()}}raf=requestAnimationFrame(f)}
  ring(isDone?100:0,0);
  var mt=0,mfired=false;
  function mstop(){clearTimeout(mt);mt=0}
  b.onclick=function(){if(mfired){mfired=false;return}if(isDone||busy)return;busy=true;b.classList.add("trace");anim("draw",450,function(){onSet()})};
  function begin(){if(!isDone||busy||holding)return;holding=true;b.classList.add("hold");anim("undo",800,function(){holding=false;busy=true;onClear()})}
  function abort(){if(!holding)return;holding=false;cancelAnimationFrame(raf);raf=0;b.classList.remove("hold");ring(100,0)}
  b.onpointerdown=function(){mfired=false;begin();if(!isDone&&onMenu&&!busy){mstop();mt=setTimeout(function(){mt=0;mfired=true;onMenu()},500)}};
  b.onpointerup=b.onpointerleave=b.onpointercancel=function(){mstop();abort()};
  b.onkeydown=function(e){if((e.key==="Enter"||e.key===" ")&&!e.repeat&&isDone){e.preventDefault();begin()}};
  b.onkeyup=function(e){if(e.key==="Enter"||e.key===" ")abort()};
  b.oncontextmenu=function(e){e.preventDefault()};
  return b;
}

/* ---------- chapter pills ---------- */
function readUrlV(v,b,c,v1,v2){
  return "https://www.biblegateway.com/passage/?search="+encodeURIComponent(BEN[b]+" "+c+":"+v1+"-"+v2)+"&version="+encodeURIComponent(bgCode(v));
}
function chPill(b,c,u,ctx){
  var v=curVersion(),part=u&&u.v1,sm=ctx&&ctx.sm?" sm":"";
  var label=part?c+":"+u.v1+"\u2013"+u.v2:String(c);
  var base=BOOKS[b][2]+" "+label,unit={b:b,c:c,v1:part?u.v1:0};
  if(!ctx||!ctx.plan){
    if(!(availFor(v,b,false)||availFor(v,b,true)))return h("span",{class:"cp dis"+sm,title:"Not available in this version"},[label]);
    var el0=h("a",{class:"cp"+sm,href:"#",role:"button","aria-label":base},[label]);
    el0.onclick=function(e){e.preventDefault();choosePlayMethod(b,c,u,null)};return el0}
  /* inside a plan a chapter is a check box: tap checks it, tap again unchecks it */
  var el=h("a",{class:"cp pg"+sm,href:"#",role:"button"},[label]);
  function eff(){return effMark(ctx.plan,ctx.d,unit)}
  function on(){var m=eff();return m==="p"||m==="c"}
  paintPill(el,eff(),base);
  el.oncontextmenu=function(e){e.preventDefault()};
  el.onclick=function(e){e.preventDefault();
    if(on())uncheckChapter(ctx.plan,ctx.d,unit);else checkChapter(ctx.plan,ctx.d,unit);
    ctx.refresh()};
  return el;
}
function passageRow(units,color,ctx){
  var body=h("div",{class:"pbody"});
  if(!units.length)body.appendChild(h("div",{class:"prest",text:"Rest day for this group"}));
  else segs(units).forEach(function(sg){
    body.appendChild(h("div",{class:"plabel",text:segLabel(sg)}));
    var p=h("div",{class:"pills2"}),seen={};
    sg.units.forEach(function(u){
      if(sg.b===PROV)p.appendChild(chPill(sg.b,u.c,u,ctx));
      else if(!seen[u.c]){seen[u.c]=1;p.appendChild(chPill(sg.b,u.c,null,ctx))}
    });
    body.appendChild(p);
    if(sg.b===PROV){
      body.appendChild(h("div",{class:"note",style:"margin:0 0 6px",text:"Audio plays the whole chapter."}));
      var seenC={};
      sg.units.forEach(function(u){
        if(seenC[u.c])return;seenC[u.c]=1;
        if(u.v1>1){var pc=Math.max(0,Math.floor((u.v1-1)/PV[u.c-1]*20)*5-5);
          body.appendChild(h("div",{class:"note skip",style:"margin:0 0 6px",text:_f("Chapter {0}: today starts at verse {1}. Skip ahead to about {2}% of the audio (estimated by verse count, set a little early on purpose).",[u.c,u.v1,pc])}))}
      });
    }
  });
  return h("div",{class:"prow"},[h("span",{class:"gdot",style:"background:"+color}),body]);
}
function linkSheet(title,sub,listen,read,back,onGo){
  openSheet(function(box){
    box.appendChild(sheetHead(title));
    if(sub)box.appendChild(h("p",{class:"note",text:sub}));
    function opt(kind,href){
      var isL=kind==="l",lbl=isL?"Listen":"Read",icn=ic(isL?"headphones":"book-2");
      if(typeof href==="function")return h("a",{class:"popt "+kind,href:"#",role:"button",onclick:function(e){e.preventDefault();if(onGo)try{onGo()}catch(x){}href();closeSheet()}},[icn,lbl]);
      if(href)return h("a",{class:"popt "+kind,href:href,target:"_blank",rel:"noopener",onclick:function(){if(onGo)try{onGo()}catch(x){}setTimeout(closeSheet,0)}},[icn,lbl]);
      return h("div",{class:"popt off","aria-disabled":"true"},[icn,lbl+" \u00b7 not available"]);
    }
    box.appendChild(opt("l",listen));
    box.appendChild(opt("r",read));
    if(back)box.appendChild(h("button",{class:"btn ghost",type:"button",style:"margin-top:6px",onclick:back},["Back"]));
  });
}
/* in-app versions open the reader (and start the audio for Listen) instead of an outside site */
/* the reader tells the app when it has loaded or closed, so the Continue reading card stays current */
window.onBBReader=function(what){try{if(what==="opened"&&typeof splashGo==="function")splashGo();renderBibleTab();if(what==="closed")refreshPlanViews()}catch(e){}};
window.onBBChapterDone=function(tr,b,c){try{markPlayed(b,c)}catch(e){}};
function openApp(v,b,c,play,list){
  if(window.BBReader&&BBReader.open(v.app,b,c,{play:!!play,list:list||null}))return;
  toast("The reader could not start. Reload the app and try again.");
}
function choosePlayMethod(b,c,u,back,onGo){
  var v=curVersion(),part=u&&u.v1;
  var label=BOOKS[b][2]+" "+(part?c+":"+u.v1+"\u2013"+u.v2:c);
  if(v.app){closeSheet();openApp(v,b,c,false);return}
  var L=availFor(v,b,false)?chapterUrl(v,b,c):null;
  var R=availFor(v,b,true)?(part?readUrlV(v,b,c,u.v1,u.v2):readUrl(v,b,c)):null;
  linkSheet(label,part?"Audio plays the whole chapter. Read opens just these verses.":"",L,R,back,onGo);
}
function choosePlayDay(plan,idx){
  var v=curVersion(),us=[];
  schedule(plan)[idx].forEach(function(g){g.forEach(function(u){us.push(u)})});
  var title=_f("Day {0} \u00b7 all chapters",[idx+1]);
  if(!us.length){linkSheet(title,"Rest day.",null,null);return}
  var aOK=us.every(function(u){return availFor(v,u.b,false)}),rOK=us.every(function(u){return availFor(v,u.b,true)});
  if(v.app){closeSheet();openApp(v,us[0].b,us[0].c,aOK,us.map(function(u){return{b:u.b,c:u.c}}));return}
  var L=aOK?bgAudioUrl(plan,idx,v):null;
  var R=rOK?"https://www.biblegateway.com/passage/?search="+encodeURIComponent(us.map(function(u){return BEN[u.b]+" "+u.c+(u.v1?":"+u.v1+"-"+u.v2:"")}).join("; "))+"&version="+encodeURIComponent(bgCode(v)):null;
  linkSheet(title,"",L,R,null,function(){markOpenedDay(plan,idx)});
}

var VN={"esv-mclean": ["English Standard Version (ESV)", "Max McLean", 1], "esv-heath": ["English Standard Version (ESV)", "David Cochran Heath", 1], "esv-laughlin": ["English Standard Version (ESV)", "Marquis Laughlin", 1], "niv-mclean": ["New International Version (NIV)", "Max McLean", 1], "niv-dramatized": ["New International Version (NIV)", "Dramatized", 1], "niv-sarris": ["New International Version (NIV)", "George W. Sarris", 1], "nivuk-suchet": ["New International Version UK (NIVUK)", "David Suchet", 1], "kjv-mims": ["King James Version (KJV)", "Paul Mims", 1], "kjv-mclean": ["King James Version (KJV)", "Max McLean", 1], "kjv-dramatized": ["King James Version (KJV)", "Dramatized", 1], "nkjv-bubb": ["New King James Version (NKJV)", "Simon Bubb", 1], "nkjv-laraye": ["New King James Version (NKJV)", "Tinasha LaRaye", 1], "nasb-mcconachie": ["New American Standard Bible (NASB)", "Dale McConachie", 1], "nasb95-mcconachie": ["New American Standard Bible 1995 (NASB1995)", "Dale McConachie", 1], "csb-mohr": ["Christian Standard Bible (CSB)", "Jon Mohr", 1], "hcsb-mcconachie": ["Holman Christian Standard Bible (HCSB)", "Dale McConachie", 1], "nlt-breathe": ["New Living Translation (NLT)", "Breathe", 1], "msg-dolan": ["The Message (MSG)", "Kelly Ryan Dolan", 1], "gnv-cook": ["1599 Geneva Bible (GNV)", "Steve Cook", 1], "leb-logos": ["Lexham English Bible (LEB)", "Logos", 1], "ccb-biblica": ["圣经当代译本·简体 (CCB)", "Biblica", 1], "ccbt-biblica": ["聖經當代譯本·繁體 (CCBT)", "Biblica", 1], "csbs-hao": ["中文标准译本·简体 (CSBS)", "Ran Hao", 1], "csbt-hao": ["中文標準譯本·繁體 (CSBT)", "Ran Hao", 1], "lbla-montoya": ["La Biblia de las Américas (LBLA)", "Samuel Montoya H", 1], "nvi-cruz": ["Nueva Versión Internacional (NVI)", "Rafael Cruz", 1], "nvi-ev": ["Nueva Versión Internacional (NVI)", "Experiencia Viva", 1], "nav-biblica": ["الترجمة العربية الجديدة (NAV)", "Biblica", 1], "nvipt-biblica": ["Nova Versão Internacional (NVI-PT)", "Biblica", 1], "rst-isa": ["Синодальный перевод (RUSV)", "§R · ISA · Digital Bible Society", 1], "rst-fcbh": ["Синодальный перевод (RUSV)", "§D · Faith Comes By Hearing", 1], "nrt-biblica": ["Новый русский перевод (NRT)", "Biblica", 1], "bds-biblica": ["La Bible du Semeur (BDS)", "Biblica", 1], "hof-biblica": ["Hoffnung für Alle (HOF)", "Biblica", 1], "jlb-biblica": ["リビングバイブル (JLB)", "Biblica", 1], "bk-hodul": ["Bible Kralická (BK)", "Joseph Hodul", 1], "farsi-as": ["کتاب مقدس فارسی", "Audio Scriptures", 0], "reimer": ["Reimer 2001 (REIMER)", "Elmer Reimer", 2], "ntlr-biblica": ["Nouă Traducere în Limba Română (NTLR)", "Biblica", 1], "slo1979-hodul": ["SLO1979", "Joseph Hodul", 0], "snt-biblica": ["Agano Jipya (SNT)", "Biblica", 2], "sfb": ["Svenska Folkbibeln (SFB)", "Svenska Folkbibeln", 1], "sfb15": ["Svenska Folkbibeln 2015 (SFB15)", "Svenska Folkbibeln", 1], "tncv-biblica": ["พระคัมภีร์ไทยฉบับร่วมสมัยใหม่ (TNCV)", "Biblica", 1]};
var VK=["ccb", "ccbt", "csbs", "csbt", "lbla", "nvi", "nav", "nvipt", "rusv", "nrt", "bds", "hof", "jlb", "bk", "farsi", "reimer", "ntlr", "slo", "snt", "sfb", "sfb15", "tncv"];
var VKEY={"ccb-biblica": "ccb", "ccbt-biblica": "ccbt", "csbs-hao": "csbs", "csbt-hao": "csbt", "lbla-montoya": "lbla", "nvi-cruz": "nvi", "nvi-ev": "nvi", "nav-biblica": "nav", "nvipt-biblica": "nvipt", "rst-isa": "rusv", "rst-fcbh": "rusv", "nrt-biblica": "nrt", "bds-biblica": "bds", "hof-biblica": "hof", "jlb-biblica": "jlb", "bk-hodul": "bk", "farsi-as": "farsi", "reimer": "reimer", "ntlr-biblica": "ntlr", "slo1979-hodul": "slo", "snt-biblica": "snt", "sfb": "sfb", "sfb15": "sfb15", "tncv-biblica": "tncv"};
var VNAMES={"en": ["Chinese Contemporary Bible, Simplified (CCB)", "Chinese Contemporary Bible, Traditional (CCBT)", "Chinese Standard Bible, Simplified (CSBS)", "Chinese Standard Bible, Traditional (CSBT)", "Bible of the Americas, Spanish (LBLA)", "New International Version, Spanish (NVI)", "New Arabic Version (NAV)", "New International Version, Portuguese (NVI-PT)", "Russian Synodal Version (RUSV)", "New Russian Translation (NRT)", "The Sower’s Bible, French (BDS)", "Hope for All, German (HOF)", "Japanese Living Bible (JLB)", "Kralice Bible, Czech (BK)", "Farsi (Persian) Bible", "Reimer 2001, Plautdietsch (REIMER)", "New Romanian Translation (NTLR)", "Slovak 1979 (SLO1979)", "Swahili New Testament (SNT)", "Swedish People’s Bible (SFB)", "Swedish People’s Bible 2015 (SFB15)", "Thai New Contemporary Bible (TNCV)"], "es": ["Biblia Contemporánea China, simplificada (CCB)", "Biblia Contemporánea China, tradicional (CCBT)", "Biblia Estándar China, simplificada (CSBS)", "Biblia Estándar China, tradicional (CSBT)", "La Biblia de las Américas (LBLA)", "Nueva Versión Internacional (NVI)", "Nueva Versión Árabe (NAV)", "Nueva Versión Internacional, portugués (NVI-PT)", "Versión Sinodal Rusa (RUSV)", "Nueva Traducción Rusa (NRT)", "La Biblia del Sembrador, francés (BDS)", "Esperanza para Todos, alemán (HOF)", "Biblia Viviente Japonesa (JLB)", "Biblia de Kralice, checo (BK)", "Biblia en farsi (persa)", "Reimer 2001, plautdietsch (REIMER)", "Nueva Traducción Rumana (NTLR)", "Eslovaco 1979 (SLO1979)", "Nuevo Testamento en suajili (SNT)", "Biblia del Pueblo Sueca (SFB)", "Biblia del Pueblo Sueca 2015 (SFB15)", "Nueva Biblia Contemporánea Tailandesa (TNCV)"], "fr": ["Bible Contemporaine Chinoise, simplifiée (CCB)", "Bible Contemporaine Chinoise, traditionnelle (CCBT)", "Bible Standard Chinoise, simplifiée (CSBS)", "Bible Standard Chinoise, traditionnelle (CSBT)", "La Bible des Amériques, espagnol (LBLA)", "Nouvelle Version Internationale, espagnol (NVI)", "Nouvelle Version Arabe (NAV)", "Nouvelle Version Internationale, portugais (NVI-PT)", "Version Synodale Russe (RUSV)", "Nouvelle Traduction Russe (NRT)", "La Bible du Semeur (BDS)", "Espoir pour tous, allemand (HOF)", "Bible Vivante Japonaise (JLB)", "Bible de Kralice, tchèque (BK)", "Bible en farsi (persan)", "Reimer 2001, plautdietsch (REIMER)", "Nouvelle Traduction Roumaine (NTLR)", "Slovaque 1979 (SLO1979)", "Nouveau Testament en swahili (SNT)", "Bible du Peuple Suédoise (SFB)", "Bible du Peuple Suédoise 2015 (SFB15)", "Nouvelle Bible Contemporaine Thaïe (TNCV)"], "de": ["Chinesische Zeitgenössische Bibel, vereinfacht (CCB)", "Chinesische Zeitgenössische Bibel, traditionell (CCBT)", "Chinesische Standardbibel, vereinfacht (CSBS)", "Chinesische Standardbibel, traditionell (CSBT)", "Bibel der Amerikas, Spanisch (LBLA)", "Neue Internationale Version, Spanisch (NVI)", "Neue Arabische Version (NAV)", "Neue Internationale Version, Portugiesisch (NVI-PT)", "Russische Synodalübersetzung (RUSV)", "Neue Russische Übersetzung (NRT)", "Die Bibel des Sämanns, Französisch (BDS)", "Hoffnung für Alle (HOF)", "Japanische Lebensbibel (JLB)", "Kralitzer Bibel, Tschechisch (BK)", "Farsi-Bibel (Persisch)", "Reimer 2001, Plautdietsch (REIMER)", "Neue Rumänische Übersetzung (NTLR)", "Slowakisch 1979 (SLO1979)", "Neues Testament auf Suaheli (SNT)", "Schwedische Volksbibel (SFB)", "Schwedische Volksbibel 2015 (SFB15)", "Neue Zeitgenössische Thai-Bibel (TNCV)"], "pt": ["Bíblia Contemporânea Chinesa, simplificada (CCB)", "Bíblia Contemporânea Chinesa, tradicional (CCBT)", "Bíblia Padrão Chinesa, simplificada (CSBS)", "Bíblia Padrão Chinesa, tradicional (CSBT)", "A Bíblia das Américas, espanhol (LBLA)", "Nueva Versión Internacional, espanhol (NVI)", "Nova Versão Árabe (NAV)", "Nova Versão Internacional (NVI-PT)", "Versão Sinodal Russa (RUSV)", "Nova Tradução Russa (NRT)", "A Bíblia do Semeador, francês (BDS)", "Esperança para Todos, alemão (HOF)", "Bíblia Viva Japonesa (JLB)", "Bíblia de Kralice, tcheco (BK)", "Bíblia em farsi (persa)", "Reimer 2001, plautdietsch (REIMER)", "Nova Tradução Romena (NTLR)", "Eslovaco 1979 (SLO1979)", "Novo Testamento em suaíli (SNT)", "Bíblia do Povo Sueca (SFB)", "Bíblia do Povo Sueca 2015 (SFB15)", "Nova Bíblia Contemporânea Tailandesa (TNCV)"], "ru": ["Современная китайская Библия, упрощённая (CCB)", "Современная китайская Библия, традиционная (CCBT)", "Китайская стандартная Библия, упрощённая (CSBS)", "Китайская стандартная Библия, традиционная (CSBT)", "Библия Америк, испанский (LBLA)", "Новая международная версия, испанский (NVI)", "Новый арабский перевод (NAV)", "Новая международная версия, португальский (NVI-PT)", "Синодальный перевод (RUSV)", "Новый русский перевод (NRT)", "Библия Сеятеля, французский (BDS)", "Надежда для всех, немецкий (HOF)", "Японская Живая Библия (JLB)", "Кралицкая Библия, чешский (BK)", "Библия на фарси (персидский)", "Реймер 2001, плаутдич (REIMER)", "Новый румынский перевод (NTLR)", "Словацкий 1979 (SLO1979)", "Новый Завет на суахили (SNT)", "Шведская народная Библия (SFB)", "Шведская народная Библия 2015 (SFB15)", "Новая современная тайская Библия (TNCV)"], "zh": ["圣经当代译本·简体 (CCB)", "圣经当代译本·繁体 (CCBT)", "中文标准译本·简体 (CSBS)", "中文标准译本·繁体 (CSBT)", "美洲圣经，西班牙语 (LBLA)", "新国际版，西班牙语 (NVI)", "新阿拉伯语译本 (NAV)", "新国际版，葡萄牙语 (NVI-PT)", "俄语主教公会译本 (RUSV)", "新俄语译本 (NRT)", "播种者圣经，法语 (BDS)", "万民希望，德语 (HOF)", "日语生活圣经 (JLB)", "克拉利采圣经，捷克语 (BK)", "波斯语圣经", "莱默 2001，低地德语 (REIMER)", "新罗马尼亚语译本 (NTLR)", "斯洛伐克语 1979 (SLO1979)", "斯瓦希里语新约 (SNT)", "瑞典人民圣经 (SFB)", "瑞典人民圣经 2015 (SFB15)", "泰语新当代圣经 (TNCV)"], "ja": ["現代中国語聖書・簡体字 (CCB)", "現代中国語聖書・繁体字 (CCBT)", "中国語標準訳聖書・簡体字 (CSBS)", "中国語標準訳聖書・繁体字 (CSBT)", "アメリカ大陸聖書・スペイン語 (LBLA)", "新国際訳・スペイン語 (NVI)", "新アラビア語訳 (NAV)", "新国際訳・ポルトガル語 (NVI-PT)", "ロシア語シノド訳 (RUSV)", "新ロシア語訳 (NRT)", "種まく人の聖書・フランス語 (BDS)", "すべての人に希望を・ドイツ語 (HOF)", "リビングバイブル (JLB)", "クラリツェ聖書・チェコ語 (BK)", "ペルシア語聖書", "ライマー 2001・低地ドイツ語 (REIMER)", "新ルーマニア語訳 (NTLR)", "スロバキア語 1979 (SLO1979)", "スワヒリ語新約聖書 (SNT)", "スウェーデン民衆聖書 (SFB)", "スウェーデン民衆聖書 2015 (SFB15)", "タイ語新現代聖書 (TNCV)"], "ar": ["الكتاب المقدس المعاصر الصيني، المبسّط (CCB)", "الكتاب المقدس المعاصر الصيني، التقليدي (CCBT)", "الكتاب المقدس الصيني القياسي، المبسّط (CSBS)", "الكتاب المقدس الصيني القياسي، التقليدي (CSBT)", "كتاب الأمريكتين المقدس، الإسبانية (LBLA)", "النسخة الدولية الجديدة، الإسبانية (NVI)", "الترجمة العربية الجديدة (NAV)", "النسخة الدولية الجديدة، البرتغالية (NVI-PT)", "الترجمة السينودسية الروسية (RUSV)", "الترجمة الروسية الجديدة (NRT)", "كتاب الزارع المقدس، الفرنسية (BDS)", "أمل للجميع، الألمانية (HOF)", "الكتاب المقدس الحي الياباني (JLB)", "كتاب كرالتسه المقدس، التشيكية (BK)", "الكتاب المقدس بالفارسية", "رايمر 2001، البلاوتديتش (REIMER)", "الترجمة الرومانية الجديدة (NTLR)", "السلوفاكية 1979 (SLO1979)", "العهد الجديد بالسواحيلية (SNT)", "الكتاب المقدس الشعبي السويدي (SFB)", "الكتاب المقدس الشعبي السويدي 2015 (SFB15)", "الكتاب المقدس التايلاندي المعاصر الجديد (TNCV)"], "fa": ["کتاب مقدس معاصر چینی، ساده‌شده (CCB)", "کتاب مقدس معاصر چینی، سنتی (CCBT)", "کتاب مقدس استاندارد چینی، ساده‌شده (CSBS)", "کتاب مقدس استاندارد چینی، سنتی (CSBT)", "کتاب مقدس امریکاها، اسپانیایی (LBLA)", "نسخهٔ بین‌المللی جدید، اسپانیایی (NVI)", "ترجمهٔ جدید عربی (NAV)", "نسخهٔ بین‌المللی جدید، پرتغالی (NVI-PT)", "ترجمهٔ سینودال روسی (RUSV)", "ترجمهٔ جدید روسی (NRT)", "کتاب مقدس برزگر، فرانسوی (BDS)", "امید برای همه، آلمانی (HOF)", "کتاب مقدس زنده ژاپنی (JLB)", "کتاب مقدس کرالیتسه، چکی (BK)", "کتاب مقدس فارسی", "رایمر ۲۰۰۱، پلاوتدیچ (REIMER)", "ترجمهٔ جدید رومانیایی (NTLR)", "اسلواکی ۱۹۷۹ (SLO1979)", "عهد جدید سواحیلی (SNT)", "کتاب مقدس مردمی سوئدی (SFB)", "کتاب مقدس مردمی سوئدی ۲۰۱۵ (SFB15)", "کتاب مقدس معاصر جدید تایلندی (TNCV)"], "cs": ["Čínská současná Bible, zjednodušená (CCB)", "Čínská současná Bible, tradiční (CCBT)", "Čínská standardní Bible, zjednodušená (CSBS)", "Čínská standardní Bible, tradiční (CSBT)", "Bible Ameriky, španělsky (LBLA)", "Nová mezinárodní verze, španělsky (NVI)", "Nový arabský překlad (NAV)", "Nová mezinárodní verze, portugalsky (NVI-PT)", "Ruský synodální překlad (RUSV)", "Nový ruský překlad (NRT)", "Bible Rozsévače, francouzsky (BDS)", "Naděje pro všechny, německy (HOF)", "Japonská Živá Bible (JLB)", "Bible kralická (BK)", "Bible ve farsí (perština)", "Reimer 2001, plautdietsch (REIMER)", "Nový rumunský překlad (NTLR)", "Slovenština 1979 (SLO1979)", "Nový zákon ve svahilštině (SNT)", "Švédská lidová Bible (SFB)", "Švédská lidová Bible 2015 (SFB15)", "Nová současná thajská Bible (TNCV)"], "sk": ["Čínska súčasná Biblia, zjednodušená (CCB)", "Čínska súčasná Biblia, tradičná (CCBT)", "Čínska štandardná Biblia, zjednodušená (CSBS)", "Čínska štandardná Biblia, tradičná (CSBT)", "Biblia Ameriky, po španielsky (LBLA)", "Nová medzinárodná verzia, po španielsky (NVI)", "Nový arabský preklad (NAV)", "Nová medzinárodná verzia, po portugalsky (NVI-PT)", "Ruský synodálny preklad (RUSV)", "Nový ruský preklad (NRT)", "Biblia Rozsievača, po francúzsky (BDS)", "Nádej pre všetkých, po nemecky (HOF)", "Japonská Živá Biblia (JLB)", "Kralická Biblia, po česky (BK)", "Biblia vo farsi (perzština)", "Reimer 2001, plautdietsch (REIMER)", "Nový rumunský preklad (NTLR)", "Slovenčina 1979 (SLO1979)", "Nový zákon v svahilčine (SNT)", "Švédska ľudová Biblia (SFB)", "Švédska ľudová Biblia 2015 (SFB15)", "Nová súčasná thajská Biblia (TNCV)"], "ro": ["Biblia Contemporană Chineză, simplificată (CCB)", "Biblia Contemporană Chineză, tradițională (CCBT)", "Biblia Standard Chineză, simplificată (CSBS)", "Biblia Standard Chineză, tradițională (CSBT)", "Biblia Americilor, spaniolă (LBLA)", "Noua Versiune Internațională, spaniolă (NVI)", "Noua Versiune Arabă (NAV)", "Noua Versiune Internațională, portugheză (NVI-PT)", "Versiunea Sinodală Rusă (RUSV)", "Noua Traducere Rusă (NRT)", "Biblia Semănătorului, franceză (BDS)", "Speranță pentru toți, germană (HOF)", "Biblia Vie Japoneză (JLB)", "Biblia de la Kralice, cehă (BK)", "Biblia în farsi (persană)", "Reimer 2001, plautdietsch (REIMER)", "Nouă Traducere în Limba Română (NTLR)", "Slovacă 1979 (SLO1979)", "Noul Testament în swahili (SNT)", "Biblia Poporului Suedeză (SFB)", "Biblia Poporului Suedeză 2015 (SFB15)", "Noua Biblie Contemporană Thailandeză (TNCV)"], "sv": ["Kinesisk samtida bibel, förenklad (CCB)", "Kinesisk samtida bibel, traditionell (CCBT)", "Kinesisk standardbibel, förenklad (CSBS)", "Kinesisk standardbibel, traditionell (CSBT)", "Amerikas bibel, spanska (LBLA)", "Nya internationella versionen, spanska (NVI)", "Ny arabisk version (NAV)", "Nya internationella versionen, portugisiska (NVI-PT)", "Rysk synodalöversättning (RUSV)", "Ny rysk översättning (NRT)", "Såningsmannens bibel, franska (BDS)", "Hopp för alla, tyska (HOF)", "Japansk levande bibel (JLB)", "Kralicebibeln, tjeckiska (BK)", "Farsibibel (persiska)", "Reimer 2001, plautdietsch (REIMER)", "Ny rumänsk översättning (NTLR)", "Slovakiska 1979 (SLO1979)", "Nya testamentet på swahili (SNT)", "Svenska Folkbibeln (SFB)", "Svenska Folkbibeln 2015 (SFB15)", "Ny samtida thailändsk bibel (TNCV)"], "sw": ["Biblia ya Kisasa ya Kichina, iliyorahisishwa (CCB)", "Biblia ya Kisasa ya Kichina, ya jadi (CCBT)", "Biblia Sanifu ya Kichina, iliyorahisishwa (CSBS)", "Biblia Sanifu ya Kichina, ya jadi (CSBT)", "Biblia ya Amerika, Kihispania (LBLA)", "Toleo Jipya la Kimataifa, Kihispania (NVI)", "Toleo Jipya la Kiarabu (NAV)", "Toleo Jipya la Kimataifa, Kireno (NVI-PT)", "Tafsiri ya Sinodi ya Kirusi (RUSV)", "Tafsiri Mpya ya Kirusi (NRT)", "Biblia ya Mpanzi, Kifaransa (BDS)", "Tumaini kwa Wote, Kijerumani (HOF)", "Biblia Hai ya Kijapani (JLB)", "Biblia ya Kralice, Kicheki (BK)", "Biblia ya Kifarsi (Kiajemi)", "Reimer 2001, Plautdietsch (REIMER)", "Tafsiri Mpya ya Kiromania (NTLR)", "Kislovakia 1979 (SLO1979)", "Agano Jipya la Kiswahili (SNT)", "Biblia ya Watu ya Kiswidi (SFB)", "Biblia ya Watu ya Kiswidi 2015 (SFB15)", "Biblia Mpya ya Kisasa ya Kithai (TNCV)"], "th": ["พระคัมภีร์จีนร่วมสมัย แบบตัวย่อ (CCB)", "พระคัมภีร์จีนร่วมสมัย แบบตัวเต็ม (CCBT)", "พระคัมภีร์จีนมาตรฐาน แบบตัวย่อ (CSBS)", "พระคัมภีร์จีนมาตรฐาน แบบตัวเต็ม (CSBT)", "พระคัมภีร์แห่งอเมริกา ภาษาสเปน (LBLA)", "ฉบับสากลใหม่ ภาษาสเปน (NVI)", "ฉบับอาหรับใหม่ (NAV)", "ฉบับสากลใหม่ ภาษาโปรตุเกส (NVI-PT)", "ฉบับซีโนดัลรัสเซีย (RUSV)", "ฉบับแปลรัสเซียใหม่ (NRT)", "พระคัมภีร์ผู้หว่าน ภาษาฝรั่งเศส (BDS)", "ความหวังสำหรับทุกคน ภาษาเยอรมัน (HOF)", "พระคัมภีร์ญี่ปุ่นฉบับชีวิต (JLB)", "พระคัมภีร์คราลิตเซ ภาษาเช็ก (BK)", "พระคัมภีร์ภาษาเปอร์เซีย", "ไรเมอร์ 2001 ภาษาเยอรมันต่ำ (REIMER)", "ฉบับแปลโรมาเนียใหม่ (NTLR)", "สโลวัก 1979 (SLO1979)", "พันธสัญญาใหม่ภาษาสวาฮีลี (SNT)", "พระคัมภีร์ประชาชนสวีเดน (SFB)", "พระคัมภีร์ประชาชนสวีเดน 2015 (SFB15)", "พระคัมภีร์ไทยฉบับร่วมสมัยใหม่ (TNCV)"], "pdt": ["Chinesische Zeitgenössische Bibel, vereinfacht (CCB)", "Chinesische Zeitgenössische Bibel, traditionell (CCBT)", "Chinesische Standardbibel, vereinfacht (CSBS)", "Chinesische Standardbibel, traditionell (CSBT)", "Bibel der Amerikas, Spanisch (LBLA)", "Neue Internationale Version, Spanisch (NVI)", "Neue Arabische Version (NAV)", "Neue Internationale Version, Portugiesisch (NVI-PT)", "Russische Synodalübersetzung (RUSV)", "Neue Russische Übersetzung (NRT)", "Die Bibel des Sämanns, Französisch (BDS)", "Hoffnung für Alle (HOF)", "Japanische Lebensbibel (JLB)", "Kralitzer Bibel, Tschechisch (BK)", "Farsi-Bibel (Persisch)", "Reimer 2001, Plautdietsch (REIMER)", "Neue Rumänische Übersetzung (NTLR)", "Slowakisch 1979 (SLO1979)", "Neues Testament auf Suaheli (SNT)", "Schwedische Volksbibel (SFB)", "Schwedische Volksbibel 2015 (SFB15)", "Neue Zeitgenössische Thai-Bibel (TNCV)"]};
var VRD={"en":["Reader","Dramatized"]};
/* in-app reader versions: name, label under it, text level (1 = whole Bible) */
VN["app-kjv"]=["King James Version (KJV)","In-app reader",1];
VN["app-web"]=["World English Bible (WEB)","In-app reader",1];
VN["app-bsb"]=["Berean Standard Bible (BSB)","In-app reader",1];
VN["app-asv"]=["American Standard Version (ASV)","In-app reader",1];
VN["app-darby"]=["Darby Translation (DBY)","In-app reader",1];
VN["app-webster"]=["Webster\u2019s Bible (WBS)","In-app reader",1];
VN["app-ylt"]=["Young\u2019s Literal Translation (YLT)","In-app reader",1];
VN["app-rst"]=["\u0421\u0438\u043d\u043e\u0434\u0430\u043b\u044c\u043d\u044b\u0439 \u043f\u0435\u0440\u0435\u0432\u043e\u0434 (RST)","In-app reader",1];
VN["app-rv1909"]=["Reina-Valera 1909 (RV1909)","In-app reader",1];
VERSIONS.forEach(function(v){if(v.bgn)VN[v.id]=[v.bgn,"BibleGateway",v.bgl]});
function vName(v){var k=VKEY[v.id];if(k){var tb=VNAMES[uiLang()]||VNAMES.en;return tb[VK.indexOf(k)]}var x=VN[v.id];return x?x[0]:v.label}
function vReader(v){var x=VN[v.id];if(!x)return "";var rd=VRD[uiLang()]||VRD.en;return _(x[1]).replace("\u00a7R",rd[0]).replace("\u00a7D",rd[1])}
function vTextLevel(v){var x=VN[v.id];return x?x[2]:1}
function vTitle(v){var r=vReader(v);return vName(v)+(r?" \u00b7 "+r:"")}
function audioLevel(v){return v.noaudio?0:(v.nt?2:1)}
function availFor(v,b,rd){var f=rd?vTextLevel(v):audioLevel(v);return f===1||(f===2&&b>=OT_COUNT)||(f===3&&b<OT_COUNT)}
function vBadge(kind,level){
  var on=level>0,tip=_(kind==="text"?"Text":"Audio")+(on?(level===2?" ("+_("NT")+")":level===3?" ("+_("OT")+")":""):" \u2013 "+_("Not available"));
  var b=h("span",{class:"vb "+(on?"on":"off"),title:tip,"aria-label":tip,role:"img"},[ic(kind==="text"?"book-2":"headphones")]);
  if(on&&level>=2)b.appendChild(h("span",{class:"nt",text:_(level===3?"OT":"NT"),"aria-hidden":"true"}));
  return b;
}
function ntNote(){var v=curVersion(),t=vTextLevel(v),m=[];
  if(v.nt)m.push("Audio covers the New Testament only.");
  if(t===2)m.push("Text covers the New Testament only.");
  if(t===3)m.push("Text covers the Old Testament only.");
  if(v.noaudio)m.push("No audio is available.");
  if(t===0)m.push("No text is available.");
  return m.length?h("p",{class:"note",text:m.join(" ")+" Unavailable options are grayed out."}):null}

/* ---------- shared controls (both tabs) ---------- */
function renderControls(){
  var el=$("ctl");el.innerHTML="";
  var v=curVersion(),L=langById(state.prefs.lang);
  el.appendChild(h("div",{class:"icard"},[
    h("button",{class:"irow",type:"button",onclick:openLang},[h("img",{class:"rico",src:RICO.lang,alt:""}),h("span",{class:"rt"},[h("small",{text:"Bible language"}),h("b",{dir:"auto",text:state.prefs.all?"\ud83c\udf10 "+_("All languages"):L.flag+" "+L.nat+(L.nat!==L.en?" \u00b7 "+L.en:"")})]),ic("chevron-right")]),
    h("button",{class:"irow",type:"button",onclick:openVersions},[h("img",{class:"rico",src:RICO.ver,alt:""}),h("span",{class:"rt"},[h("small",{text:"Bible version"}),h("b",{dir:"auto",text:vTitle(v)})]),ic("chevron-right")]),
    h("button",{class:"irow",type:"button",onclick:function(){openLang({mode:"ui"})}},[h("img",{class:"rico",src:RICO.ui,alt:""}),h("span",{class:"rt"},[h("small",{text:"Language"}),h("b",{dir:"auto",text:langById(uiLang()).flag+" "+langById(uiLang()).nat})]),ic("chevron-right")])
  ]));

  var nn=ntNote();if(nn)el.appendChild(nn);
}

/* ---------- Reading plans tab ---------- */
function planSub(p){return _f(p.groups.length===1?"{0} days \u00b7 {1} group":"{0} days \u00b7 {1} groups",[p.days,p.groups.length])}
function verRow(){var v=curVersion();return h("button",{class:"verrow",type:"button",onclick:openVersions},[h("small",{text:"Bible version"}),h("b",{dir:"auto",text:vTitle(v)}),ic("chevron-down")])}
function nextActive(){var n=state.plans.filter(function(p){return !p.completed})[0];state.active=n?n.id:null}
function planCard(p){
  var dc2=doneCount(p),act=p.id===state.active&&!p.completed;
  return h("button",{class:"pcard",type:"button",onclick:function(){planSheet(p.id)}},[
    h("div",{class:"n"},[p.name,act?h("span",{class:"badge",text:"Active"}):null,p.completed?h("span",{class:"badge",text:"Completed"}):null]),
    h("div",{class:"s",text:planSub(p)+_(" \u00b7 starts ")+niceY(p.start)+" \u00b7 "+dc2+_(" of ")+p.days+_(" days done")}),
    h("div",{class:"bar"},[h("div",{style:"width:"+Math.round(dc2/p.days*100)+"%"})])]);
}
function planSheet(id){
  var p=state.plans.filter(function(x){return x.id===id})[0];if(!p)return;
  var act=p.id===state.active&&!p.completed;
  openSheet(function(box){
    box.appendChild(sheetHead(p.name));
    box.appendChild(h("p",{class:"muted small",text:planSub(p)+" \u00b7 "+doneCount(p)+_(" of ")+p.days+_(" days done")}));
    var g=h("div",{style:"display:grid;gap:8px;margin-top:6px"});
    if(!p.completed&&!act)g.appendChild(h("button",{class:"btn",type:"button",onclick:function(){state.active=p.id;viewDay=null;save();closeSheet();refreshAll();toast("Set as active plan")}},["Set as active"]));
    g.appendChild(h("button",{class:"btn alt",type:"button",onclick:function(){closeSheet();openBuilderFor("edit-plan",p)}},[ic("edit"),"Edit"]));
    if(!p.completed)g.appendChild(h("button",{class:"btn alt",type:"button",onclick:function(){p.completed=todayStr();if(state.active===p.id)nextActive();viewDay=null;save();closeSheet();refreshAll();toast("Moved to completed plans")}},["Mark as completed"]));
    else g.appendChild(h("button",{class:"btn alt",type:"button",onclick:function(){delete p.completed;if(!state.active)state.active=p.id;save();closeSheet();refreshAll();toast("Moved back to in progress")}},["Move back to in progress"]));
    g.appendChild(h("button",{class:"btn danger",type:"button",onclick:function(){closeSheet();confirmSheet("Delete plan?","\u201c"+p.name+_("\u201d and its progress will be removed."),"Delete plan",true,function(){
      state.plans=state.plans.filter(function(x){return x.id!==p.id});if(state.active===p.id)nextActive();viewDay=null;save();refreshAll();toast("Plan deleted")})}},[ic("trash"),"Delete"]));
    box.appendChild(g);
  });
}
function customCard(c){
  return h("button",{class:"pcard",type:"button",onclick:function(){customSheet(c.id)}},[
    h("div",{class:"n",text:c.name}),h("div",{class:"s",text:planSub(c)})]);
}
function customSheet(id){
  var c=state.customs.filter(function(x){return x.id===id})[0];if(!c)return;
  openSheet(function(box){
    box.appendChild(sheetHead(c.name));
    box.appendChild(h("p",{class:"muted small",text:planSub(c)}));
    var g=h("div",{style:"display:grid;gap:8px;margin-top:6px"});
    g.appendChild(h("button",{class:"btn",type:"button",onclick:function(){closeSheet();startPresetSheet({name:c.name,desc:planSub(c),days:c.days,order:c.order,groups:c.groups})}},["Start plan"]));
    g.appendChild(h("button",{class:"btn alt",type:"button",onclick:function(){closeSheet();openBuilderFor("edit-custom",c)}},[ic("edit"),"Edit"]));
    g.appendChild(h("button",{class:"btn danger",type:"button",onclick:function(){closeSheet();confirmSheet("Delete custom plan?","\u201c"+c.name+_("\u201d will be removed from your custom plans. Plans you already started from it are not affected."),"Delete",true,function(){
      state.customs=state.customs.filter(function(x){return x.id!==c.id});save();refreshAll();toast("Custom plan deleted")})}},[ic("trash"),"Delete"]));
    box.appendChild(g);
  });
}
function renderPlansTab(){
  var el=$("tab-plans");el.innerHTML="";
  var plan=activePlan();
  if(plan&&plan.completed)plan=null;
  if(!plan){
    el.appendChild(h("div",{class:"card"},[h("div",{class:"plabel",text:"No active plan"}),h("p",{class:"muted small",text:"Start a ready-made plan below or build your own with up to five groups of books."})]));
  }else{
    var D=plan.days,today=planDayIndex(plan),idx=viewDay!=null?viewDay:Math.min(Math.max(today,0),D-1);
    var sched=schedule(plan)[idx],isDone=!!plan.done[idx];
    var status=today<0?_("Starts ")+nice(plan.start):(today>=D&&viewDay==null?_("Plan ended ")+nice(addDays(plan.start,D-1)):(idx===today?_("Today"):(idx<today?_("Earlier day"):_("Coming up"))));
    var card=h("div",{class:"card"});
    card.appendChild(h("div",{class:"dayhead"},[
      h("button",{class:"dnav",type:"button","aria-label":"Previous day",disabled:idx===0?"":null,onclick:function(){viewDay=idx-1;renderPlansTab()}},[ic("chevron-left")]),
      h("div",{class:"mid"},[h("div",{class:"nm"},[plan.name,h("span",{class:"badge",style:"margin-left:8px;vertical-align:middle",text:"Active"})]),h("div",{class:"muted small",text:_("Day ")+(idx+1)+_(" of ")+D+" \u00b7 "+nice(addDays(plan.start,idx))+" \u00b7 "+status})]),
      h("button",{class:"dnav",type:"button","aria-label":"Next day",disabled:idx>=D-1?"":null,onclick:function(){viewDay=idx+1;renderPlansTab()}},[ic("chevron-right")])
    ]));
    var behind=firstMissed(plan)>=0;
    var play=h("button",{class:"btn"+(behind?" behind":""),type:"button",style:"width:100%",onclick:function(){if(firstMissed(plan)>=0)behindSheet(plan,idx);else choosePlayDay(plan,idx)}},[
      behind?h("span",{class:"bhic",role:"img","aria-label":_("You\u2019ve fallen behind")},[ic("alert-circle")]):null,"▶︎ Play all chapters"]);
    var circ=doneCircle(isDone,_f("Day {0} complete",[idx+1]),function(){setDayDone(plan,idx,true);renderPlansTab()},function(){setDayDone(plan,idx,false);renderPlansTab()},false,function(){dayMenu(plan,idx,renderPlansTab)});
    card.appendChild(h("div",{style:"margin-top:8px"},[play]));
    var rows=h("div",{style:"margin-top:8px"});
    var ctx={plan:plan,d:idx,refresh:renderPlansTab};
    sched.forEach(function(units,gi){rows.appendChild(passageRow(units,GCOLORS[gi%GCOLORS.length],ctx))});
    card.appendChild(rows);
    card.appendChild(h("p",{class:"muted small",style:"margin:6px 2px 0",text:"Tap a chapter to check it. Tap it again to uncheck it."}));
    card.appendChild(h("div",{class:"dcwrap"},[circ]));
    var dc=doneCount(plan);
    card.appendChild(h("div",{style:"margin-top:14px"},[
      h("div",{style:"display:flex;justify-content:space-between;margin-bottom:6px"},[h("b",{class:"small",text:"Plan progress"}),h("span",{class:"muted small",text:dc+_(" of ")+D+_(" days")})]),
      h("div",{class:"bar"},[h("div",{style:"width:"+Math.round(dc/D*100)+"%"})])]));
    if(dc>=D)card.appendChild(h("button",{class:"btn alt sm",type:"button",style:"width:100%;margin-top:12px",onclick:function(){plan.completed=todayStr();nextActive();viewDay=null;save();refreshAll();toast("Moved to completed plans")}},["Move to completed plans"]));
    card.appendChild(h("div",{style:"display:flex;gap:8px;margin-top:12px"},[
      idx!==Math.min(Math.max(today,0),D-1)?h("button",{class:"btn alt sm",type:"button",style:"flex:1",onclick:function(){viewDay=null;renderPlansTab()}},["Go to today"]):null,
      h("button",{class:"btn ghost sm",type:"button",style:"flex:1",onclick:function(){fullPlanView(plan.id)}},["View full plan"])]));
    el.appendChild(card);
  }
  var prog=state.plans.filter(function(p){return !p.completed}),comp=state.plans.filter(function(p){return p.completed});
  el.appendChild(h("h2",{class:"sec",text:"In progress"}));
  if(!prog.length)el.appendChild(h("p",{class:"note",text:"Nothing in progress."}));
  prog.forEach(function(p){el.appendChild(planCard(p))});
  if(comp.length){el.appendChild(h("h2",{class:"sec",text:"Completed plans"}));comp.forEach(function(p){el.appendChild(planCard(p))})}
  el.appendChild(h("h2",{class:"sec",text:"Custom plans"}));
  state.customs.forEach(function(c){el.appendChild(customCard(c))});
  el.appendChild(h("button",{class:"newplan",type:"button",onclick:openBuilder},[ic("plus"),"Create your custom plan"]));
  el.appendChild(h("h2",{class:"sec",text:"Ready-made plans"}));
  var pv=curVersion();
  PCATS.forEach(function(ct){
    el.appendChild(h("h3",{class:"psub",text:ct[1]}));
    PRESETS.filter(function(p){return p.cat===ct[0]}).forEach(function(p){
      var okA=p.groups.every(function(g){return g.every(function(b){return availFor(pv,b,false)})}),okR=p.groups.every(function(g){return g.every(function(b){return availFor(pv,b,true)})}),ok=okA||okR;
      var kids=[h("div",{class:"n",text:p.name}),h("div",{class:"s",text:p.days+_(" days \u00b7 ")+_(p.desc)})];
      if(!ok)kids.push(h("div",{class:"s dimnote",text:"Includes books this version doesn\u2019t have. Switch version to use them."}));else if(!okA||!okR)kids.push(h("div",{class:"s dimnote",text:_(okA?"Some books have no text in this version.":"Some books have no audio in this version.")}));
      el.appendChild(h("button",{class:"pcard"+(ok?"":" pdim"),type:"button",onclick:function(){startPresetSheet(p)}},kids));
    });
  });
  el.appendChild(h("div",{class:"foot"},[h("button",{class:"linkbtn",type:"button",onclick:function(){confirmSheet("Reset plans?","This removes all your plans and progress.","Reset",true,function(){state=seed();viewDay=null;save();refreshAll();toast("Reset")})}},["Reset plans"])]));
}

/* ---------- Whole Bible tab ---------- */
function renderBibleTab(){
  var el=$("tab-bible");el.innerHTML="";
  var v=curVersion();
  var ql=query.trim().toLowerCase(),shown=[0,0];
  var gOT=h("div",{class:"grid"}),gNT=h("div",{class:"grid"});
  BOOKS.forEach(function(b,i){
    var isOT=i<OT_COUNT;
    if(ql&&(b[2].toLowerCase().indexOf(ql)<0&&BEN[i].toLowerCase().indexOf(ql)<0))return;
    shown[isOT?0:1]++;
    var btn=h("button",{class:"book",type:"button",style:"--c:"+COLORS[i%COLORS.length]+";background-image:url("+TILES[i]+")"});
    btn.appendChild(h("img",{src:BOOKICONS[i].src,alt:"",width:"36",height:"36"}));
    btn.appendChild(h("span",{class:"bn",text:b[2]}));
    if(!(availFor(v,i,false)||availFor(v,i,true)))btn.disabled=true;else btn.onclick=function(){openChapters(i)};
    (isOT?gOT:gNT).appendChild(btn);
  });
  var sb=h("button",{class:"sbtn",type:"button",onclick:function(){var r=$("srow");r.hidden=!r.hidden;if(r.hidden){query="";renderBibleTab()}else $("q").focus()}},[ic("search"),"Search"]);
  var inp=h("input",{type:"search",id:"q",placeholder:"Search books",autocomplete:"off","aria-label":"Search books",value:query,oninput:function(){query=this.value;var pos=this.selectionStart;renderBibleTab();var q=$("q");q.focus();try{q.setSelectionRange(pos,pos)}catch(e){}}});
  var srow=h("div",{class:"searchrow",id:"srow"},[inp]);srow.hidden=!query;
  var sv=window.BBReader&&BBReader.saved();
  if(sv&&!ql){
    var sver=VERSIONS.filter(function(x){return x.app===sv.tr})[0];
    el.appendChild(h("button",{class:"pcard",type:"button",onclick:function(){BBReader.open(sv.tr,sv.b,sv.c,{resume:true})}},[
      h("div",{class:"n",text:"Continue reading"}),
      h("div",{class:"s",dir:"auto",text:_(BEN[sv.b])+" "+sv.c+(sver?" \u00b7 "+vName(sver):"")})]));
  }
  el.appendChild(h("div",{class:"sh"},[h("h2",{text:shown[0]||!shown[1]?"Old Testament":"Search"}),h("span",{class:"ln"}),sb]));
  el.appendChild(srow);
  if(shown[0])el.appendChild(gOT);
  if(shown[1]){el.appendChild(h("div",{class:"sh"},[h("h2",{text:"New Testament"}),h("span",{class:"ln"})]));el.appendChild(gNT)}
  if(!shown[0]&&!shown[1])el.appendChild(h("p",{class:"note",text:"No books match your search."}));
}

/* ---------- sheets ---------- */
var lastFocus=null;
function openSheet(build){lastFocus=document.activeElement;var b=$("sheetBox");b.innerHTML="";build(b);$("overlay").classList.add("show");$("overlay").setAttribute("aria-hidden","false");b.scrollTop=0}
function closeSheet(){$("overlay").classList.remove("show");$("overlay").setAttribute("aria-hidden","true");if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){}}
$("overlay").onclick=function(e){if(e.target===$("overlay"))closeSheet()};
document.addEventListener("keydown",function(e){if(e.key==="Escape"){if($("overlay").classList.contains("show"))closeSheet();else if(!$("screen").hidden)hideScreen()}});
function sheetHead(title,icon){return h("div",{class:"shead"},[h("div",{class:"st"},[icon?h("img",{class:"rico",src:icon,alt:""}):null,h("span",{text:title})]),h("button",{class:"xbtn",type:"button","aria-label":"Close",onclick:closeSheet},[ic("x")])])}

function openChapters(i){
  var b=BOOKS[i],v=curVersion();
  openSheet(function(box){
    var ban=h("div",{class:"banner",style:"--c:"+COLORS[i%COLORS.length]+";background-image:url("+TILES[i]+")"},[
      h("div",{class:"bh"},[h("img",{src:BOOKICONS[i].src,alt:""}),h("div",{class:"st",text:b[2]})]),
      h("button",{class:"xbtn",type:"button","aria-label":"Close",onclick:closeSheet,style:"background:rgba(255,255,255,.92);color:#10294a"},[ic("x")])
    ]);
    box.appendChild(ban);
    box.appendChild(h("p",{class:"note",text:"Choose a chapter, then pick Listen or Read."}));
    var g=h("div",{class:"cgrid"});
    for(var c=1;c<=b[1];c++)(function(ch){
      g.appendChild(h("a",{class:"cnum",href:"#",role:"button","aria-label":b[2]+" "+ch,text:String(ch),onclick:function(e){e.preventDefault();choosePlayMethod(i,ch,null,function(){openChapters(i)})}}));
    })(c);
    box.appendChild(g);
  });
}
function openLang(opts){
  var mode=(opts&&opts.splash===true)?"splash":(opts&&opts.mode)||"audio";
  openSheet(function(box){
    box.appendChild(sheetHead(mode==="splash"?tx("choose"):mode==="ui"?"Language":"Bible language",mode==="splash"?null:mode==="ui"?RICO.ui:RICO.lang));
    var pool=mode==="ui"?allLangs().filter(function(l){return !NOUI[l.id]}):allLangs();
    var top=pool.filter(function(l){return l.top}),rest=pool.filter(function(l){return !l.top}).sort(function(a,b){return a.en.localeCompare(b.en)});
    if(mode==="audio"){
      box.appendChild(h("button",{class:"lrow",type:"button","aria-pressed":!!state.prefs.all,onclick:function(){state.prefs.all=true;save();closeSheet();refreshAll()}},[
        h("span",{class:"flag",text:"🌐","aria-hidden":"true"}),
        h("span",{class:"names"},[h("div",{class:"nat",text:"All languages"}),h("div",{class:"sec",text:"Every language and version"})]),
        state.prefs.all?h("span",{class:"tick",text:"✓","aria-hidden":"true"}):null]));
    }
    [[mode==="splash"?null:"Popular languages",top],[mode==="splash"?null:"All other languages",rest]].forEach(function(sec){
      if(sec[0])box.appendChild(h("div",{class:"lhead",text:sec[0]}));
      sec[1].forEach(function(l){
        var on=l.id===(mode==="audio"?(state.prefs.all?"":state.prefs.lang):uiLang());
        var pack=mode!=="audio"&&l.id!=="en"&&!NOUI[l.id];   /* a menu language that is downloaded on demand */
        var sub=mode==="splash"?NOUI[l.id]:null,uid=NOUI[l.id]||l.id;   /* menus not translated yet: shown greyed, with a substitute language */
        var row,btn=null;
        function go(){
          if(mode==="splash"||mode==="ui")lpSetUi(uid);
          if(mode==="splash"||mode==="audio"){state.prefs.all=false;state.prefs.lang=l.id;state.prefs.ver=(versionsFor(l.id).filter(function(v){return !v.nt})[0]||versionsFor(l.id)[0]).id}
          save();closeSheet();refreshAll();if(mode==="splash"&&opts.onDone)opts.onDone()}
        function paint(){if(btn){btn.innerHTML="";btn.appendChild(dlIcon(lpHas(l.id)?"full":"none",0))}}
        function pick(){
          var need=pack?l.id:(sub&&sub!=="en"?sub:null);
          if(!need||lpLoaded[need]){go();return}
          if(row._busy)return;row._busy=true;row.style.opacity=".6";
          if(btn){btn.innerHTML="";btn.appendChild(dlIcon("part",.45))}
          toast("Downloading…");
          lpEnsure(need).then(function(ok){
            row._busy=false;row.style.opacity=sub?".55":"";paint();
            if(ok)go();else toast("Couldn't download this language. Check your connection and try again.");
          });
        }
        row=h("button",{class:"lrow",type:"button","aria-pressed":on,onclick:pick},[
          h("span",{class:"flag",text:l.flag,"aria-hidden":"true"}),
          h("span",{class:"names"},[h("div",{class:"nat",dir:"auto",text:l.nat}),l.nat!==l.en?h("div",{class:"sec",text:l.en}):null,sub?h("div",{class:"sec",dir:"auto",text:NOUIN[sub]}):null]),
          on?h("span",{class:"tick",text:"✓","aria-hidden":"true"}):null]);
        if(sub)row.style.opacity=".55";
        if(!pack){box.appendChild(row);return}
        btn=h("button",{class:"dlbtn"+(mode==="splash"?" off":""),type:"button","aria-label":l.en,onclick:function(){
          if(mode==="ui"&&lpHas(l.id)){
            confirmSheet(l.nat,"Remove this language from this device? You can download it again later.","Remove",true,function(){
              var wasCur=l.id===uiLang();
              lpRemove(l.id).then(function(){if(wasCur){lpSetUi("en");refreshAll()}openLang({mode:"ui"})});
            });
          }else pick();
        }},[dlIcon(lpHas(l.id)?"full":"none",0)]);
        box.appendChild(h("div",{class:"vwrap"},[row,btn]));
      });
    });
  });
}

/* ---------- downloads: keep a translation on this device (text and audio apart, only when asked) ---------- */
function dlIcon(state,f){
  var C=62.83,col=state==="full"?"#2e8b57":state==="part"?"#2f6fdb":"currentColor";
  var ring=state==="full"?'<circle cx="12" cy="12" r="10.5" fill="#2e8b57" stroke="none"/>':
    '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="'+(state==="off"?".25":".3")+'"/>'+
    (state==="part"?'<circle cx="12" cy="12" r="10" stroke="#2f6fdb" stroke-width="2.6" stroke-dasharray="'+(Math.max(.06,f)*C).toFixed(1)+' '+C+'" transform="rotate(-90 12 12)"/>':"");
  var mark=state==="full"?'<path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" stroke-width="2.4"/>':
    '<path d="M12 7v8m-3.5-3.2L12 15.3l3.5-3.5" stroke="'+col+'" stroke-width="2"/>';
  return h("span",{class:"dli "+state,html:'<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ring+mark+'</svg>'});
}
/* Saved record of what is downloaded, so the version list shows the right icons instantly.
   A quiet background scan re-checks real storage and corrects the record if anything changed. */
var DLREC_KEY="bb_dlrec",dlBtns={},dlScanning=false,dlScanAt=0;
function dlRecGet(){try{return JSON.parse(localStorage.getItem(DLREC_KEY)||"{}")||{}}catch(e){return{}}}
function dlRecSet(id,q){
  try{var r=dlRecGet(),o=r[id]||{};
    q={text:q.text,audio:q.audio==null?o.audio:q.audio,total:q.total||o.total||1189};
    if(o.text===q.text&&o.total===q.total&&o.audio===q.audio)return false;
    r[id]=q;localStorage.setItem(DLREC_KEY,JSON.stringify(r));
  }catch(e){}
  dlBtnsPaint(id);return true;
}
function dlBtnPaint(btn,q){
  if(!btn||!q)return;
  var st=q.text>=q.total?"full":q.text>0?"part":"none";
  if(btn._st===st+":"+q.text)return;btn._st=st+":"+q.text;
  btn.innerHTML="";btn.appendChild(dlIcon(st,q.text/q.total));
}
function dlBtnsPaint(id){
  var q=dlRecGet()[id],a=dlBtns[id]||[];if(!q)return;
  dlBtns[id]=a.filter(function(b){return b.isConnected});
  dlBtns[id].forEach(function(b){dlBtnPaint(b,q)});
}
function dlAudioBusy(){
  try{var a=document.getElementsByTagName("audio");for(var i=0;i<a.length;i++)if(!a[i].paused&&!a[i].ended)return true}catch(e){}
  return false;
}
function dlScanAll(force){
  var dl=window.BBReader&&BBReader.dl;
  if(!dl||dlScanning||(!force&&Date.now()-dlScanAt<60000))return;
  var ids=[];VERSIONS.forEach(function(v){if(v.app&&ids.indexOf(v.app)<0)ids.push(v.app)});
  dlScanning=true;
  (function next(i){
    if(i>=ids.length){dlScanning=false;dlScanAt=Date.now();return}
    if(dlAudioBusy()){setTimeout(function(){next(i)},8000);return}
    dl.quick(ids[i]).then(function(q){dlRecSet(ids[i],q)},function(){}).then(function(){setTimeout(function(){next(i+1)},150)});
  })(0);
}
function dlScanSoon(ms){setTimeout(function(){
  var go=function(){dlScanAll(false)};
  if(window.requestIdleCallback)requestIdleCallback(go,{timeout:5000});else go();
},ms)}
function dlCount(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,",")}
function openDownloads(v,view){
  var dl=window.BBReader&&BBReader.dl,id=v.app,tok="dl"+Date.now(),st=null,sel={},open={},mode=view||{k:"main"},manual=(id==="kjv"),imp=null;
  function mine(){var b=$("sheetBox");return $("overlay").classList.contains("show")&&b.getAttribute("data-dl")===tok}
  function onJob(){if(!mine()){dl.off(onJob);return}refresh()}
  function refresh(){dl.status(id).then(function(x){st=x;try{dlRecSet(id,{text:x.text.done})}catch(e){}paint()},function(){st=null;paint(true)})}
  function kindName(k){return k==="text"?"Text":"Audio"}
  function startKind(k,pairs){
    if(k==="audio"&&!(mode.warned)){mode={k:"warn",kind:k,pairs:pairs};paint();return}
    dl.start(id,k,pairs)
  }
  function pairsFromSel(k){
    var out=[];Object.keys(sel).forEach(function(key){if(sel[key]){var a=key.split(".");out.push([+a[0],+a[1]])}});
    out.sort(function(x,y){return x[0]-y[0]||x[1]-y[1]});return out;
  }
  function bar(done,total,running){
    var f=total?done/total:0;
    return h("div",{class:"dlbar"+(done>=total&&total?" full":"")},[h("i",{style:"width:"+Math.round(f*100)+"%"})]);
  }
  function section(k){
    var d=st[k],j=dl.job(id,k),box=h("div",{class:"dlsec"});
    box.appendChild(h("div",{class:"dlh"},[h("b",{text:kindName(k)}),h("span",{text:d.done>=d.total?_f("All {0} chapters saved",[dlCount(d.total)]):_f("{0} of {1} chapters saved",[dlCount(d.done),dlCount(d.total)])})]));
    box.appendChild(bar(d.done,d.total));
    if(j&&j.running)box.appendChild(h("p",{class:"note",text:_f("Saving {0} \u00b7 {1} of {2} this round",[BOOKS[j.at?j.at[0]:0][2]+" "+(j.at?j.at[1]:""),dlCount(j.i),dlCount(j.total)])}));
    if(j&&j.finished&&j.skipped&&j.skipped.length)box.appendChild(h("p",{class:"note",text:_f(j.skipped.length===1?"Skipped {0} chapter the audio host doesn't have: {1}.":"Skipped {0} chapters the audio host doesn't have: {1}.",[j.skipped.length,j.skipped.slice(0,4).map(function(p){return BOOKS[p[0]][2]+" "+p[1]}).join(", ")])}));
    if(j&&j.error){
      var msg=j.error==="full"?"The device ran out of storage space for this. What's already saved is kept.":
        j.error==="offline"?"No connection. What's already saved is kept; tap Resume when you're back online.":
        j.error==="nocache"?"This browser can't keep files for offline use here.":
        "Couldn't save that file. What's already saved is kept; you can try again.";
      box.appendChild(h("p",{class:"note err",text:msg}));
    }
    var row=h("div",{class:"dlrow"});
    if(k==="audio"&&manual){
      box.appendChild(h("p",{class:"note",text:"This audio can't be downloaded by the app itself. You save it from AudioTreasure's site, then add it here."}));
      row.appendChild(h("button",{class:"btn sm",type:"button",onclick:function(){mode={k:"import"};imp=null;paint()}},["Add audio from my device\u2026"]));
      if(d.done>0)row.appendChild(h("button",{class:"btn sm ghost",type:"button",onclick:function(){mode={k:"rm",kind:k};paint()}},["Remove"]));
      box.appendChild(row);return box;
    }
    if(j&&j.running)row.appendChild(h("button",{class:"btn sm",type:"button",onclick:function(){dl.pause(id,k)}},["Pause"]));
    else if(j&&!j.finished&&j.i<j.total)row.appendChild(h("button",{class:"btn sm",type:"button",onclick:function(){dl.resume(id,k)}},["Resume"]));
    else if(d.done<d.total)row.appendChild(h("button",{class:"btn sm",type:"button",onclick:function(){startKind(k,null)}},["Download whole Bible"]));
    if(!(j&&j.running)){
      row.appendChild(h("button",{class:"btn sm ghost",type:"button",onclick:function(){mode={k:"pick",kind:k};sel={};open={};paint()}},["Choose books\u2026"]));
      if(d.done>0)row.appendChild(h("button",{class:"btn sm ghost",type:"button",onclick:function(){mode={k:"rm",kind:k};paint()}},["Remove"]));
    }
    box.appendChild(row);
    return box;
  }
  function paint(failed){
    var b=$("sheetBox");b.setAttribute("data-dl",tok);b.innerHTML="";
    b.appendChild(sheetHead(vName(v)));
    if(!dl.supported()){b.appendChild(h("p",{class:"note",text:"This browser can't keep files for offline use here, so downloading isn't available."}));return}
    if(failed||!st){b.appendChild(h("p",{class:"note",text:failed?"Couldn't read this translation. Check your connection and try again.":"Loading\u2026"}));return}
    if(mode.k==="warn"){
      b.appendChild(h("p",{class:"muted",text:"Audio is saved in your browser's storage on this device. Depending on your device's storage limits (iPhones can be strict), it may or may not all stay saved for offline use. Audio files are large: a whole Bible can run to hundreds of megabytes."}));
      b.appendChild(h("div",{style:"display:grid;gap:8px;margin-top:12px"},[
        h("button",{class:"btn",type:"button",onclick:function(){var m=mode;mode={k:"main",warned:true};dl.start(id,m.kind,m.pairs);paint()}},["Start download"]),
        h("button",{class:"btn ghost",type:"button",onclick:function(){mode={k:"main"};paint()}},["Cancel"])]));
      return;
    }
    if(mode.k==="import"){
      var AT="https://www.audiotreasure.com/content/KJV_AT/zipfiles/";
      if(imp&&imp.running){
        b.appendChild(h("p",{class:"muted",text:"Adding audio\u2026 keep this screen open."}));
        b.appendChild(bar(imp.done,imp.total||1));
        b.appendChild(h("p",{class:"note",text:imp.total?(imp.at?imp.at+" \u00b7 ":"")+_f("{0} of {1}",[dlCount(imp.done),dlCount(imp.total)]):(imp.at||_("Reading the files\u2026"))}));
        return;
      }
      if(imp&&imp.res){
        var r=imp.res,lines=[];
        if(r.saved)lines.push(_f(r.saved===1?"Added {0} chapter. It now plays offline, at any speed.":"Added {0} chapters. They now play offline, at any speed.",[dlCount(r.saved)]));
        else lines.push("Nothing was added.");
        if(r.skipped)lines.push(_f(r.skipped===1?"{0} file skipped because the app couldn't tell which chapter it is.":"{0} files skipped because the app couldn't tell which chapter they are.",[dlCount(r.skipped)])+(r.unmatched.length?" "+r.unmatched.slice(0,4).join(", ")+(r.skipped>4?"\u2026":""):""));
        if(r.failed)lines.push(_f("{0} couldn't be saved.",[dlCount(r.failed)]));
        if(r.error==="full")lines.push("The device ran out of storage space. What was added is kept.");
        else if(r.error==="nocache")lines.push("This browser can't keep files for offline use here.");
        else if(r.error)lines.push(r.error.indexOf("Something went wrong")===0?r.error:r.error);
        if(r.saved&&!r.error)lines.push("You can delete the zip from Files now to free up space.");
        lines.forEach(function(t){b.appendChild(h("p",{class:"muted",text:t}))});
        b.appendChild(h("div",{style:"display:grid;gap:8px;margin-top:12px"},[
          h("button",{class:"btn",type:"button",onclick:function(){mode={k:"main"};imp=null;refresh()}},["Done"]),
          h("button",{class:"btn ghost",type:"button",onclick:function(){imp=null;paint()}},["Add more"])]));
        return;
      }
      b.appendChild(h("p",{class:"muted",text:"AudioTreasure lets you download its King James audio for your own use, but it doesn't allow other apps to download it for you. So it takes two steps:"}));
      b.appendChild(h("p",{class:"muted",text:"1. Download the audio. A zip is easiest: tap one below and your phone saves it to Files."}));
      b.appendChild(h("div",{style:"display:grid;gap:8px;margin:6px 0 12px"},[
        h("a",{class:"btn ghost",href:AT+"KJV_NT_Audio_TB.zip",target:"_blank",rel:"noopener"},["New Testament (265 MB)"]),
        h("a",{class:"btn ghost",href:AT+"KJV_OT_Audio_TB.zip",target:"_blank",rel:"noopener"},["Old Testament (878 MB)"]),
        h("a",{class:"btn ghost",href:AT,target:"_blank",rel:"noopener"},["One book at a time\u2026"])]));
      b.appendChild(h("p",{class:"muted",text:"2. Come back here and add it. Pick the zip, or the MP3 files if your phone already unpacked it. The app works out which chapter each file is."}));
      var fi=h("input",{type:"file",multiple:"",accept:".zip,.mp3,audio/mpeg,application/zip",style:"display:none"});
      fi.onchange=function(){
        var fs=fi.files;if(!fs||!fs.length)return;
        imp={running:true,done:0,total:0,at:""};paint();
        function fail(e){imp={res:{saved:0,skipped:0,unmatched:[],failed:0,error:_f("Something went wrong: {0}. Close the app completely and reopen it, then try again.",[_((e&&e.message)||String(e))])}};if(mine())paint()}
        if(typeof dl.importAudio!=="function"){fail(new Error("this version of the app is missing the audio import"));return}
        try{dl.importAudio(id,fs,function(n,t,at){imp.done=n;imp.total=t;imp.at=at;if(mine()&&mode.k==="import")paint()}).then(function(r){imp={res:r};if(mine())paint()},fail)}catch(e){fail(e)}
      };
      b.appendChild(fi);
      b.appendChild(h("div",{style:"display:grid;gap:8px"},[
        h("button",{class:"btn",type:"button",onclick:function(){fi.click()}},["Add audio files\u2026"]),
        h("button",{class:"btn ghost",type:"button",onclick:function(){mode={k:"main"};paint()}},["Back"])]));
      return;
    }
    if(mode.k==="rm"){
      b.appendChild(h("p",{class:"muted",text:_(mode.kind==="text"?"Remove the downloaded text for this translation from this device? You can download it again later.":"Remove the downloaded audio for this translation from this device? You can download it again later.")}));
      b.appendChild(h("div",{style:"display:grid;gap:8px;margin-top:12px"},[
        h("button",{class:"btn danger",type:"button",onclick:function(){var k=mode.kind;mode={k:"main"};dl.remove(id,k).then(refresh)}},["Remove"]),
        h("button",{class:"btn ghost",type:"button",onclick:function(){mode={k:"main"};paint()}},["Cancel"])]));
      return;
    }
    if(mode.k==="pick"){
      var d=st[mode.kind],n=Object.keys(sel).filter(function(x){return sel[x]}).length;
      b.appendChild(h("p",{class:"note",text:_(mode.kind==="text"?"Text: tap a book to select it, or open it to pick chapters.":"Audio: tap a book to select it, or open it to pick chapters.")}));
      d.books.forEach(function(bk,bi){
        if(!bk.total)return;
        var all=true;for(var c=1;c<=bk.total;c++)if(!sel[bi+"."+c]){all=false;break}
        var head=h("div",{class:"bkrow"},[
          h("button",{class:"bkchk"+(all?" on":""),type:"button","aria-label":_f("Select {0}",[BOOKS[bi][2]]),"aria-pressed":all,onclick:function(){for(var c=1;c<=bk.total;c++)sel[bi+"."+c]=!all;paint()}},[all?"\u2713":""]),
          h("button",{class:"bkname",type:"button",onclick:function(){open[bi]=!open[bi];paint()}},[h("span",{text:BOOKS[bi][2]}),h("small",{text:bk.done>=bk.total?"saved":bk.done+"/"+bk.total})])]);
        var wrap=h("div",{class:"bk"+(bk.done>=bk.total?" full":bk.done>0?" part":"")},[head]);
        if(open[bi]){
          var g=h("div",{class:"chgrid"});
          for(var c=1;c<=bk.total;c++)(function(c){
            g.appendChild(h("button",{class:"chc"+(bk.chs[c-1]?" got":"")+(sel[bi+"."+c]?" on":""),type:"button","aria-pressed":!!sel[bi+"."+c],onclick:function(){sel[bi+"."+c]=!sel[bi+"."+c];paint()}},[String(c)]));
          })(c);
          wrap.appendChild(g);
        }
        b.appendChild(wrap);
      });
      b.appendChild(h("div",{class:"sfoot"},[
        h("button",{class:"btn ghost",type:"button",onclick:function(){mode={k:"main"};paint()}},["Back"]),
        h("button",{class:"btn",type:"button",disabled:n?null:"",onclick:function(){var k=mode.kind,p=pairsFromSel(k);mode={k:"main"};startKind(k,p);if(mode.k==="main"){paint()}}},[n?_f(n===1?"Download {0} chapter":"Download {0} chapters",[n]):"Download"])]));
      return;
    }
    b.appendChild(h("p",{class:"note",text:"Saved on this device only when you choose it. Nothing downloads on its own."}));
    b.appendChild(section("text"));
    if(st.audio)b.appendChild(section("audio"));
    else b.appendChild(h("p",{class:"note",text:"Audio isn't available for this translation."}));
  }
  $("sheetBox").setAttribute("data-dl",tok);
  openSheet(function(b){b.setAttribute("data-dl",tok);b.appendChild(sheetHead(vName(v)));b.appendChild(h("p",{class:"note",text:"Loading\u2026"}))});
  dl.on(onJob);
  refresh();
}
var vOpen={};
function versionRow(v,after){
  var on=v.id===state.prefs.ver,r=vReader(v);
  var row=h("button",{class:"lrow vrow",type:"button","aria-pressed":on,onclick:function(){state.prefs.ver=v.id;state.prefs.lang=v.lang;save();closeSheet();refreshAll()}},[
    h("span",{class:"names"},[h("div",{class:"nat",dir:"auto",text:vName(v)}),r?h("div",{class:"sec",dir:"auto",text:r}):null]),
    h("span",{class:"vbs"},[vBadge("text",vTextLevel(v)),vBadge("audio",audioLevel(v))]),
    on?h("span",{class:"tick",text:"\u2713","aria-hidden":"true"}):null]);
  var wrap=h("div",{class:"vwrap"},[row]);
  if(v.app&&window.BBReader&&BBReader.dl){
    var btn=h("button",{class:"dlbtn",type:"button","aria-label":_f("Downloads for {0}",[vName(v)]),onclick:function(){openDownloads(v)}},[dlIcon("none",0)]);
    wrap.appendChild(btn);
    (dlBtns[v.app]=dlBtns[v.app]||[]).push(btn);
    var rec=dlRecGet()[v.app];
    if(rec)dlBtnPaint(btn,rec);
    else BBReader.dl.quick(v.app).then(function(q){dlRecSet(v.app,q);dlBtnPaint(btn,q)}).catch(function(){});
  }else{
    var nb=h("button",{class:"dlbtn off",type:"button","aria-disabled":"true","aria-label":"Not available for download"},[dlIcon("off",0)]);
    nb.onclick=function(e){
      e.stopPropagation();
      clearTimeout(nb._r);clearTimeout(nb._t);
      var old=wrap.querySelector(".dltip");if(old)old.remove();
      nb.classList.add("flash");
      nb._r=setTimeout(function(){nb.classList.remove("flash")},700);
      var tip=h("div",{class:"dltip",role:"status",text:"Not available for download"});
      wrap.appendChild(tip);
      nb._t=setTimeout(function(){tip.remove()},3000);
    };
    wrap.appendChild(nb);
  }
  return wrap;
}
function versionsSorted(all){return all.filter(function(v){return v.app}).concat(all.filter(function(v){return !v.app}))}
function openVersions(){
  openSheet(function(box){
    box.appendChild(sheetHead("Bible version",RICO.ver));
    if(state.prefs.all){
      /* every language, each one collapsed until you open it */
      var cur=state.prefs.lang;if(vOpen[cur]==null)vOpen[cur]=true;
      var langs=allLangs().filter(function(l){return versionsAll(l.id).length}),first=langs.filter(function(l){return l.id===cur}),
          top=langs.filter(function(l){return l.top&&l.id!==cur}),rest=langs.filter(function(l){return !l.top&&l.id!==cur}).sort(function(a,b){return a.en.localeCompare(b.en)});
      first.concat(top,rest).forEach(function(l){
        var vs=versionsSorted(versionsAll(l.id)),isOpen=!!vOpen[l.id];
        var body=h("div",{class:"lgbody"});
        if(isOpen)vs.forEach(function(v){body.appendChild(versionRow(v))});
        var head=h("button",{class:"lrow lghead",type:"button","aria-expanded":isOpen,onclick:function(){
          vOpen[l.id]=!vOpen[l.id];
          if(vOpen[l.id]&&!body.childNodes.length)vs.forEach(function(v){body.appendChild(versionRow(v))});
          body.hidden=!vOpen[l.id];head.setAttribute("aria-expanded",!!vOpen[l.id]);
          head.querySelector(".chev").style.transform=vOpen[l.id]?"rotate(90deg)":"";
          if(vOpen[l.id])dlScanSoon(800)}},[
          h("span",{class:"flag",text:l.flag,"aria-hidden":"true"}),
          h("span",{class:"names"},[h("div",{class:"nat",dir:"auto",text:l.nat}),h("div",{class:"sec",dir:"auto",text:(l.nat!==l.en?l.en+" \u00b7 ":"")+_f(vs.length===1?"{0} version":"{0} versions",[vs.length])})]),
          h("span",{class:"chev",style:isOpen?"transform:rotate(90deg)":""},[ic("chevron-right")])]);
        body.hidden=!isOpen;
        box.appendChild(h("div",{class:"lgroup"},[head,body]));
      });
      dlScanSoon(800);
      return;
    }
    var L=langById(state.prefs.lang);
    box.appendChild(h("p",{class:"note",dir:"auto",text:L.flag+" "+L.nat+(L.nat!==L.en?" \u00b7 "+L.en:"")}));
    var all=versionsFor(state.prefs.lang),cv=VERSIONS.filter(function(x){return x.id===state.prefs.ver})[0];
    if(cv&&cv.more&&cv.lang===state.prefs.lang)all=all.concat([cv]);
    versionsSorted(all).forEach(function(v){box.appendChild(versionRow(v))});
    dlScanSoon(800);
  });
}
function confirmSheet(title,msg,okLabel,danger,onOk){
  openSheet(function(box){
    box.appendChild(sheetHead(title));
    box.appendChild(h("p",{class:"muted",text:msg}));
    box.appendChild(h("div",{style:"display:grid;gap:8px;margin-top:12px"},[
      h("button",{class:"btn"+(danger?" danger":""),type:"button",onclick:function(){closeSheet();onOk()}},[okLabel]),
      h("button",{class:"btn ghost",type:"button",onclick:closeSheet},["Cancel"])]));
  });
}

function startPresetSheet(p){
  var start=todayStr();
  openSheet(function(box){
    box.appendChild(sheetHead(p.name));
    box.appendChild(h("p",{class:"muted",text:_(p.desc)+"."}));
    var inp=h("input",{type:"date",value:start,"aria-label":"Start date"});
    box.appendChild(h("div",{class:"field"},[h("label",{text:"Start date"}),inp]));
    var err=h("div",{class:"err",hidden:""});
    box.appendChild(err);
    box.appendChild(h("button",{class:"btn",type:"button",style:"margin-top:8px",onclick:function(){
      if(!inp.value){err.hidden=false;err.textContent="Choose a start date.";return}
      var plan={id:"p"+Date.now(),name:p.name,start:inp.value,days:p.days,order:p.order||"bible",groups:p.groups.map(function(g){return g.slice()}),done:{},ch:{}};
      state.plans.push(plan);state.active=plan.id;viewDay=null;save();closeSheet();setTab("plans");refreshAll();toast("Plan started");
    }},["Start plan"]));
    if(p.cat)box.appendChild(h("button",{class:"btn ghost",type:"button",style:"margin-top:8px",onclick:function(){closeSheet();cloneNotice(p)}},["Edit as my own copy"]));
  });
}
function cloneNotice(p){
  openSheet(function(box){
    box.appendChild(sheetHead("Edit this plan?"));
    box.appendChild(h("p",{class:"muted",text:"Ready-made plans can\u2019t be changed. We\u2019ll make your own copy in Custom plans. You\u2019ll give it a new name, then you can change anything you like. The original stays exactly as it is."}));
    box.appendChild(h("div",{style:"display:grid;gap:8px;margin-top:12px"},[
      h("button",{class:"btn",type:"button",onclick:function(){closeSheet();openBuilderFor("clone",p)}},["Make my own copy"]),
      h("button",{class:"btn ghost",type:"button",onclick:closeSheet},["Cancel"])]));
  });
}

/* ---------- Plan detail screen ---------- */
function showScreen(node){var s=$("screen");s.innerHTML="";s.appendChild(node);s.hidden=false;s.scrollTop=0;document.body.style.overflow="hidden"}
function hideScreen(){fpRebuild=null;$("screen").hidden=true;$("screen").innerHTML="";document.body.style.overflow=""}
function bgAudioUrl(plan,dayIdx,v){
  var refs=[],seen={};
  schedule(plan)[dayIdx].forEach(function(units){
    units.forEach(function(u){var r=BOOKS[u.b][0]+"."+u.c;if(!seen[r]){seen[r]=1;refs.push(r)}});
  });
  var vkey=VKEY[v.id]||"esv",rkey="mclean";
  if(/drama|dramatized/i.test(v.label))rkey="dramatized";
  return "https://www.biblegateway.com/audio/"+rkey+"/"+vkey+"/"+refs.join(",");
}
function fullPlanView(id){
  var plan=state.plans.filter(function(p){return p.id===id})[0];if(!plan)return;
  var D=plan.days,sch=schedule(plan);
  function dayRowFor(i){
    var row=h("div",{class:"fpday"});
    var cur;
    function circ(){return doneCircle(!!plan.done[i],_f("Day {0} complete",[i+1]),function(){setDayDone(plan,i,true);build(true)},function(){setDayDone(plan,i,false);build(true)},true,function(){dayMenu(plan,i,function(){build(true)})})}
    function swap(){var n=circ();row.replaceChild(n,cur);cur=n}
    cur=circ();row.appendChild(cur);
    var info=h("div",{class:"fpinfo"});
    info.appendChild(h("div",{class:"fpday-num",text:"Day "+(i+1)}));
    row.appendChild(info);
    row.appendChild(h("button",{class:"btn sm",type:"button",onclick:function(){choosePlayDay(plan,i)}},["\u25b6\ufe0e Play"]));
    var allUnits=[];sch[i].forEach(function(u){allUnits=allUnits.concat(u)});
    var chapDiv=h("div",{class:"fpchaps"});
    var ctx={plan:plan,d:i,sm:true,refresh:function(){build(true)}};
    if(!allUnits.length)chapDiv.appendChild(h("span",{class:"fpbk",text:_("Rest day")}));
    segs(allUnits).forEach(function(sg){
      chapDiv.appendChild(h("span",{class:"fpbk",text:BOOKS[sg.b][2]}));
      var seen={};
      sg.units.forEach(function(u){
        if(sg.b===PROV)chapDiv.appendChild(chPill(sg.b,u.c,u,ctx));
        else if(!seen[u.c]){seen[u.c]=1;chapDiv.appendChild(chPill(sg.b,u.c,null,ctx))}
      });
    });
    row.appendChild(chapDiv);
    return row;
  }
  function build(keep){
    var old=keep&&document.querySelector("#screen .fpbody"),top=old?old.scrollTop:0;
    var body=h("div",{class:"fpbody"});
    body.appendChild(h("p",{class:"muted small",style:"margin:0 2px 10px",text:"Tap a chapter or circle to check it. Tap a chapter again to uncheck it."}));
    for(var i=0;i<D;i++)body.appendChild(dayRowFor(i));
    showScreen(h("div",{class:"fullplan"},[screenHeader(plan.name,hideScreen,""),body]));
    body.scrollTop=top;
  }
  fpRebuild=function(){build(true)};
  build(false);
}
function screenHeader(title,onBack,stepText){
  return h("div",{class:"shd"},[h("button",{class:"xbtn",type:"button","aria-label":"Back",onclick:onBack},[ic("arrow-left")]),h("div",{class:"ttl",text:title}),stepText?h("div",{class:"step",text:stepText}):null]);
}
function groupNames(g){var o=orderBooks(g,"bible");if(!o.length)return "no books";var parts=[],st=o[0],pv=o[0];
  for(var i=1;i<=o.length;i++){if(i<o.length&&o[i]===pv+1){pv=o[i];continue}parts.push(st===pv?BOOKS[st][2]:BOOKS[st][2]+"\u2013"+BOOKS[pv][2]);if(i<o.length){st=o[i];pv=o[i]}}
  return parts.join(", ")}

/* ---------- Builder ---------- */
var draft=null,bstep=1,berr="";
var DAYCHIPS=[7,14,30,60,90,180,365];
function openBuilder(){openBuilderFor("new",null)}
function openBuilderFor(mode,src){
  var days=src?src.days:30;
  draft={mode:mode,srcId:src&&src.id||null,presetName:mode==="clone"?src.name:null,
    name:mode==="clone"?src.name+" (my copy)":(src?src.name:""),
    start:mode==="edit-plan"?src.start:todayStr(),days:days,custom:DAYCHIPS.indexOf(days)<0,
    groups:src?src.groups.map(function(g){return g.slice()}):[[]],order:src&&src.order||"bible"};
  bstep=1;berr="";renderBuilder();
}
function renderBuilder(){
  var wrap=h("div",{class:"sinner"});
  var ttl=draft.mode==="new"?"New plan":draft.mode==="clone"?"Your copy":"Edit plan";
  wrap.appendChild(screenHeader(ttl,function(){if(bstep>1){bstep--;berr="";renderBuilder()}else hideScreen()},_f("Step {0} of 3",[bstep])));
  var body=h("div",{class:"sbody"});
  if(bstep===1)builderStep1(body);else if(bstep===2)builderStep2(body);else builderStep3(body);
  if(berr)body.appendChild(h("div",{class:"err",role:"alert",text:berr}));
  wrap.appendChild(body);
  var foot=h("div",{class:"sfoot"});
  foot.appendChild(h("button",{class:"btn ghost",type:"button",onclick:function(){if(bstep>1){bstep--;berr="";renderBuilder()}else hideScreen()}},[bstep>1?"Back":"Cancel"]));
  if(bstep<3)foot.appendChild(h("button",{class:"btn",type:"button",onclick:builderNext},["Next"]));
  else if(draft.mode==="new"||draft.mode==="clone"){
    var st="padding:0 8px;font-size:14px;line-height:1.15";
    foot.appendChild(h("button",{class:"btn alt",type:"button",style:st,onclick:function(){builderFinish("later")}},["Save for later"]));
    foot.appendChild(h("button",{class:"btn",type:"button",style:st,onclick:function(){builderFinish("active")}},["Make active"]));
  }else foot.appendChild(h("button",{class:"btn",type:"button",onclick:function(){builderFinish("save")}},["Save changes"]));
  wrap.appendChild(foot);
  var keep=$("screen").scrollTop;showScreen(wrap);$("screen").scrollTop=keep;
}
function builderStep1(body){
  body.appendChild(h("h1",{class:"pg",text:"Name and timeframe"}));
  if(draft.mode==="clone")body.appendChild(h("p",{class:"note",text:"This is your own copy of \u201c"+draft.presetName+"\u201d. Give it a new name and change anything you like. The ready-made original stays as it is."}));
  var nm=h("input",{type:"text",placeholder:"My reading plan",value:draft.name,maxlength:"60","aria-label":"Plan name",oninput:function(){draft.name=this.value}});
  body.appendChild(h("div",{class:"field"},[h("label",{text:"Plan name"}),nm]));
  if(draft.mode!=="edit-custom"){
    var st=h("input",{type:"date",value:draft.start,"aria-label":"Start date",onchange:function(){draft.start=this.value;renderBuilder()}});
    body.appendChild(h("div",{class:"field"},[h("label",{text:"Start date"}),st]));
    if(draft.mode==="new"||draft.mode==="clone")body.appendChild(h("p",{class:"muted small",style:"margin:-4px 2px 10px",text:"Used if you make the plan active."}));
  }
  var chips=h("div",{class:"chiprow"});
  [[7,"1 week"],[14,"2 weeks"],[30,"30 days"],[60,"60 days"],[90,"90 days"],[180,"6 months"],[365,"1 year"]].forEach(function(o){
    chips.appendChild(h("button",{class:"chipb",type:"button","aria-pressed":!draft.custom&&draft.days===o[0],onclick:function(){draft.days=o[0];draft.custom=false;renderBuilder()}},[o[1]]));
  });
  chips.appendChild(h("button",{class:"chipb",type:"button","aria-pressed":draft.custom,onclick:function(){draft.custom=true;renderBuilder()}},["Custom"]));
  body.appendChild(h("div",{class:"field"},[h("label",{text:"How long?"}),chips]));
  if(draft.custom){
    body.appendChild(h("div",{class:"field"},[h("label",{text:"Number of days"}),h("input",{type:"number",min:"1",max:"1000",inputmode:"numeric",value:String(draft.days),"aria-label":"Number of days",oninput:function(){draft.days=parseInt(this.value,10)||0;var e=$("endline");if(e)e.textContent=endText()}})]));
  }
  if(draft.mode!=="edit-custom")body.appendChild(h("p",{class:"muted",id:"endline",text:endText()}));
}
function endText(){return draft.days>0&&draft.start?_("Ends ")+niceY(addDays(draft.start,draft.days-1))+".":"Enter the number of days."}
function builderStep2(body){
  body.appendChild(h("h1",{class:"pg",text:"Pick your groups"}));
  body.appendChild(h("p",{class:"muted",style:"margin:0 2px 6px",text:"Each day you\u2019ll read a little from every group. Each group is spread across the whole timeframe so they all finish together."}));
  body.appendChild(h("p",{class:"muted small",style:"margin:0 2px 12px",text:"Portions are whole chapters. Proverbs is split into short sections of about 10 to 15 verses."}));
  var used={};
  draft.groups.forEach(function(g,gi){
    var col=GCOLORS[gi%GCOLORS.length];
    var chips=h("div",{class:"bchips"});
    g.forEach(function(b){chips.appendChild(h("span",{class:"bch"},[BOOKS[b][2],h("button",{type:"button","aria-label":_("Remove ")+BOOKS[b][2],onclick:function(){draft.groups[gi]=draft.groups[gi].filter(function(x){return x!==b});berr="";renderBuilder()}},[ic("x")])]))});
    var head=h("div",{class:"gh"},[h("b",{text:_("Group ")+(gi+1)}),h("span",{class:"muted small",text:g.length?totalChapters(g)+_(" chapters"):"No books yet"})]);
    if(draft.groups.length>1)head.appendChild(h("button",{class:"xbtn",type:"button","aria-label":_("Remove group ")+(gi+1),onclick:function(){draft.groups.splice(gi,1);berr="";renderBuilder()}},[ic("trash")]));
    body.appendChild(h("div",{class:"gcard",style:"border-left-color:"+col},[head,chips,h("button",{class:"btn alt sm",type:"button",onclick:function(){openPicker(gi)}},[ic("plus"),g.length?"Edit books":"Add books"])]));
  });
  if(draft.groups.length<5)body.appendChild(h("button",{class:"newplan",type:"button",onclick:function(){draft.groups.push([]);berr="";renderBuilder()}},[ic("plus"),_f("Add group ({0} of 5)",[draft.groups.length])]));
  body.appendChild(h("h2",{class:"sec",text:"Reading order inside a group"}));
  body.appendChild(h("div",{class:"seg",role:"group","aria-label":"Reading order"},[
    h("button",{type:"button","aria-pressed":draft.order==="bible",onclick:function(){draft.order="bible";renderBuilder()}},["Bible order"]),
    h("button",{type:"button","aria-pressed":draft.order==="picked",onclick:function(){draft.order="picked";renderBuilder()}},["Order I picked"])]));
}
function openPicker(gi){
  var tmp=draft.groups[gi].slice(),other={};
  draft.groups.forEach(function(g,i){if(i!==gi)g.forEach(function(b){other[b]=true})});
  openSheet(function(box){
    function draw(){
      box.innerHTML="";
      box.appendChild(sheetHead(_("Group ")+(gi+1)+_(" books")));
      box.appendChild(h("div",{class:"lbl",text:"Quick picks"}));
      var q=h("div",{class:"chiprow"});
      QUICK.forEach(function(o){
        var set=rng(o[1],o[2]).filter(function(b){return !other[b]});
        var all=set.length>0&&set.every(function(b){return tmp.indexOf(b)>=0});
        q.appendChild(h("button",{class:"chipb",type:"button","aria-pressed":all,disabled:set.length?null:"",onclick:function(){
          if(all)tmp=tmp.filter(function(b){return set.indexOf(b)<0});else set.forEach(function(b){if(tmp.indexOf(b)<0)tmp.push(b)});draw()}},[o[0]]));
      });
      box.appendChild(q);
      box.appendChild(h("div",{class:"lbl",style:"margin-top:16px",text:"Or choose books"}));
      var g=h("div",{class:"pick"});
      BOOKS.forEach(function(b,i){
        var on=tmp.indexOf(i)>=0;
        g.appendChild(h("button",{type:"button","aria-pressed":on,disabled:other[i]?"":null,title:other[i]?"Already in another group":"",onclick:function(){if(on)tmp=tmp.filter(function(x){return x!==i});else tmp.push(i);draw()}},[b[2]]));
      });
      box.appendChild(g);
      box.appendChild(h("button",{class:"btn",type:"button",style:"margin-top:14px",onclick:function(){draft.groups[gi]=tmp;berr="";closeSheet();renderBuilder()}},[_("Done \u00b7 ")+tmp.length+(tmp.length===1?" book":" books")+(tmp.length?" \u00b7 "+totalChapters(tmp)+_(" chapters"):"")]));
    }
    draw();
  });
}
function builderNext(){
  berr="";
  if(bstep===1){
    if(draft.mode==="clone"&&(draft.name||"").trim().toLowerCase()===draft.presetName.toLowerCase()){berr="Give your copy a new name. The ready-made original stays unchanged.";return renderBuilder()}
    if(draft.mode!=="edit-custom"&&!draft.start){berr="Choose a start date.";return renderBuilder()}
    if(!(draft.days>=1&&draft.days<=1000)){berr="Enter a number of days from 1 to 1000.";return renderBuilder()}
    bstep=2;return renderBuilder();
  }
  if(bstep===2){
    var gs=draft.groups.map(function(g,i){return{g:g,i:i}}).filter(function(x){return x.g.length});
    var empty=draft.groups.findIndex(function(g){return !g.length});
    if(!gs.length){berr="Add books to at least one group.";return renderBuilder()}
    if(empty>=0&&draft.groups.length>1){berr=_("Group ")+(empty+1)+_(" has no books. Add some or remove the group.");return renderBuilder()}
    bstep=3;return renderBuilder();
  }
}
function builderFinish(kind){
  var groups=draft.groups.filter(function(g){return g.length}).map(function(g){return g.slice()}),name=(draft.name||"").trim()||"My reading plan";
  if(draft.mode==="edit-plan"){
    var p=state.plans.filter(function(x){return x.id===draft.srcId})[0];if(!p){hideScreen();return}
    p.name=name;p.start=draft.start;p.days=draft.days;p.order=draft.order;p.groups=groups;delete p._s;
    Object.keys(p.done||{}).forEach(function(k){if(parseInt(k,10)>=p.days)delete p.done[k]});
    Object.keys(p.ch||{}).forEach(function(k){if(parseInt(k,10)>=p.days)delete p.ch[k]});
    viewDay=null;save();hideScreen();refreshAll();toast("Plan updated");return;
  }
  if(draft.mode==="edit-custom"){
    var c=state.customs.filter(function(x){return x.id===draft.srcId})[0];if(!c){hideScreen();return}
    c.name=name;c.days=draft.days;c.order=draft.order;c.groups=groups;
    save();hideScreen();refreshAll();toast("Custom plan updated");return;
  }
  state.customs.push({id:"c"+Date.now(),name:name,days:draft.days,order:draft.order,groups:groups.map(function(g){return g.slice()})});
  if(kind==="active"){
    var plan={id:"p"+Date.now(),name:name,start:draft.start,days:draft.days,order:draft.order,groups:groups,done:{},ch:{}};
    state.plans.push(plan);state.active=plan.id;viewDay=null;toast("Plan started");
  }else toast("Saved to custom plans");
  save();hideScreen();setTab("plans");refreshAll();
}
function builderStep3(body){
  var tmp={days:draft.days,order:draft.order,groups:draft.groups.filter(function(g){return g.length})};
  var sched=schedule(tmp);
  body.appendChild(h("h1",{class:"pg",text:"Preview"}));
  if(draft.mode==="new"||draft.mode==="clone")body.appendChild(h("p",{class:"note",text:"Save for later keeps it in Custom plans without starting it. Make active starts it on the start date and replaces your current active plan."}));
  if(draft.mode==="edit-plan")body.appendChild(h("p",{class:"note",text:"Your progress is kept. It stays with the same day numbers."}));
  var sum=h("div",{class:"card"},[h("b",{text:(draft.name||"").trim()||"My reading plan"}),h("div",{class:"muted small",text:draft.days+_(" days \u00b7 ")+niceY(draft.start)+" to "+niceY(addDays(draft.start,draft.days-1))})]);
  tmp.groups.forEach(function(g,gi){
    var n=totalChapters(g),per=n/draft.days,nu=unitsOf(g).length;
    var txt=per>=1?_("about ")+(Math.round(per*10)/10)+_(" ch/day"):n+_(" ch total \u00b7 on ")+Math.min(nu,draft.days)+_(" of ")+draft.days+_(" days");
    sum.appendChild(h("div",{class:"sumrow"},[h("span",{class:"gdot",style:"background:"+GCOLORS[gi%GCOLORS.length]+";margin-top:0"}),h("div",{style:"min-width:0"},[h("div",{class:"small",style:"font-weight:600",text:_("Group ")+(gi+1)}),h("div",{class:"muted small",text:groupNames(g)})]),h("div",{class:"sr",text:txt})]));
  });
  body.appendChild(sum);
  var short=tmp.groups.map(function(g,i){return unitsOf(orderBooks(g,tmp.order)).length<draft.days?i+1:0}).filter(Boolean);
  if(short.length)body.appendChild(h("p",{class:"note",text:_("Group ")+short.join(", ")+" "+(short.length>1?"have":"has")+_(" fewer chapters than days, so there will be rest days for ")+(short.length>1?"those groups":"that group")+"."}));
  body.appendChild(h("h2",{class:"sec",text:"First days"}));
  for(var d=0;d<Math.min(3,draft.days);d++){
    var c=h("div",{class:"daycard",style:"content-visibility:visible"});
    var info=h("div",{class:"dinfo"},[h("div",{class:"dh",text:_("Day ")+(d+1)+" \u00b7 "+nice(addDays(draft.start,d))})]);
    sched[d].forEach(function(items,gi){info.appendChild(h("div",{class:"prow"},[h("span",{class:"gdot",style:"background:"+GCOLORS[gi%GCOLORS.length]}),h("div",{class:"pbody"},[h("div",{class:"plabel",style:"margin:0;font-weight:500",text:itemsText(items)})])]))});
    c.appendChild(info);body.appendChild(c);
  }
  body.appendChild(h("p",{class:"note",text:_("Last day: every group ends on day ")+draft.days+"."}));
}

/* ---------- splash translations ---------- */
var DESC_EN="Plan your Bible reading, choose your preferred translation and language, and connect directly to the Bible reading or listening service of your choice.";
var TX={
 en:{choose:"Choose your language",tag:"A Bible Reading Planner",desc:DESC_EN,tap:"Tap to continue"}
};
var RTL={},NOSP={};
/* ---------- language packs ----------
   Every menu language except English is its own small file in the lang folder (lang/de.json, lang/hi.json ...).
   lang/index.json lists them with a version stamp. A language is downloaded when you pick it, kept on this device, and
   can be removed again. The original 17 languages download quietly the first time the app is online. */
var LP_REC="bb_langs",LP_SEED="bb_langs_seed",LP_MIR="bb_lpmirror",LP_IDXK="bb_lpidx",LP_CACHE="bb-lang";
var UI17={zh:1,es:1,ar:1,pt:1,ru:1,fr:1,de:1,ja:1,cs:1,fa:1,pl:1,pdt:1,ro:1,sk:1,sw:1,sv:1,th:1};
/* languages whose menus are not translated yet: they work as Bible languages, and the menus use the substitute language shown here */
var NOUI={ckw:"es",kek:"es",qut:"es",jac:"es",mvc:"es",mvj:"es",usp:"es",ppl:"es",amu:"es",cco:"es",ngu:"es",chr:"en"};
var NOUIN={es:"Aún no disponible. Por ahora, menús en español.",en:"Not available yet. For now, menus in English."};
var lpIdx=null,lpBusy={},lpLoaded={},lpData={},lpSyncing=false;
function lsGet(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function lpHas(id){return id==="en"||lsGet(LP_REC,{})[id]!=null}
function lpMark(id,v){var r=lsGet(LP_REC,{});r[id]=v||"0";lsSet(LP_REC,r);var s=lsGet(LP_SEED,[]);if(s.indexOf(id)<0){s.push(id);lsSet(LP_SEED,s)}}
function lpApply(id,d){
  I18N[id]=d.i;BN[id]=d.b;TX[id]=d.t;VRD[id]=d.r;if(d.l)LOC[id]=d.l;
  if(d.rtl)RTL[id]=1;if(d.nosp)NOSP[id]=1;
  lpData[id]=d;lpLoaded[id]=1;
  if(id===uiLang())lsSet(LP_MIR,{id:id,d:d});
}
function lpSetUi(id){state.prefs.ui=id;save();if(id!=="en"&&lpData[id])lsSet(LP_MIR,{id:id,d:lpData[id]})}
function lpStore(){return(window.caches&&caches.open)?caches.open(LP_CACHE):Promise.reject(new Error("nocache"))}
function lpGetStored(id){
  return lpStore().then(function(c){return c.match("lang/"+id)}).then(function(r){return r?r.json():null})
    .catch(function(){try{var s=localStorage.getItem("bb_lp_"+id);return s?JSON.parse(s):null}catch(e){return null}})}
function lpPutStored(id,rec){
  return lpStore().then(function(c){return c.put("lang/"+id,new Response(JSON.stringify(rec)))}).then(function(){return true})
    .catch(function(){try{localStorage.setItem("bb_lp_"+id,JSON.stringify(rec));return true}catch(e){return false}})}
function lpDelStored(id){
  try{localStorage.removeItem("bb_lp_"+id)}catch(e){}
  return lpStore().then(function(c){return c.delete("lang/"+id)}).catch(function(){})}
function lpIndex(){
  if(lpIdx)return Promise.resolve(lpIdx);
  return fetch("lang/index.json",{cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("http");return r.json()})
    .then(function(j){if(!j||!j.n)throw new Error("bad");lpIdx=j;lsSet(LP_IDXK,j);return j})
    .catch(function(){var j=lsGet(LP_IDXK,null);if(j&&j.n){lpIdx=j;return j}throw new Error("offline")});
}
/* download one language: lang/<id>.json */
function lpFetch(id){
  return lpIndex().then(function(ix){
    var hv=ix.n[id];if(!hv)throw new Error("none");
    return fetch("lang/"+id+".json?v="+hv).then(function(r){if(!r.ok)throw new Error("http");return r.json()}).then(function(d){
      if(!d||d.id!==id||!d.i||!d.b)throw new Error("bad");
      return{v:hv,d:d};
    });
  });
}
/* make a language ready: from this device if saved, otherwise download it. Resolves true/false. */
function lpEnsure(id){
  if(id==="en"||lpLoaded[id])return Promise.resolve(true);
  if(lpBusy[id])return lpBusy[id];
  var p=lpGetStored(id).then(function(rec){
    if(rec&&rec.d&&rec.d.i)return rec;
    return lpFetch(id).then(function(rec){return lpPutStored(id,rec).then(function(ok){rec.saved=ok;return rec})});
  }).then(function(rec){
    lpApply(id,rec.d);if(rec.saved!==false)lpMark(id,rec.v);return true;
  }).catch(function(){return false}).then(function(ok){delete lpBusy[id];return ok});
  return(lpBusy[id]=p);
}
function lpRemove(id){
  var r=lsGet(LP_REC,{});delete r[id];lsSet(LP_REC,r);
  var s=lsGet(LP_SEED,[]);if(s.indexOf(id)<0){s.push(id);lsSet(LP_SEED,s)}   /* never fetched again on its own */
  delete I18N[id];delete BN[id];delete TX[id];delete VRD[id];delete lpLoaded[id];delete lpData[id];
  var m=lsGet(LP_MIR,null);if(m&&m.id===id)try{localStorage.removeItem(LP_MIR)}catch(e){}
  return lpDelStored(id);
}
/* at start: the language you use is applied at once from a small saved copy, or loaded in a moment */
function lpBoot(){
  var id=state.prefs.ui;if(!id||id==="en")return;
  var m=lsGet(LP_MIR,null);
  if(m&&m.id===id&&m.d&&m.d.i)lpApply(id,m.d);
  if(!lpLoaded[id])lpEnsure(id).then(function(ok){if(ok){refreshAll();splashText()}});
}
/* quiet background work: the first time, save the original 17 languages; later, refresh any saved language that has newer text */
function lpSync(){
  if(lpSyncing||navigator.onLine===false)return;lpSyncing=true;
  lpIndex().then(function(ix){
    var have=lsGet(LP_REC,{}),seed=lsGet(LP_SEED,[]),todo=[];
    Object.keys(have).forEach(function(id){if(ix.n[id]&&have[id]!==ix.n[id])todo.push(id)});
    Object.keys(UI17).forEach(function(id){if(!have[id]&&seed.indexOf(id)<0&&ix.n[id]&&todo.indexOf(id)<0)todo.push(id)});
    var cur=uiLang();todo.sort(function(a,b){return(a===cur?0:1)-(b===cur?0:1)});
    var i=0;
    (function next(){
      if(i>=todo.length){lpSyncing=false;return}
      var id=todo[i++];
      lpFetch(id).then(function(rec){return lpPutStored(id,rec).then(function(ok){
        if(!ok)return;
        lpMark(id,rec.v);
        if(lpLoaded[id]){lpApply(id,rec.d);if(id===uiLang())refreshAll()}
      })}).catch(function(){}).then(function(){setTimeout(next,200)});
    })();
  }).catch(function(){lpSyncing=false});
}
window.addEventListener("load",function(){setTimeout(lpSync,2500)});
function tx(k,id){var T=TX[id||uiLang()]||TX.en;return T[k]||TX.en[k]}
function renderHero(){applyBookNames();$("tabPlansT").textContent=_("Reading plans");$("tabBibleT").textContent=_("Whole Bible");var s=$("heroSub");if(s)s.textContent=tx("tag");var r=RTL[uiLang()]?"rtl":"ltr";document.documentElement.setAttribute("lang",uiLang());document.querySelector(".app").dir=r}

/* ---------- splash ---------- */
var spReady=false,spAuto=null,spGone=false;
function splashText(){
  var id=uiLang(),L=langById(id),sp=$("splash");
  sp.setAttribute("lang",id);sp.classList.toggle("nosp",!!NOSP[id]);
  var dir=RTL[id]?"rtl":"ltr";
  ["spTag","spDesc","spChoose","spTap"].forEach(function(x){$(x).dir=dir});
  $("spTag").textContent=tx("tag");$("spDesc").textContent=tx("desc");
  $("spChoose").textContent=tx("choose");$("spTap").textContent=tx("tap");
  $("spFlag").textContent=L.flag;$("spNm").textContent=L.nat;$("spNm").dir="auto";
}
function splashSwap(){var sp=$("splash");sp.classList.add("swap");setTimeout(function(){splashText();sp.classList.remove("swap")},190)}
function splashGo(){
  if(spGone)return;spGone=true;clearTimeout(spAuto);
  var sp=$("splash");sp.classList.add("out");setTimeout(function(){sp.classList.add("gone")},650);
}
function revealDesc(){
  var g=$("spGd");g.style.display="flex";
  setTimeout(function(){g.classList.add("in")},30);
  setTimeout(function(){$("spTap").classList.add("show");spReady=true},750);
}
function splashStart(){
  var sp=$("splash");
  $("spChev").innerHTML="";$("spChev").appendChild(ic("chevron-down"));
  splashText();
  if(!state.prefs.ui)state.prefs.ui=(state.prefs.chosen&&UI17[state.prefs.lang])?state.prefs.lang:"en";
  if(state.prefs.ui!=="en"&&!lpLoaded[state.prefs.ui])lpBoot();
  var returning=!!state.prefs.chosen;
  setTimeout(function(){$("spLogo").classList.add("in")},150);
  setTimeout(function(){$("spG1").classList.add("in")},1000);
  if(returning){
    $("spG2").style.display="none";
    setTimeout(revealDesc,1500);
  }else{
    setTimeout(function(){$("spG2").classList.add("in")},1500);
  }
  $("spLangBtn").onclick=function(e){
    e.stopPropagation();clearTimeout(spAuto);
    openLang({splash:true,onDone:function(){
      state.prefs.chosen=1;save();
      $("spG2").classList.remove("in");
      splashSwap();
      setTimeout(function(){$("spG2").style.display="none";revealDesc()},550);
    }});
  };
  sp.onclick=function(e){if(e.target.closest("#spLangBtn"))return;splashGo()};
}

/* ---------- shell ---------- */
function setTab(name){
  state.prefs.tab=name;save();
  $("tab-plans").hidden=name!=="plans";$("tab-bible").hidden=name!=="bible";
  $("tabPlans").setAttribute("aria-selected",name==="plans");$("tabBible").setAttribute("aria-selected",name==="bible");
}
function refreshAll(){renderHero();renderControls();renderPlansTab();renderBibleTab()}
$("tabPlans").onclick=function(){setTab("plans")};
$("tabBible").onclick=function(){setTab("bible")};
load();applyTheme();lpBoot();

$("tpi").innerHTML=ic("calendar-event").innerHTML;$("tpg").innerHTML=ic("chevron-right").innerHTML;
$("tbi").innerHTML=ic("book-2").innerHTML;$("tbg").innerHTML=ic("chevron-right").innerHTML;
refreshAll();setTab(state.prefs.tab==="bible"?"bible":"plans");splashStart();

/* header logo + sticky tab bar state */
(function(){
  var hl=$("heroLogo"),sl=$("spLogo");if(hl&&sl)hl.src=sl.src;
  var tabs=document.querySelector(".tabs"),sent=$("tabSent");
  var probe=document.createElement("div");
  probe.style.cssText="position:absolute;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)";
  document.body.appendChild(probe);
  var raf=0;
  function upd(){raf=0;var inset=parseFloat(getComputedStyle(probe).paddingTop)||0;
    tabs.classList.toggle("stuck",sent.getBoundingClientRect().top<inset-0.5)}
  function queue(){if(!raf)raf=requestAnimationFrame(upd)}
  document.addEventListener("scroll",queue,true);window.addEventListener("resize",queue);
  upd();
})();

/* temporary logo-glow adjuster: long-press the header logo.
   The glow is drawn on a canvas that covers the whole header, from an exact distance
   field around the logo's shape, so it can be any size without ever showing a box edge. */
(function(){
  var logo=$("heroLogo"),hero=document.querySelector(".hero"),cv=$("glowCv"),panel=$("glowPanel");
  var T=$("glT"),F=$("glF"),O=$("glO"),To=$("glTo"),Fo=$("glFo"),Oo=$("glOo");
  var DEF={t:0.9,f:3.8,o:85};
  var vals={t:DEF.t,f:DEF.f,o:DEF.o};
  var LIM={t:[0,400],f:[0,400],o:[0,100]};
  var SLOW=10; /* how many times finer than a normal slider */
  var off=document.createElement("canvas"),oc=off.getContext&&off.getContext("2d"),cx=cv.getContext&&cv.getContext("2d");
  var gw=0,gh=0,S=1,dist=null,maskKey="",img=null,raf=0;
  var INF=1e20;

  /* squared Euclidean distance transform (Felzenszwalb & Huttenlocher), one line */
  function dt1(f,n,d,v,z){
    var k=0,q,s;v[0]=0;z[0]=-INF;z[1]=INF;
    for(q=1;q<n;q++){
      s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);
      while(s<=z[k]){k--;s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k])}
      k++;v[k]=q;z[k]=s;z[k+1]=INF;
    }
    k=0;
    for(q=0;q<n;q++){while(z[k+1]<q)k++;d[q]=(q-v[k])*(q-v[k])+f[v[k]]}
  }

  function buildMask(){
    if(!oc||!cx)return false;
    var hr=hero.getBoundingClientRect(),lr=logo.getBoundingClientRect();
    var hw=hr.width,hh=hr.height;
    if(!hw||!hh||!logo.complete||!logo.naturalWidth||!lr.width)return false;
    var dpr=Math.min(window.devicePixelRatio||1,3);
    var s=Math.min(dpr,Math.sqrt(1500000/(hw*hh)));
    var w=Math.max(1,Math.round(hw*s)),h=Math.max(1,Math.round(hh*s));
    var key=[w,h,Math.round((lr.left-hr.left)*100),Math.round((lr.top-hr.top)*100),Math.round(lr.width),Math.round(lr.height),s.toFixed(3)].join();
    if(key===maskKey&&dist)return true;
    off.width=w;off.height=h;oc.clearRect(0,0,w,h);
    oc.drawImage(logo,(lr.left-hr.left)*s,(lr.top-hr.top)*s,lr.width*s,lr.height*s);
    var a;try{a=oc.getImageData(0,0,w,h).data}catch(err){return false}var n=w*h,i,x,y;
    dist=new Float32Array(n);
    for(i=0;i<n;i++)dist[i]=a[i*4+3]>=64?0:INF;
    var m=Math.max(w,h),f=new Float64Array(m),d=new Float64Array(m),v=new Int32Array(m),z=new Float64Array(m+1);
    for(y=0;y<h;y++){
      for(x=0;x<w;x++)f[x]=dist[y*w+x];
      dt1(f,w,d,v,z);
      for(x=0;x<w;x++)dist[y*w+x]=d[x];
    }
    for(x=0;x<w;x++){
      for(y=0;y<h;y++)f[y]=dist[y*w+x];
      dt1(f,h,d,v,z);
      for(y=0;y<h;y++)dist[y*w+x]=d[y];
    }
    gw=w;gh=h;S=s;maskKey=key;img=null;
    return true;
  }

  function render(){
    raf=0;
    if(!buildMask())return;
    var t=vals.t,f=vals.f,o=vals.o/100,i,n=gw*gh;
    if(cv.width!==gw||cv.height!==gh){cv.width=gw;cv.height=gh}
    if(!img)img=cx.createImageData(gw,gh);
    var px=img.data;
    px.fill(0);
    if(o>0&&(t>0||f>0)){
      var reach=t+f+1,reach2=reach*reach*S*S,k=1/S;
      for(i=0;i<n;i++){
        var d2=dist[i];
        if(d2>reach2)continue;
        var dd=Math.sqrt(d2)*k,al;
        if(f>0){
          if(dd<=t)al=1;else{var u=(dd-t)/f;al=u>=1?0:1-u*u*(3-2*u)}
        }else{
          al=(t-dd)*S+.5;al=al<0?0:al>1?1:al;
        }
        if(al>0){var j=i*4;px[j]=255;px[j+1]=255;px[j+2]=255;px[j+3]=Math.round(al*o*255)}
      }
    }
    cx.putImageData(img,0,0);
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(render)}
  window.__glowRender=render;

  function readouts(){
    To.textContent=vals.t.toFixed(1)+" px";Fo.textContent=vals.f.toFixed(1)+" px";Oo.textContent=vals.o.toFixed(1)+"%";
    T.setAttribute("aria-valuenow",vals.t.toFixed(1));F.setAttribute("aria-valuenow",vals.f.toFixed(1));O.setAttribute("aria-valuenow",vals.o.toFixed(1));
  }
  function onChange(){readouts();schedule()}

  /* A jog slider: the knob always sits in the middle. Drag it left/right to change the value
     (SLOW times finer than a normal slider); when you let go it springs back to the middle
     so you can keep sliding the same way as many times as you like. */
  function jog(el,key){
    var thumb=el.querySelector(".jthumb"),drag=null;
    function setOff(px){thumb.style.transform="translateX("+px+"px)"}
    el.addEventListener("pointerdown",function(e){
      var W=el.getBoundingClientRect().width,travel=Math.max(40,W-30);
      drag={x0:e.clientX||0,v0:vals[key],travel:travel,k:(LIM[key][1]-LIM[key][0])/travel/SLOW};
      try{el.setPointerCapture(e.pointerId)}catch(_){}
      el.classList.add("drag");e.preventDefault();
    });
    el.addEventListener("pointermove",function(e){
      if(!drag)return;
      var half=drag.travel/2,off=Math.max(-half,Math.min(half,(e.clientX||0)-drag.x0));
      setOff(off);
      var v=drag.v0+off*drag.k;
      vals[key]=Math.max(LIM[key][0],Math.min(LIM[key][1],v));
      onChange();
    });
    function end(){if(!drag)return;drag=null;el.classList.remove("drag");setOff(0)}
    ["pointerup","pointercancel","lostpointercapture"].forEach(function(n){el.addEventListener(n,end)});
  }
  jog(T,"t");jog(F,"f");jog(O,"o");
  function setVals(t,f,o){vals.t=t;vals.f=f;vals.o=o;onChange()}
  $("glR").onclick=function(){setVals(DEF.t,DEF.f,DEF.o)};
  $("glD").onclick=function(){panel.hidden=true};
  setVals(DEF.t,DEF.f,DEF.o);
  window.__glow={vals:vals,render:render};
  logo.addEventListener("load",schedule);
  window.addEventListener("resize",schedule);
  if(window.ResizeObserver)new ResizeObserver(schedule).observe(hero);
  schedule();

  /* press and hold the logo for 10 seconds to open the (hidden) glow panel */
  var timer=0,sx=0,sy=0;
  function cancel(){if(timer){clearTimeout(timer);timer=0}}
  logo.addEventListener("pointerdown",function(e){
    cancel();sx=e.clientX||0;sy=e.clientY||0;
    timer=setTimeout(function(){timer=0;panel.hidden=false},10000);
  });
  logo.addEventListener("pointermove",function(e){
    if(timer&&(Math.abs((e.clientX||0)-sx)>30||Math.abs((e.clientY||0)-sy)>30))cancel();
  });
  ["pointerup","pointercancel","pointerleave"].forEach(function(n){logo.addEventListener(n,cancel)});
  logo.addEventListener("contextmenu",function(e){e.preventDefault()});
})();

window.addEventListener('load',function(){dlScanSoon(4000)});

/* PWA: offline support (only on real http(s) hosting) */
(function(){try{if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}catch(e){}})();
