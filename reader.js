/* Bible Bridge in-app reader.

   Opens on top of the app (BBReader.open) and gives you the Bible text and, where there is a recording,
   the audio player with auto-scroll. The text comes from bible/<id>.bbt: each file starts with a small
   index, so only the chapter you are reading is downloaded (an HTTP Range request) and kept for offline use.

   Public: BBReader.open(translationId, bookIndex, chapter, {play:true, resume:true})
           BBReader.saved()  -> {tr, b, c} of where you stopped, or null
           BBReader.close()
*/
(function () {
  "use strict";

  /* ---------- translations ---------- */
  // ps = how Psalms are numbered ("en" or "ru"); audio = which recording belongs to it (or null)
  var TR = {
    kjv:     { id: "kjv",     short: "KJV", name: "King James Version",          lang: "en", ps: "en", audio: "kjv" },
    rst:     { id: "rst",     short: "RST", name: "Синодальный перевод",         lang: "ru", ps: "ru", audio: "rst" },
    web:     { id: "web",     short: "WEB", name: "World English Bible",         lang: "en", ps: "en", audio: null },
    bsb:     { id: "bsb",     short: "BSB", name: "Berean Standard Bible",       lang: "en", ps: "en", audio: null },
    asv:     { id: "asv",     short: "ASV", name: "American Standard Version",   lang: "en", ps: "en", audio: null },
    darby:   { id: "darby",   short: "DBY", name: "Darby Translation",           lang: "en", ps: "en", audio: null },
    webster: { id: "webster", short: "WBS", name: "Webster's Bible",             lang: "en", ps: "en", audio: null },
    ylt:     { id: "ylt",     short: "YLT", name: "Young's Literal Translation", lang: "en", ps: "en", audio: null },
    rv1909:  { id: "rv1909",  short: "RV",  name: "Reina-Valera 1909",           lang: "es", ps: "en", audio: null }
  };
  var ORDER = ["kjv", "rst", "web", "bsb", "asv", "darby", "webster", "ylt", "rv1909"];

  /* ---------- versions you add yourself ----------
     The text file you pick is kept in this device's own storage (IndexedDB) and the list of them in localStorage.
     Nothing is uploaded and nothing is written into the app's files, so a copyrighted text stays on your device only. */
  var CUSTOM_KEY = "bb-custom";
  function readCustoms() { try { var a = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  // the list is kept twice: in localStorage (read instantly at start) and next to the texts in IndexedDB (the safe copy).
  // If either goes missing or a write fails, healCustoms() rebuilds it from the other and from the texts themselves.
  function writeCustoms(a) {
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(a)); } catch (e) {}
    try { if (window.indexedDB) idbDo("readwrite", function (st) { return st.put(JSON.stringify(a), LIST_KEY); }).catch(function () {}); } catch (e) {}
  }
  var LIST_KEY = "__list";
  function addCustomTr(c) {
    TR[c.id] = { id: c.id, short: c.short, name: c.name, lang: c.lang, ps: c.lang === "ru" ? "ru" : "en", audio: c.audio ? "c:" + c.id : null, custom: true };
    if (ORDER.indexOf(c.id) < 0) ORDER.push(c.id);
  }
  function setCustomAudio(id, on) {
    var a = readCustoms();
    a.forEach(function (c) { if (c.id === id) c.audio = on ? 1 : 0; });
    writeCustoms(a);
    if (TR[id]) TR[id].audio = on ? "c:" + id : null;
  }
  readCustoms().forEach(addCustomTr);
  var customMissing = {};                              // id -> true when the list names a version whose text isn't on the device
  function healCustoms() {
    if (!window.indexedDB) return Promise.resolve();
    return idbDo("readonly", function (st) { return st.getAllKeys ? st.getAllKeys() : null; }).then(function (keys) {
      return idbDo("readonly", function (st) { return st.get(LIST_KEY); }).then(function (saved) {
        var texts = (keys || []).filter(function (k) { return k !== LIST_KEY; }), have = {};
        texts.forEach(function (k) { have[k] = true; });
        var cur = readCustoms(), byId = {}, out = [], changed = false;
        cur.forEach(function (c) { if (c && c.id && !byId[c.id]) { byId[c.id] = c; out.push(c); } });
        var safe = []; try { safe = JSON.parse(saved || "[]") || []; } catch (e) {}
        safe.forEach(function (c) { if (c && c.id && !byId[c.id] && have[c.id]) { byId[c.id] = c; out.push(c); changed = true; } });
        texts.forEach(function (k) {                    // a text with no entry at all: give it a plain one so it isn't lost
          if (!byId[k] && /^[a-z0-9]{1,14}$/.test(k)) { var c = { id: k, short: k.toUpperCase(), name: k.toUpperCase(), lang: "en", audio: 0 }; byId[k] = c; out.push(c); changed = true; }
        });
        customMissing = {};
        out.forEach(function (c) { if (!have[c.id]) customMissing[c.id] = true; });
        out.forEach(function (c) { if (!TR[c.id]) addCustomTr(c); });
        if (changed || JSON.stringify(safe) !== JSON.stringify(out) || JSON.stringify(cur) !== JSON.stringify(out)) writeCustoms(out);
        if (changed) { try { window.dispatchEvent(new Event("bb-custom")); } catch (e) {} }
        dlEmit();
      });
    }).catch(function () {});
  }
  function idbDo(mode, fn) {
    return new Promise(function (res, rej) {
      var q = indexedDB.open("bbcustom", 1);
      q.onupgradeneeded = function () { q.result.createObjectStore("t"); };
      q.onerror = function () { rej(q.error); };
      q.onsuccess = function () {
        var db = q.result, tx = db.transaction("t", mode), r = fn(tx.objectStore("t"));
        tx.oncomplete = function () { var v = r && r.result; db.close(); res(v); };
        tx.onerror = tx.onabort = function () { var e = tx.error; db.close(); rej(e || new Error("storage")); };
      };
    });
  }

  /* audio for versions you added lives in its own database, one entry per chapter (key: the chapter's audio address,
     value: { b: the file, d: its length in seconds }). Fetching one chapter never needs a list of everything. */
  function adb(mode, fn) {
    return new Promise(function (res, rej) {
      var q = indexedDB.open("bbaudio", 1);
      q.onupgradeneeded = function () { q.result.createObjectStore("f"); };
      q.onerror = function () { rej(q.error); };
      q.onblocked = function () { rej(new Error("audio storage busy")); };
      q.onsuccess = function () {
        var db = q.result, tx = db.transaction("f", mode), r = fn(tx.objectStore("f"));
        tx.oncomplete = function () { var v = r && r.result; db.close(); res(v); };
        tx.onerror = tx.onabort = function () { var e = tx.error; db.close(); rej(e || new Error("audio storage")); };
      };
    });
  }
  // a storage call that hasn't answered in time counts as failed, so the screen never freezes waiting on it
  function tmo(p, ms, what) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error((what || "storage") + " didn't answer")); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }
  function adbKeys(lo, hi) { return adb("readonly", function (st) { return st.getAllKeys(lo != null ? IDBKeyRange.bound(lo, hi) : undefined); }); }

  var NAMES = {
    en: ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel",
      "1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
      "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
      "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark",
      "Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
      "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews",
      "James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],
    ru: ["Бытие","Исход","Левит","Числа","Второзаконие","Иисус Навин","Судьи","Руфь","1 Царств","2 Царств",
      "3 Царств","4 Царств","1 Паралипоменон","2 Паралипоменон","Ездра","Неемия","Есфирь","Иов","Псалтирь","Притчи",
      "Екклесиаст","Песня Песней","Исаия","Иеремия","Плач Иеремии","Иезекииль","Даниил","Осия","Иоиль","Амос",
      "Авдий","Иона","Михей","Наум","Аввакум","Софония","Аггей","Захария","Малахия","От Матфея","От Марка",
      "От Луки","От Иоанна","Деяния","Римлянам","1 Коринфянам","2 Коринфянам","Галатам","Ефесянам","Филиппийцам",
      "Колоссянам","1 Фессалоникийцам","2 Фессалоникийцам","1 Тимофею","2 Тимофею","Титу","Филимону","Евреям",
      "Иакова","1 Петра","2 Петра","1 Иоанна","2 Иоанна","3 Иоанна","Иуды","Откровение"],
    es: ["Génesis","Éxodo","Levítico","Números","Deuteronomio","Josué","Jueces","Rut","1 Samuel","2 Samuel",
      "1 Reyes","2 Reyes","1 Crónicas","2 Crónicas","Esdras","Nehemías","Ester","Job","Salmos","Proverbios",
      "Eclesiastés","Cantares","Isaías","Jeremías","Lamentaciones","Ezequiel","Daniel","Oseas","Joel","Amós",
      "Abdías","Jonás","Miqueas","Nahúm","Habacuc","Sofonías","Hageo","Zacarías","Malaquías","Mateo","Marcos",
      "Lucas","Juan","Hechos","Romanos","1 Corintios","2 Corintios","Gálatas","Efesios","Filipenses",
      "Colosenses","1 Tesalonicenses","2 Tesalonicenses","1 Timoteo","2 Timoteo","Tito","Filemón","Hebreos",
      "Santiago","1 Pedro","2 Pedro","1 Juan","2 Juan","3 Juan","Judas","Apocalipsis"]
  };

  var S = {
    en: { end: "End of the Bible", loading: "Loading…", tapStart: "Tap play to start",
      failStart: "Audio did not start. Tap play to try again.", failLoad: "Audio did not load. Check your connection, then tap play.",
      failNone: "No audio is saved for this chapter. Add it from this version's download screen.", failFile: "This chapter's audio file couldn't be played. Try adding it again.",
      chip: function (x) { return "Playing " + x + " · Jump there"; }, followChip: "Resume auto-scroll", textSize: "Text size", reset: "Reset",
      resetLabel: "Reset text size to standard", auto: "Auto", autoLabel: "Scroll along with the audio", resume: "Ready to resume · tap play",
      play: "Play", pause: "Pause", prev: "Previous chapter", next: "Next chapter", back: "Back", smaller: "Smaller text",
      larger: "Larger text", speed: "Playback speed", seek: "Seek", jump: "Go to the chapter that is playing",
      trLabel: "Bible translation", withAudio: "Text and audio", textOnly: "Text only",
      scrollLabel: "Scrolling", smoothName: "Smooth scrolling while listening", smoothHelp: "The text glides instead of moving a pixel at a time", on: "On", off: "Off",
      noText: "The text did not load. Check your connection.", retry: "Try again" },
    ru: { end: "Конец Библии", loading: "Загрузка…", tapStart: "Нажмите «Воспроизвести»",
      failStart: "Аудио не запустилось. Нажмите «Воспроизвести» ещё раз.", failNone: "Для этой главы аудио не сохранено. Добавьте его на экране загрузки этого перевода.", failFile: "Не удалось воспроизвести аудиофайл этой главы. Попробуйте добавить его снова.", failLoad: "Аудио не загрузилось. Проверьте соединение и нажмите «Воспроизвести».",
      chip: function (x) { return "Играет " + x + " · Перейти"; }, followChip: "Возобновить автопрокрутку", textSize: "Размер текста", reset: "Сброс",
      resetLabel: "Вернуть стандартный размер текста", auto: "Авто", autoLabel: "Прокручивать вместе с аудио", resume: "Готово продолжить · нажмите «Воспроизвести»",
      play: "Воспроизвести", pause: "Пауза", prev: "Предыдущая глава", next: "Следующая глава", back: "Назад", smaller: "Мельче",
      larger: "Крупнее", speed: "Скорость", seek: "Перемотка", jump: "К воспроизводимой главе",
      trLabel: "Перевод Библии", withAudio: "Текст и аудио", textOnly: "Только текст",
      scrollLabel: "Прокрутка", smoothName: "Плавная прокрутка при прослушивании", smoothHelp: "Текст скользит плавно, а не скачет по пикселю", on: "Вкл.", off: "Выкл.",
      noText: "Текст не загрузился. Проверьте соединение.", retry: "Повторить" },
    es: { end: "Fin de la Biblia", loading: "Cargando…", tapStart: "Toca reproducir para empezar",
      failStart: "El audio no empezó. Toca reproducir para intentarlo de nuevo.", failNone: "No hay audio guardado para este capítulo. Agrégalo desde la pantalla de descargas de esta versión.", failFile: "No se pudo reproducir el audio de este capítulo. Intenta agregarlo de nuevo.", failLoad: "El audio no cargó. Revisa tu conexión y toca reproducir.",
      chip: function (x) { return "Reproduciendo " + x + " · Ir allí"; }, followChip: "Reanudar desplazamiento automático", textSize: "Tamaño del texto", reset: "Restablecer",
      resetLabel: "Restablecer el tamaño estándar del texto", auto: "Auto", autoLabel: "Desplazar junto con el audio", resume: "Listo para continuar · toca reproducir",
      play: "Reproducir", pause: "Pausa", prev: "Capítulo anterior", next: "Capítulo siguiente", back: "Atrás", smaller: "Texto más pequeño",
      larger: "Texto más grande", speed: "Velocidad de reproducción", seek: "Buscar", jump: "Ir al capítulo que se está reproduciendo",
      trLabel: "Traducción", withAudio: "Texto y audio", textOnly: "Solo texto",
      scrollLabel: "Desplazamiento", smoothName: "Desplazamiento suave al escuchar", smoothHelp: "El texto se desliza en lugar de moverse píxel a píxel", on: "Sí", off: "No",
      noText: "No se pudo cargar el texto. Revisa tu conexión.", retry: "Reintentar" }
  };

  // KJV audio (AudioTreasure) and Russian Synodal audio (Digital Bible Society, the same recording the app already links to)
  var KJV_BASE = "https://www.audiotreasure.com/content/KJV_AT/";
  var KJV_AUD = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1Samuel","2Samuel",
    "1Kings","2Kings","1Chronicles","2Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
    "Ecclesiastes","Song_of_Soloman","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
    "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark",
    "Luke","John","Acts","Romans","1Corinthians","2Corinthians","Galatians","Ephesians","Philippians",
    "Colossians","1Thessalonians","2Thessalonians","1Timothy","2Timothy","Titus","Philemon","Hebrews",
    "James","1Peter","2Peter","1John","2John","3John","Jude","Revelation"];
  var NO_NUM = { 56: 1, 62: 1, 63: 1, 64: 1 };      // one-chapter books have no chapter number in the file name
  var DBS_BASE = "https://dbs.org/cdn/audio/RUSS76_ISA_FB_N/";

  /* ---------- small helpers ---------- */
  // the browser must not put the page back to its own idea of "where you were" after a reload: the reader does that itself
  var prevRestoration = null;
  function manualScroll(on) {
    try {
      if (!("scrollRestoration" in history)) return;
      if (on) { if (prevRestoration === null) prevRestoration = history.scrollRestoration; history.scrollRestoration = "manual"; }
      else if (prevRestoration !== null) { history.scrollRestoration = prevRestoration; prevRestoration = null; }
    } catch (e) {}
  }
  if (/^#\/read\//.test(location.hash)) manualScroll(true);
  var root = null;                                   // the reader's own page, built the first time it opens
  var html = document.documentElement;
  function $(s) { return root.querySelector(s); }
  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }
  function same(a, b) { return !!a && !!b && a.b === b.b && a.c === b.c; }
  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    s = Math.floor(s);
    var m = Math.floor(s / 60), r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Psalm numbers differ between English and the Russian Synodal Bible
  function psEnToRu(n) {
    if (n <= 9) return n; if (n === 10) return 9; if (n <= 113) return n - 1; if (n <= 115) return 113;
    if (n === 116) return 114; if (n <= 146) return n - 1; if (n === 147) return 146; return n;
  }
  function psRuToEn(n) {
    if (n <= 9) return n; if (n <= 112) return n + 1; if (n === 113) return 114; if (n === 114 || n === 115) return 116;
    if (n <= 145) return n + 1; if (n === 146 || n === 147) return 147; return n;
  }

  function toast(msg, ms) {
    var t = $("#rd-toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toast.h);
    toast.h = setTimeout(function () { t.hidden = true; }, ms || 5000);
  }

  /* ---------- Bible text: one file per translation, read by byte range ---------- */
  var CACHE_NAME = "bbtext-v1";                      // kept apart from the app's own cache so updates do not wipe it
  var idxP = {};                                     // id -> promise of the parsed index
  var whole = {};                                    // id -> whole file, only if the server ignores Range requests
  var Ds = {};                                       // id -> [book][chapter-1] = verse array once loaded
  var fileUrl = function (id) { return "bible/" + id + ".bbt"; };

  function cacheGet(key) {
    try {
      if (!window.caches) return Promise.resolve(null);
      return caches.open(CACHE_NAME).then(function (c) { return c.match(new Request(new URL(key, location.href).href)); })
        .then(function (r) { return r ? r.arrayBuffer() : null; }).catch(function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }
  function cachePut(key, buf) {
    try {
      if (!window.caches) return;
      caches.open(CACHE_NAME).then(function (c) { return c.put(new Request(new URL(key, location.href).href), new Response(buf, { status: 200 })); }).catch(function () {});
    } catch (e) {}
  }
  function fetchRange(u, a, b) {                     // a..b inclusive, in bytes
    return fetch(u, { headers: { Range: "bytes=" + a + "-" + b } }).then(function (r) {
      if (r.status === 206) return r.arrayBuffer().then(function (buf) { return { buf: buf, part: true }; });
      if (r.status === 200) return r.arrayBuffer().then(function (buf) { return { buf: buf, part: false }; });
      throw new Error("HTTP " + r.status);
    });
  }
  function joinBuf(a, b) {
    var out = new Uint8Array(a.byteLength + b.byteLength);
    out.set(new Uint8Array(a), 0); out.set(new Uint8Array(b), a.byteLength);
    return out.buffer;
  }
  function parseIndex(buf, id) {
    var L = parseInt(new TextDecoder("ascii").decode(buf.slice(0, 10)), 10);
    var j = JSON.parse(new TextDecoder("utf-8").decode(buf.slice(10, 10 + L)));
    var start = 10 + L, pos = start, off = [];
    for (var b = 0; b < j.b.length; b++) {
      var row = [];
      for (var c = 0; c < j.b[b].length; c++) { row.push(pos); pos += j.b[b][c]; }
      off.push(row);
    }
    return { id: id, len: j.b, off: off };
  }
  function getIndex(id) {
    if (idxP[id]) return idxP[id];
    if (TR[id] && TR[id].custom) {                      // a version you added: the whole file is in this device's storage
      var pc = idbDo("readonly", function (st) { return st.get(id); }).then(function (buf) {
        if (!buf) throw new Error("missing");
        whole[id] = buf;
        var ix = parseIndex(buf, id);
        Ds[id] = ix.len.map(function (row) { return new Array(row.length); });
        return ix;
      });
      pc.catch(function () { delete idxP[id]; });
      idxP[id] = pc;
      return pc;
    }
    var key = fileUrl(id) + "?idx";
    var p = cacheGet(key).then(function (hit) {
      if (hit) return hit;
      return fetchRange(fileUrl(id), 0, 16383).then(function (res) {
        var buf = res.buf;
        if (!res.part) whole[id] = buf;
        var L = parseInt(new TextDecoder("ascii").decode(buf.slice(0, 10)), 10);
        if (!(L > 0)) throw new Error("bad file");
        var need = 10 + L;
        if (buf.byteLength >= need) return buf.slice(0, need);
        return fetchRange(fileUrl(id), buf.byteLength, need - 1).then(function (r2) { return joinBuf(buf, r2.buf); });
      }).then(function (buf) { cachePut(key, buf); return buf; });
    }).then(function (buf) {
      var ix = parseIndex(buf, id);
      Ds[id] = ix.len.map(function (row) { return new Array(row.length); });
      return ix;
    });
    p.catch(function () { delete idxP[id]; });         // try again next time
    idxP[id] = p;
    return p;
  }
  function chapterBytes(ix, b, c) {
    var a = ix.off[b][c - 1], n = ix.len[b][c - 1], id = ix.id;
    if (!n) return Promise.resolve(new ArrayBuffer(0));
    if (whole[id]) return Promise.resolve(whole[id].slice(a, a + n));
    var key = fileUrl(id) + "?c=" + b + "." + c;
    return cacheGet(key).then(function (hit) {
      if (hit && hit.byteLength === n) return hit;
      return fetchRange(fileUrl(id), a, a + n - 1).then(function (res) {
        var buf = res.part ? res.buf : (whole[id] = res.buf).slice(a, a + n);
        if (buf.byteLength !== n) throw new Error("size");
        cachePut(key, buf);
        return buf;
      });
    });
  }
  // make sure one chapter's verses are in memory (D[b][c-1])
  function need(b, c, t) {
    t = t || tr;
    var id = t.id;
    return getIndex(id).then(function (ix) {
      var Dt = Ds[id];
      if (!Dt[b] || c < 1 || c > Dt[b].length) throw new Error("no such chapter");
      if (Dt[b][c - 1]) return;
      return chapterBytes(ix, b, c).then(function (buf) {
        Dt[b][c - 1] = new TextDecoder("utf-8").decode(buf).split("\n");
      });
    });
  }


  /* ---------- downloads: text and audio kept on the device, but only when you ask ---------- */
  var AUDIO_CACHE = "bbaudio-v1";                    // audio files you chose to download
  var CH_TOTAL = 1189;                               // chapters in the Bible
  var audioHave = {};                                // audio url -> true, for chapters saved on this device
  var dlJobs = {}, dlSubs = [];

  var audioScanned = false;                          // true once the startup look through saved audio has finished
  var audioScanP = null, cacheStuck = false;          // cacheStuck: the older audio store (Cache Storage) isn't answering
  function loadAudioHave() {
    // one look at a time; on a busy phone the first look can fail, so try again before giving up,
    // and if it still fails say so -- never treat a failed look as "no audio saved"
    if (audioScanP) return audioScanP;
    var dbOk = false, tries = 0;
    function lookDb() {
      if (!window.indexedDB) return Promise.resolve();
      return tmo(adbKeys(), 10000, "audio database").then(function (ks) {
        for (var i = 0; i < ks.length; i++) audioHave[ks[i]] = true;
        dbOk = true;
      }, function () { if (++tries < 3) return new Promise(function (r) { setTimeout(r, 600 * tries); }).then(lookDb); });
    }
    function lookCache() {
      if (!window.caches) { cacheStuck = false; return Promise.resolve(); }
      return tmo(caches.open(AUDIO_CACHE).then(function (c) { return c.keys(); }), 6000, "saved audio").then(function (ks) {
        for (var i = 0; i < ks.length; i++) audioHave[ks[i].url] = true;
        cacheStuck = false;
      }, function () { cacheStuck = true; });
    }
    audioScanP = Promise.all([lookDb(), lookCache()]).then(function () {
      audioScanned = true; audioScanP = null;
      if (!dbOk && cacheStuck) throw new Error("couldn't read saved audio");
    }, function (e) { audioScanned = true; audioScanP = null; throw e; });
    return audioScanP;
  }
  /* ---------- MP3 length check ----------
     Some audio Bibles build each chapter-1 file by gluing a short "Genesis, chapter 1" clip onto the front of the
     chapter. The clip's own header (Xing/Info or VBRI) then sits at the start of the whole file and says the file is
     only a few seconds long. Safari on iPhone believes it, so the player shows 0:03 and the follow-along scroll runs
     straight to the bottom while the chapter keeps playing. mp3Scan() counts the real audio frames, and when the
     header disagrees it writes the true length into the header (or disables a VBRI one) so every browser gets it right. */
  var MP3_BR = [[0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0], [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]];
  var MP3_SR = [44100, 48000, 32000, 0];
  function mp3Head(u, i) {                            // one Layer III frame header at i: { len, spf, sr } or null
    if (i + 4 > u.length || u[i] !== 0xFF || (u[i + 1] & 0xE0) !== 0xE0) return null;
    var ver = (u[i + 1] >> 3) & 3, lay = (u[i + 1] >> 1) & 3;
    if (ver === 1 || lay !== 1) return null;           // reserved version, or not Layer III
    var bri = u[i + 2] >> 4, sri = (u[i + 2] >> 2) & 3, pad = (u[i + 2] >> 1) & 1;
    if (bri === 0 || bri === 15 || sri === 3) return null;
    var v1 = ver === 3, sr = MP3_SR[sri] / (v1 ? 1 : ver === 2 ? 2 : 4), br = MP3_BR[v1 ? 0 : 1][bri] * 1000;
    var len = Math.floor((v1 ? 144 : 72) * br / sr) + pad;
    return len > 4 ? { len: len, spf: v1 ? 1152 : 576, sr: sr, v1: v1, mono: (u[i + 3] >> 6) === 3 } : null;
  }
  function id3Len(u, i) {                             // size of an ID3v2 tag starting at i, or 0
    if (i + 10 > u.length || u[i] !== 0x49 || u[i + 1] !== 0x44 || u[i + 2] !== 0x33) return 0;
    var n = ((u[i + 6] & 127) << 21) | ((u[i + 7] & 127) << 14) | ((u[i + 8] & 127) << 7) | (u[i + 9] & 127);
    return 10 + n + ((u[i + 5] & 0x10) ? 10 : 0);
  }
  function mp3Scan(buf) {
    var u = new Uint8Array(buf), i = 0, frames = [], samples = 0, sr = 0, first = -1, guard = 0;
    while (i < u.length - 4 && guard++ < 2000000) {
      var t = id3Len(u, i); if (t) { i += t; continue; }
      var h = mp3Head(u, i);
      if (h && (i + h.len >= u.length - 4 || mp3Head(u, i + h.len) || id3Len(u, i + h.len))) {
        if (first < 0) first = i;
        frames.push(i); samples += h.spf; if (!sr) sr = h.sr;
        i += h.len; continue;
      }
      i++;                                             // not a frame: slide forward until the next real one
    }
    if (!frames.length || !sr) return { dur: 0, fixed: null };
    var dur = samples / sr, fixed = null;
    var fh = mp3Head(u, first), side = fh.v1 ? (fh.mono ? 17 : 32) : (fh.mono ? 9 : 17);
    var tagAt = function (x) { return x + 4 <= u.length ? String.fromCharCode(u[x], u[x + 1], u[x + 2], u[x + 3]) : ""; };
    var x = first + 4 + side, tag = tagAt(x), said = -1;
    if (tag === "Xing" || tag === "Info") { var fl = (u[x + 4] << 24 | u[x + 5] << 16 | u[x + 6] << 8 | u[x + 7]) >>> 0; if (fl & 1) said = (u[x + 8] << 24 | u[x + 9] << 16 | u[x + 10] << 8 | u[x + 11]) >>> 0; }
    else if (tagAt(first + 36) === "VBRI") { tag = "VBRI"; said = (u[first + 50] << 24 | u[first + 51] << 16 | u[first + 52] << 8 | u[first + 53]) >>> 0; }
    else tag = "";
    if (tag) {
      // a second header further in means two recordings were glued together ("Genesis, chapter 1" + the chapter)
      var glued = false;
      for (var q = 1; q < frames.length && !glued; q++) {
        var hq = mp3Head(u, frames[q]); if (!hq) continue;
        var xq = frames[q] + 4 + (hq.v1 ? (hq.mono ? 17 : 32) : (hq.mono ? 9 : 17)), tq = tagAt(xq);
        if (tq === "Xing" || tq === "Info" || tagAt(frames[q] + 36) === "VBRI") glued = true;
      }
      var real = frames.length - 1;
      if (glued || (said >= 0 && Math.abs(said - real) > Math.max(10, real * 0.02))) {
        // leave the audio untouched and simply drop that one header frame (it holds no sound). With no header left,
        // the browser works the length out from the file itself.
        var flen = fh.len, out = new Uint8Array(u.length - flen);
        out.set(u.subarray(0, first), 0); out.set(u.subarray(first + flen), first);
        fixed = out.buffer;
      }
    }
    return { dur: dur, fixed: fixed };
  }
  // check (and if needed repair) one audio file; resolves { blob, dur } -- the original blob if it was fine or isn't MP3
  function checkAudio(bl) {
    if (!bl || !/mpeg|mp3/i.test(bl.type || "audio/mpeg") || bl.size > 80e6) return Promise.resolve({ blob: bl, dur: 0 });
    return bl.arrayBuffer().then(function (buf) {
      var r = mp3Scan(buf);
      return { blob: r.fixed ? new Blob([r.fixed], { type: "audio/mpeg" }) : bl, dur: r.dur, changed: !!r.fixed };
    }).catch(function () { return { blob: bl, dur: 0 }; });
  }
  function audioResp(bl, dur) {
    var hd = { "Content-Type": bl.type || "audio/mpeg" };
    if (dur > 0) hd["X-BB-Len"] = String(Math.round(dur * 1000) / 1000);
    hd["X-BB-Chk"] = "2";                              // checked by the current rules
    return new Response(bl, { status: 200, headers: hd });
  }
  // give an audio element a chapter: from this device when it is saved here, otherwise from the internet
  function setSrc(el, b, c, after) {
    var u = audioUrlFor(tr, b, c), n = el._sq = (el._sq || 0) + 1;
    if (el._bu) { try { URL.revokeObjectURL(el._bu); } catch (e) {} el._bu = null; }
    el._estD = 0; el._none = false;
    var cust = !!(tr && tr.custom);
    function use(k) {
      if (el._sq !== n) return;
      if (k && k.blob) { el._estD = k.dur || 0; el._bu = URL.createObjectURL(k.blob); el.src = el._bu; audioHave[u] = true; }
      else if (cust) { delete audioHave[u]; el._none = true; el.removeAttribute("src"); try { el.load(); } catch (e) {} if (el === A && playing) setMsg(T().failNone); }   // an added version has no copy online
      else { el.src = u; }                               // not saved here (or storage not answering): stream it
      if (after) after();
    }
    if (!u) { el.src = u; if (after) after(); return; }
    if (cust) {
      tmo(adb("readonly", function (st) { return st.get(u); }), 6000, "audio database").catch(function () { return null; }).then(function (v) {
        if (v && v.b) return { blob: v.b, dur: v.d || 0 };
        return oldCacheFile(u, true);                   // saved before the database existed: move it over now
      }).catch(function () { return null; }).then(use);
      return;
    }
    if (!window.caches || (!audioHave[u] && audioScanned) || cacheStuck) { use(null); return; }
    tmo(caches.open(AUDIO_CACHE).then(function (ca) { return ca.match(new Request(u)); }).then(function (r) {
      return r ? r.blob().then(function (bl) { var k = parseFloat(r.headers.get("X-BB-Len") || ""); return { blob: bl, dur: k > 0 ? k : 0 }; }) : null;
    }), 4000, "saved audio").catch(function () { return null; }).then(use);
  }
  // one file from the older audio store (Cache Storage), with a time limit. move: also put it in the database and drop the old copy
  function oldCacheFile(u, move) {
    if (!window.caches || cacheStuck) return Promise.resolve(null);
    var ca0 = null;
    return tmo(caches.open(AUDIO_CACHE).then(function (ca) { ca0 = ca; return ca.match(new Request(u)); }), 5000, "saved audio").then(function (r) {
      if (!r) return null;
      var known = parseFloat(r.headers.get("X-BB-Len") || ""), chk = r.headers.get("X-BB-Chk") === "2";
      return r.blob().then(function (bl) {
        return (chk && known > 0 ? Promise.resolve({ blob: bl, dur: known }) : checkAudio(bl)).then(function (k) {
          if (!move || !window.indexedDB) return k;
          return adb("readwrite", function (st) { return st.put({ b: k.blob, d: k.dur || 0 }, u); }).then(function () {
            return ca0.delete(new Request(u)).catch(function () {});
          }).then(function () { audioHave[u] = true; return k; }, function () { return k; });
        });
      });
    }).catch(function () { return null; });
  }

  function dlEmit() { for (var i = 0; i < dlSubs.length; i++) { try { dlSubs[i](); } catch (e) {} } }
  function cacheStrict(name, key, body) {            // like cachePut, but says if it did not fit
    return caches.open(name).then(function (c) { return c.put(new Request(key), body); });
  }
  function removeCustomAudio(t) {
    var base = audioBase(t), id = t.id;
    var fromDb = window.indexedDB ? tmo(adb("readwrite", function (st) { return st.delete(IDBKeyRange.bound(base, base + "\uffff")); }), 30000, "audio database").catch(function () {}) : Promise.resolve();
    var fromOld = window.caches && !cacheStuck ? tmo(caches.open(AUDIO_CACHE).then(function (c) {
      return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.url.indexOf("/bbcustom/" + id + "/") >= 0; }).map(function (k) { return c.delete(k); })); });
    }), 20000, "saved audio").catch(function () {}) : Promise.resolve();
    return Promise.all([fromDb, fromOld]).then(function () {
      for (var k in audioHave) if (k.indexOf(base) === 0 || k.indexOf("/bbcustom/" + id + "/") >= 0) delete audioHave[k];
    });
  }
  function audioBase(t) {                            // the start of every audio address that belongs to this translation
    if (t.custom) return new URL("bbcustom/" + t.id + "/", location.href).href;
    return t.audio === "rst" ? DBS_BASE : KJV_BASE;
  }
  function haveText(id) {
    var out = {};
    if (TR[id] && TR[id].custom) {                      // your own file holds every chapter -- if it is really here
      return idbDo("readonly", function (st) { return st.getKey ? st.getKey(id) : st.count(id); }).then(function (k) {
        if (k === undefined || k === 0) { customMissing[id] = true; return out; }
        delete customMissing[id];
        for (var cb = 0; cb < CH_COUNT.length; cb++) for (var cc = 1; cc <= CH_COUNT[cb]; cc++) out[cb + "." + cc] = true;
        return out;
      }).catch(function () { return out; });
    }
    if (!window.caches) return Promise.resolve(out);
    var re = new RegExp("bible/" + id + "\\.bbt\\?c=(\\d+)\\.(\\d+)$");
    return caches.open(CACHE_NAME).then(function (c) { return c.keys(); }).then(function (ks) {
      for (var i = 0; i < ks.length; i++) { var m = re.exec(ks[i].url); if (m) out[m[1] + "." + m[2]] = true; }
      return out;
    }).catch(function () { return out; });
  }
  function haveAudio(t) {
    var out = {};
    if (!(t.audio || t.custom)) return Promise.resolve(out);
    return loadAudioHave().then(function () {
      if (cacheStuck && !t.custom) throw new Error("saved audio isn't answering");   // the screen then says it couldn't check, not "0"
      return audioHave;
    });
  }
  // how much is saved, without needing the book index (for the little icons in the version list)
  function dlQuick(id) {
    var t = TR[id];
    return Promise.all([haveText(id), t && (t.audio || t.custom) ? haveAudio(t) : Promise.resolve(null)]).then(function (r) {
      var tx = Object.keys(r[0]).length, au = null;
      if (r[1]) {
        var n = 0;
        for (var u in r[1]) if (u.indexOf(audioBase(t)) === 0) n++;
        au = n;
      }
      return { text: tx, audio: au, total: CH_TOTAL };
    });
  }
  // full picture for one translation: every book, every chapter
  function dlStatus(id) {
    var t = TR[id];
    return getIndex(id).catch(function (e) {
      // an added version whose text is gone still has a shape (a whole Bible) so its audio can be shown and kept
      if (t && t.custom) return { len: CH_COUNT.map(function (n) { var a = []; for (var i = 0; i < n; i++) a.push(1); return a; }) };
      throw e;
    }).then(function (ix) {
      return Promise.all([haveText(id), t.audio || t.custom ? haveAudio(t) : Promise.resolve(null)]).then(function (r) {
        function build(isHave) {
          var books = [], done = 0, total = 0;
          for (var b = 0; b < ix.len.length; b++) {
            var chs = [], d = 0;
            for (var c = 1; c <= ix.len[b].length; c++) { var ok = ix.len[b][c - 1] > 0 && isHave(b, c); chs.push(ok ? 1 : 0); if (ok) d++; }
            books.push({ done: d, total: chs.length, chs: chs }); done += d; total += chs.length;
          }
          return { done: done, total: total, books: books };
        }
        return {
          text: build(function (b, c) { return !!r[0][b + "." + c]; }),
          audio: r[1] ? build(function (b, c) { return !!r[1][audioUrlFor(t, b, c)]; }) : null
        };
      });
    });
  }
  function saveText(ix, b, c) {
    var n = ix.len[b][c - 1];
    if (!n) return Promise.resolve();
    var key = new URL(fileUrl(ix.id) + "?c=" + b + "." + c, location.href).href;
    return cacheGet(fileUrl(ix.id) + "?c=" + b + "." + c).then(function (hit) {
      if (hit && hit.byteLength === n) return;
      return fetchRange(fileUrl(ix.id), ix.off[b][c - 1], ix.off[b][c - 1] + n - 1).then(function (res) {
        var buf = res.part ? res.buf : res.buf.slice(ix.off[b][c - 1], ix.off[b][c - 1] + n);
        if (buf.byteLength !== n) throw new Error("size");
        return cacheStrict(CACHE_NAME, key, new Response(buf, { status: 200 }));
      });
    });
  }
  // other file names the Russian host might use for a book (the app's first guess is tried first)
  function altUrls(t, b, c) {
    var u = audioUrlFor(t, b, c), out = [u];
    if (t && t.audio === "rst" && b === 21) {
      ["SongofSolomon", "Song_of_Solomon", "Song_of_Songs", "SongOfSolomon", "SongOfSongs", "Song"].forEach(function (nm) {
        var n = "22_" + nm;
        out.push(DBS_BASE + "OT_RUSS76/" + n + "/" + n + "_" + pad(c, 3) + ".mp3");
      });
    }
    return out;
  }
  function fetchFirst(list, i) {
    return fetch(list[i], { mode: "cors" }).then(function (r) {
      if (!r.ok) { var e = new Error("HTTP " + r.status); e.http = r.status; throw e; }
      return r.blob();
    }).catch(function (e) {
      if (e && e.http === 404 && i + 1 < list.length) return fetchFirst(list, i + 1);
      throw e;
    });
  }
  function saveAudio(t, b, c) {
    var u = audioUrlFor(t, b, c);
    if (!u || audioHave[u]) return Promise.resolve();
    return fetchFirst(altUrls(t, b, c), 0).then(function (bl) {
      return cacheStrict(AUDIO_CACHE, u, new Response(bl, { status: 200, headers: { "Content-Type": bl.type || "audio/mpeg" } }));
    }).then(function () { audioHave[u] = true; });
  }
  function failText(e) {
    if (e && (e.name === "QuotaExceededError" || /quota/i.test(e.message || ""))) return "full";
    if (typeof navigator !== "undefined" && navigator.onLine === false) return "offline";
    return "failed";
  }
  function runJob(j, ix) {
    var t = TR[j.id];
    (function step() {
      if (j.paused) { j.running = false; dlEmit(); return; }
      if (j.i >= j.list.length) { j.running = false; j.finished = true; dlEmit(); return; }
      var p = j.list[j.i];
      j.at = p;
      (j.kind === "text" ? saveText(ix, p[0], p[1]) : saveAudio(t, p[0], p[1])).then(function () {
        j.i++; j.done = j.i; dlEmit(); step();
      }, function (e) {
        // a chapter the host simply doesn't have: skip it, keep going with the rest
        if (e && e.http === 404) { (j.skipped = j.skipped || []).push(p); j.i++; j.done = j.i; dlEmit(); step(); return; }
        j.running = false; j.error = failText(e); dlEmit();
      });
    })();
  }
  // pairs: [[book, chapter], ...] or null for the whole Bible
  function dlStart(id, kind, pairs) {
    var key = id + "|" + kind;
    if (!window.caches) { dlJobs[key] = { id: id, kind: kind, list: [], i: 0, done: 0, total: 0, running: false, error: "nocache" }; dlEmit(); return Promise.resolve(); }
    var old = dlJobs[key];
    if (old && old.running) return Promise.resolve();
    return getIndex(id).then(function (ix) {
      var list = pairs;
      if (!list) { list = []; for (var b = 0; b < ix.len.length; b++) for (var c = 1; c <= ix.len[b].length; c++) if (ix.len[b][c - 1] > 0) list.push([b, c]); }
      var j = { id: id, kind: kind, list: list, i: 0, done: 0, total: list.length, paused: false, running: true, error: "", finished: false, at: null };
      dlJobs[key] = j; dlEmit(); runJob(j, ix);
    }, function () { dlJobs[key] = { id: id, kind: kind, list: [], i: 0, done: 0, total: 0, running: false, error: failText() }; dlEmit(); });
  }
  function dlPause(id, kind) { var j = dlJobs[id + "|" + kind]; if (j && j.running) { j.paused = true; } }
  function dlResume(id, kind) {
    var j = dlJobs[id + "|" + kind];
    if (!j || j.running || j.finished) return Promise.resolve();
    return getIndex(id).then(function (ix) { j.paused = false; j.running = true; j.error = ""; dlEmit(); runJob(j, ix); });
  }
  function dlRemove(id, kind) {
    if (TR[id] && TR[id].custom && kind === "text") return removeVersion(id);
    var key = id + "|" + kind, j = dlJobs[key];
    if (j) { j.paused = true; j.running = false; delete dlJobs[key]; }
    if (TR[id] && TR[id].custom && kind === "audio") return removeCustomAudio(TR[id]).then(function () { setCustomAudio(id, false); dlEmit(); });
    if (!window.caches) return Promise.resolve();
    if (kind === "text") {
      var re = new RegExp("bible/" + id + "\\.bbt\\?c=");
      return caches.open(CACHE_NAME).then(function (c) {
        return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return re.test(k.url); }).map(function (k) { return c.delete(k); })); });
      }).then(function () { dlEmit(); });
    }
    var t = TR[id], base = audioBase(t);
    if (t.custom) return removeCustomAudio(t).then(function () { setCustomAudio(id, false); dlEmit(); });
    return caches.open(AUDIO_CACHE).then(function (c) {
      return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.url.indexOf(base) === 0; }).map(function (k) { delete audioHave[k.url]; return c.delete(k); })); });
    }).then(function () { dlEmit(); });
  }

  /* ---------- audio you saved yourself: pick the files (or a zip of them) and keep every chapter on this device ---------- */
  function normName(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var AUD_ALIAS = { songofsongs: 21, songofsolomon: 21, songofsoloman: 21, psalm: 18, revelations: 65 };
  // "43_John001.mp3", "John001.mp3", "62_1John001.mp3" ... -> { b, c } or null
  // book names (and common short forms) to look for anywhere in a file name, longest first so "1 John" beats "John"
  var BOOK_WORDS = (function () {
    var full = ["genesis","exodus","leviticus","numbers","deuteronomy","joshua","judges","ruth","1 samuel","2 samuel","1 kings","2 kings",
      "1 chronicles","2 chronicles","ezra","nehemiah","esther","job","psalms","proverbs","ecclesiastes","song of solomon","isaiah","jeremiah",
      "lamentations","ezekiel","daniel","hosea","joel","amos","obadiah","jonah","micah","nahum","habakkuk","zephaniah","haggai","zechariah",
      "malachi","matthew","mark","luke","john","acts","romans","1 corinthians","2 corinthians","galatians","ephesians","philippians",
      "colossians","1 thessalonians","2 thessalonians","1 timothy","2 timothy","titus","philemon","hebrews","james","1 peter","2 peter",
      "1 john","2 john","3 john","jude","revelation"];
    var short = ["gen","exo|ex|exod","lev","num","deut|deu|dt","josh|jos","judg|jdg","rut|rth","1 sam|1 sa","2 sam|2 sa","1 kgs|1 ki|1 kin","2 kgs|2 ki|2 kin",
      "1 chr|1 ch","2 chr|2 ch","ezr","neh","est|esth","jb","psalm|psa|ps|pss","prov|pro|prv","eccl|ecc|qoh","song of songs|song|sos|sng|canticles","isa","jer",
      "lam","ezek|eze|ezk","dan","hos","jol","amo","oba|obad","jon|jnh","mic","nah|nam","hab","zeph|zep","hag","zech|zec",
      "mal","matt|mat|mt","mrk|mar|mk","luk|lk","jhn|jn","act","rom","1 cor|1 co","2 cor|2 co","gal","eph","phil|php|phi","col",
      "1 thess|1 th","2 thess|2 th","1 tim|1 ti","2 tim|2 ti","tit","phlm|phm|philem","heb","jas|jam","1 pet|1 pe|1 pt","2 pet|2 pe|2 pt",
      "1 jn|1 jo|1 jhn","2 jn|2 jo|2 jhn","3 jn|3 jo|3 jhn","jud|jde","rev|re|revelations|apocalypse"];
    var ord = { "1": "(?:1|i|first)", "2": "(?:2|ii|second)", "3": "(?:3|iii|third)" }, out = [];
    full.forEach(function (w, b) { out.push({ w: w, b: b, full: 1 }); short[b].split("|").forEach(function (x) { out.push({ w: x, b: b, full: 0 }); }); });
    out.sort(function (a, c) { return c.w.length - a.w.length; });
    out.forEach(function (o) {
      var src = o.w.replace(/^([123]) /, function (m, n) { return ord[n] + " ?"; }).replace(/ /g, " ?");
      // full names may run into a number ("Genesis001"); short forms must stand alone or be followed by a number ("Gen01")
      o.re = new RegExp("(?:^|[^a-z0-9])(" + src + ")(?=$|[^a-z])");
    });
    return out;
  })();
  function parseLoose(base) {
    var s = " " + String(base).toLowerCase().replace(/[_\-.,()\[\]]+/g, " ").replace(/\s+/g, " ").trim() + " ";
    // Faith Comes By Hearing style: "B01___01_Matthew_____ENGESVN2DA" (testament+order, then the chapter, then the book)
    var f = /^ ?[ab]\d{2} (\d{1,3}) ([a-z0-9 ]+?) [a-z0-9]{8,} ?$/.exec(s);
    var tail = s, chFirst = null;
    if (f) { chFirst = parseInt(f[1], 10); tail = " " + f[2] + " "; }
    for (var i = 0; i < BOOK_WORDS.length; i++) {
      var o = BOOK_WORDS[i], m = o.re.exec(tail);
      if (!m) continue;
      var b = o.b, after = tail.slice(m.index + m[0].length), ch = chFirst;
      if (ch == null) { var n = /^\s*0*(\d{1,3})(?!\d)/.exec(after) || /(?:^|[^a-z0-9])0*(\d{1,3})(?![0-9a-z])/.exec(after); ch = n ? parseInt(n[1], 10) : 0; }
      if (NO_NUM[b] || CH_COUNT[b] === 1) ch = ch || 1;
      if (!ch || ch > CH_COUNT[b]) continue;
      return { b: b, c: ch };
    }
    return null;
  }
  function parseAudioName(file) {
    var base0 = String(file).split("/").pop().replace(/\.[A-Za-z0-9]+$/, "");
    var ex = parseExact(base0);
    if (ex && ex.c > CH_COUNT[ex.b]) ex = null;
    if (ex && !ex.byNum) return ex;                   // the name itself said which book
    return parseLoose(base0) || ex;                   // otherwise a book name found anywhere beats a bare order number
  }
  function parseExact(base) {
    var m = /^(?:(\d{1,2})[_\- ])?(.*?)(\d+)?$/.exec(base);
    if (!m) return null;
    var num = m[1] ? parseInt(m[1], 10) - 1 : -1, nm2 = normName(m[2]), ch = m[3] ? parseInt(m[3], 10) : 0, b = -1, i, byNum = false;
    if (/^[123]$/.test(m[1] || "")) return null;      // "1 John 3", "2 Kings 25": that digit is part of the book name
    for (i = 0; i < KJV_AUD.length; i++) if (normName(KJV_AUD[i]) === nm2) { b = i; break; }
    if (b < 0 && AUD_ALIAS[nm2] != null) b = AUD_ALIAS[nm2];
    if (b < 0 && num >= 0 && num < 66) { b = num; byNum = true; }
    if (b < 0) return null;
    if (NO_NUM[b]) ch = 1;
    if (!ch) return null;
    return { b: b, c: ch, byNum: byNum };
  }
  var CH_COUNT = [50,40,27,36,34,24,21,4,31,24,22,25,29,36,10,13,10,42,150,31,12,8,66,52,5,48,12,14,3,9,1,4,7,3,3,3,2,14,4,
    28,16,24,21,28,16,16,13,6,6,4,4,5,3,6,4,3,1,13,5,5,3,5,1,1,1,22];
  function stuck(p, ms, what) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej(new Error("Stopped at: " + what + ". Close this screen and try again, or pick the MP3 files instead of the zip.")); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }
  function u16(v, o) { return v.getUint16(o, true); }
  function u32(v, o) { return v.getUint32(o, true); }
  function readSlice(f, a, b2) {
    var sl = f.slice(a, b2);
    if (sl.arrayBuffer) return sl.arrayBuffer();
    return new Promise(function (res, rej) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.onerror = function () { rej(fr.error); }; fr.readAsArrayBuffer(sl); });
  }
  // list the files inside a zip without loading the whole zip into memory
  function u64(v, o) { return u32(v, o) + u32(v, o + 4) * 4294967296; }
  function zipEntries(f) {
    var tail = Math.min(f.size, 65557);
    return readSlice(f, f.size - tail, f.size).then(function (buf) {
      var v = new DataView(buf), p = -1, i;
      for (i = buf.byteLength - 22; i >= 0; i--) if (u32(v, i) === 0x06054b50) { p = i; break; }
      if (p < 0) throw new Error("This doesn't look like a zip file.");
      var n = u16(v, p + 10), size = u32(v, p + 12), off = u32(v, p + 16);
      var where = Promise.resolve({ size: size, off: off });
      if (n === 0xffff || size === 0xffffffff || off === 0xffffffff) {
        // a zip over 4 GB (or with very many files) keeps the real numbers in a "ZIP64" record just before this one
        if (p < 20 || u32(v, p - 20) !== 0x07064b50) throw new Error("This zip uses a format the app can't read.");
        var z64 = u64(v, p - 20 + 8);
        where = readSlice(f, z64, z64 + 56).then(function (zb) {
          var zv = new DataView(zb);
          if (u32(zv, 0) !== 0x06064b50) throw new Error("This zip looks damaged.");
          return { size: u64(zv, 40), off: u64(zv, 48) };
        });
      }
      return where.then(function (w) { return readSlice(f, w.off, w.off + w.size); }).then(function (cb) {
        var cv = new DataView(cb), out = [], q = 0, dec = new TextDecoder("utf-8");
        while (q + 46 <= cb.byteLength && u32(cv, q) === 0x02014b50) {
          var nl = u16(cv, q + 28), el = u16(cv, q + 30), cl = u16(cv, q + 32);
          var ent = {
            name: dec.decode(new Uint8Array(cb, q + 46, nl)), method: u16(cv, q + 10),
            csize: u32(cv, q + 20), usize: u32(cv, q + 24), off: u32(cv, q + 42)
          };
          if (ent.csize === 0xffffffff || ent.usize === 0xffffffff || ent.off === 0xffffffff) {
            // ZIP64: the big numbers sit in the entry's extra field (id 1), in this order, only for those that overflowed
            for (var x = q + 46 + nl, xe = x + el; x + 4 <= xe;) {
              var hid = u16(cv, x), hl = u16(cv, x + 2), y = x + 4;
              if (hid === 1) {
                if (ent.usize === 0xffffffff && y + 8 <= x + 4 + hl) { ent.usize = u64(cv, y); y += 8; }
                if (ent.csize === 0xffffffff && y + 8 <= x + 4 + hl) { ent.csize = u64(cv, y); y += 8; }
                if (ent.off === 0xffffffff && y + 8 <= x + 4 + hl) { ent.off = u64(cv, y); y += 8; }
                break;
              }
              x += 4 + hl;
            }
          }
          out.push(ent);
          q += 46 + nl + el + cl;
        }
        return out;
      });
    });
  }
  function zipBlob(f, e) {
    return readSlice(f, e.off, e.off + 30).then(function (hb) {
      var hv = new DataView(hb);
      if (u32(hv, 0) !== 0x04034b50) throw new Error("damaged zip");
      var start = e.off + 30 + u16(hv, 26) + u16(hv, 28), data = f.slice(start, start + e.csize);
      if (e.method === 0) return new Blob([data], { type: audioType(e.name) });
      if (e.method !== 8) throw new Error("unsupported zip compression");
      if (typeof DecompressionStream === "undefined") throw new Error("This browser can't open compressed zips. Unpack the zip in Files and pick the MP3 files instead.");
      return new Response(data.stream().pipeThrough(new DecompressionStream("deflate-raw"))).blob().then(function (bl) { return new Blob([bl], { type: audioType(e.name) }); });
    });
  }
  var AUDIO_EXT = /\.(mp3|m4a|m4b|aac|mp4|wav|ogg|opus)$/i;
  function audioType(name) {
    var x = (/\.([a-z0-9]+)$/i.exec(name || "") || [])[1] || "";
    x = x.toLowerCase();
    return x === "mp3" ? "audio/mpeg" : x === "m4a" || x === "m4b" || x === "mp4" ? "audio/mp4" : x === "aac" ? "audio/aac" :
      x === "wav" ? "audio/wav" : x === "ogg" || x === "opus" ? "audio/ogg" : x === "zip" ? "application/zip" : "audio/mpeg";
  }
  /* ---------- making audio smaller while adding it ----------
     Decodes each file, mixes it to one channel at 24 kHz (22.05 kHz for 32 kbps -- the encoder's own rate
     conversion gives silence) and re-encodes it with lamejs (LAME, LGPL) in Web Workers. Every smaller copy is
     decoded back and checked for sound and length; if anything is off, the original is kept. */
  var shr = { ctx: null, workers: [], wait: {}, seq: 0 };
  function prepShrink() {                              // call from a tap: iPhone only allows audio set up from one
    try { if (!shr.ctx) shr.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    if (!shr.workers.length && window.Worker) {
      var n = Math.max(1, Math.min(3, (navigator.hardwareConcurrency || 2) - 1));
      for (var i = 0; i < n; i++) {
        try {
          var w = new Worker("audio-worker.js");
          w.onmessage = function (e) { var cb = shr.wait[e.data.id]; delete shr.wait[e.data.id]; if (cb) cb(e.data); };
          shr.workers.push({ w: w, busy: 0 });
        } catch (e) {}
      }
    }
    return !!(shr.ctx && shr.workers.length && window.OfflineAudioContext);
  }
  function shrinkRate(kbps) { return kbps <= 32 ? 22050 : 24000; }
  function decodeAudio(buf) {
    return new Promise(function (res, rej) {
      var pr = shr.ctx.decodeAudioData(buf, res, function (e) { rej(e || new Error("couldn't read the audio")); });
      if (pr && pr.catch) pr.catch(function () {});     // newer browsers also return a promise; its failure is already handled above
    });
  }
  function peakOf(f) { var m = 0; for (var i = 0; i < f.length; i += 7) { var v = f[i] < 0 ? -f[i] : f[i]; if (v > m) m = v; } return m; }
  function encodeMp3(pcm, sr, kbps) {
    return new Promise(function (res, rej) {
      var id = ++shr.seq, best = shr.workers.reduce(function (a, b) { return b.busy < a.busy ? b : a; });
      best.busy++;
      shr.wait[id] = function (r) { best.busy--; if (r.error) rej(new Error(r.error)); else res(r.mp3); };
      best.w.postMessage({ id: id, pcm: pcm, sr: sr, kbps: kbps }, [pcm.buffer]);
    });
  }
  // resolves { blob, dur } with the smaller copy, or null to keep the original (with why in .reason)
  function shrinkAudio(bl, kbps, counted) {
    var SR = shrinkRate(kbps);
    return bl.arrayBuffer().then(function (buf) {
      return decodeAudio(buf.slice(0)).then(function (ab) {
        if (counted > 5 && ab.duration < counted * 0.9) throw new Error("only part of it could be read");
        var len = Math.max(1, Math.ceil(ab.duration * SR)), off = new OfflineAudioContext(1, len, SR), src = off.createBufferSource();
        src.buffer = ab; src.connect(off.destination); src.start();
        return off.startRendering().then(function (out) {
          var f = out.getChannelData(0), inPeak = peakOf(f), pcm = new Int16Array(f.length);
          if (inPeak < 1e-4 && peakOf(ab.getChannelData(0)) > 1e-3) throw new Error("the sound was lost while converting");
          for (var i = 0; i < f.length; i++) { var v = f[i]; pcm[i] = v < -1 ? -32768 : v > 1 ? 32767 : v * 32767; }
          var secs = ab.duration;
          return encodeMp3(pcm, SR, kbps).then(function (mp3) {
            if (mp3.length >= bl.size * 0.9) return null;                       // not worth it: already small
            return decodeAudio(mp3.buffer.slice(0)).then(function (back) {
              if (Math.abs(back.duration - secs) > Math.max(2, secs * 0.03)) throw new Error("the smaller copy came out the wrong length");
              if (inPeak > 0.01 && peakOf(back.getChannelData(0)) < inPeak * 0.1) throw new Error("the smaller copy came out silent");
              return { blob: new Blob([mp3], { type: "audio/mpeg" }), dur: secs };
            });
          });
        });
      });
    });
  }

  /* ---------- reading what was picked: which chapters, how big, already saved? ---------- */
  function collectAudio(t, files, onProg, res) {
    var jobs = [], byUrl = {};
    function addJob(label, bc, size, get) {
      if (!bc || bc.b < 0 || bc.b >= CH_COUNT.length || bc.c < 1 || bc.c > CH_COUNT[bc.b]) { res.skipped++; if (res.unmatched.length < 8) res.unmatched.push(label); return; }
      var url = audioUrlFor(t, bc.b, bc.c), j = { label: label, bc: bc, size: size || 0, get: get, url: url };
      if (byUrl[url] != null) jobs[byUrl[url]] = j; else { byUrl[url] = jobs.length; jobs.push(j); }   // the same chapter twice: the last one wins
    }
    return files.reduce(function (p, f) {
      return p.then(function () {
        if (/\.zip$/i.test(f.name) || f.type === "application/zip" || f.type === "application/x-zip-compressed") {
          // a zip may hold the audio files directly, in folders, or as more zips (one per book, say)
          var openZip = function (z, name, depth) {
            if (onProg) onProg(0, 0, "Opening " + name);
            return stuck(zipEntries(z), 30000, "reading the zip's file list").then(function (es) {
              return es.reduce(function (pp, e) {
                return pp.then(function () {
                  if (/(^|\/)__MACOSX\//.test(e.name) || /\/$/.test(e.name) || /(^|\/)\./.test(e.name)) return;   // folders and Mac/hidden extras
                  res.inZip++;
                  var nm = e.name.split("/").pop();
                  if (AUDIO_EXT.test(nm)) { addJob(nm, parseAudioName(e.name), e.usize, function () { return zipBlob(z, e); }); return; }
                  if (/\.zip$/i.test(nm) && depth < 2) return zipBlob(z, e).then(function (inner) { return openZip(inner, nm, depth + 1); });
                  if (res.other.length < 6) res.other.push(nm);
                });
              }, Promise.resolve());
            });
          };
          return openZip(f, f.name, 0);
        }
        if (AUDIO_EXT.test(f.name) || /^audio\//.test(f.type)) { addJob(f.name, parseAudioName(f.name), f.size, function () { return Promise.resolve(f.type ? f : new Blob([f], { type: audioType(f.name) })); }); return; }
        res.skipped++; if (res.unmatched.length < 8) res.unmatched.push(f.name);
      });
    }, Promise.resolve()).then(function () { return jobs; });
  }
  function kbpsOf(bl) {                                // the bit rate of an MP3, from its first audio frame
    return bl.slice(0, 65536).arrayBuffer().then(function (buf) {
      var u = new Uint8Array(buf), i = id3Len(u, 0);
      for (; i < u.length - 4; i++) { var h = mp3Head(u, i); if (h && mp3Head(u, i + h.len)) return Math.round(h.len * 8 * h.sr / h.spf / 1000); }
      return 0;
    }).catch(function () { return 0; });
  }
  var lastPlan = null;
  // look at what was picked before adding anything: { count, bytes, saved (already on this device), kbps, hours, smallBytes, canShrink }
  function planAudio(id, files, onProg) {
    var t = TR[id], res = { saved: 0, skipped: 0, unmatched: [], failed: 0, error: "", inZip: 0, other: [] };
    if (!t) { var cl = readCustoms().filter(function (x) { return x.id === id; })[0]; if (cl) { addCustomTr(cl); t = TR[id]; } }
    files = Array.prototype.slice.call(files || []);
    if (!t || !files.length) return Promise.resolve(null);
    return Promise.all([collectAudio(t, files, onProg, res), loadAudioHave().catch(function () {})]).then(function (r) {
      var jobs = r[0], bytes = 0, saved = 0;
      jobs.forEach(function (j) { bytes += j.size; if (audioHave[j.url]) saved++; });
      var mp3s = jobs.filter(function (j) { return /\.mp3$/i.test(j.label); }), picks = [];
      for (var q = 0; q < Math.min(5, mp3s.length); q++) picks.push(mp3s[Math.floor(q * (mp3s.length - 1) / Math.max(1, Math.min(5, mp3s.length) - 1))]);
      return Promise.all(picks.map(function (j) { return stuck(j.get(), 30000, "reading a file").then(kbpsOf, function () { return 0; }).then(function (k) { return { k: k, w: j.size || 1 }; }); })).then(function (ks) {
        // bytes-weighted average: the sizes add up to total bytes, so this gives the total length best
        var bw = 0, sec = 0; ks.forEach(function (x) { if (x.k) { bw += x.w; sec += x.w * 8 / (x.k * 1000); } });
        return bw ? Math.round(bw * 8 / sec / 1000) : 0;
      }).then(function (kbps) {
        var secs = kbps ? bytes * 8 / (kbps * 1000) : 0;
        lastPlan = { id: id, files: files, jobs: jobs, res: res };
        return {
          count: jobs.length, bytes: bytes, saved: saved, kbps: kbps, hours: secs / 3600, secs: secs,
          smallBytes: secs * 48000 / 8, size48: secs * 48000 / 8, size32: secs * 32000 / 8,
          canShrink: !!(window.Worker && window.OfflineAudioContext && (window.AudioContext || window.webkitAudioContext)),
          worth: kbps > 40, skipped: res.skipped, unmatched: res.unmatched, other: res.other, inZip: res.inZip
        };
      });
    });
  }

  // how fast this phone makes audio smaller: shrink a few of the picked files the same way an import would (several at
  // once), without saving anything. Resolves { speed: seconds of audio done per second, files } or null.
  function benchShrink(id, kbps) {
    var plan = lastPlan && lastPlan.id === id ? lastPlan : null;
    if (!plan || !prepShrink()) return Promise.resolve(null);
    var conc = Math.min(3, shr.workers.length + 1);
    // middle-sized chapters, so one very short or very long file doesn't skew it
    var pool = plan.jobs.filter(function (j) { return /\.mp3$/i.test(j.label) && j.size > 0; }).sort(function (a, b) { return a.size - b.size; });
    if (!pool.length) return Promise.resolve(null);
    var mid = Math.floor(pool.length / 2), pick = pool.slice(Math.max(0, mid - conc), Math.max(0, mid - conc) + conc * 2);
    var done = 0, t0 = performance.now(), i = 0;
    function lane() {
      if (i >= pick.length) return Promise.resolve();
      var j = pick[i++];
      return stuck(j.get(), 30000, "reading a file").then(function (bl) {
        return checkAudio(bl).then(function (k) { return shrinkAudio(k.blob, kbps, k.dur).then(function (sm) { done += (sm && sm.dur) || k.dur || 0; }); });
      }).catch(function () {}).then(lane);
    }
    var lanes = []; for (var n = 0; n < conc; n++) lanes.push(lane());
    return Promise.all(lanes).then(function () {
      var wall = (performance.now() - t0) / 1000;
      return done > 0 && wall > 0 ? { speed: done / wall, files: pick.length } : null;
    });
  }

  // opts: { skipSaved: leave chapters already on this device alone, shrink: kbps to make files smaller (0 = keep as they are) }
  function importAudio(id, files, onProg, opts) {
    opts = opts || {};
    var t = TR[id], res = { saved: 0, skipped: 0, unmatched: [], failed: 0, error: "", inZip: 0, other: [], already: 0, smaller: 0, kept: 0, before: 0, after: 0 };
    if (!t) {                                          // an added version the reader hasn't picked up yet: take it from the list
      var cl = readCustoms().filter(function (x) { return x.id === id; })[0];
      if (cl) { addCustomTr(cl); t = TR[id]; }
    }
    if (!t) { res.error = "noversion"; return Promise.resolve(res); }
    if ((!t.audio && !t.custom) || t.audio === "rst") { res.error = "noimport"; return Promise.resolve(res); }
    if (t.custom ? !window.indexedDB : !window.caches) { res.error = "nocache"; return Promise.resolve(res); }
    files = Array.prototype.slice.call(files || []);
    if (!files.length) { res.error = "nofiles"; return Promise.resolve(res); }
    var shrink = opts.shrink && prepShrink() ? opts.shrink : 0;
    var plan = lastPlan && lastPlan.id === id && lastPlan.files.length === files.length && lastPlan.files.every(function (f, i) { return f === files[i]; }) ? lastPlan : null;
    if (plan) { res.skipped = plan.res.skipped; res.unmatched = plan.res.unmatched; res.inZip = plan.res.inZip; res.other = plan.res.other; }
    return (plan ? Promise.resolve(plan.jobs) : collectAudio(t, files, onProg, res)).then(function (jobs) {
      return (opts.skipSaved ? loadAudioHave().catch(function () {}) : Promise.resolve()).then(function () {
        if (opts.skipSaved) jobs = jobs.filter(function (j) { if (audioHave[j.url]) { res.already++; return false; } return true; });
        var n = 0, next = 0, conc = shrink ? Math.min(3, shr.workers.length + 1) : 1;
        function one(j) {
          if (onProg) onProg(n, jobs.length, label(j.bc.b, j.bc.c));
          return stuck(j.get(), 60000, "unpacking " + j.label).then(function (bl) {
            if (!bl || bl.size < 2000) throw new Error("empty");
            if (!bl.type) bl = new Blob([bl], { type: audioType(j.label) });
            res.before += bl.size;
            return checkAudio(bl).then(function (k) {
              if (k.changed) res.fixed = (res.fixed || 0) + 1;
              if (!shrink) return k;
              return shrinkAudio(k.blob, shrink, k.dur).then(function (sm) {
                if (sm) { res.smaller++; return { blob: sm.blob, dur: sm.dur || k.dur }; }
                return k;
              }, function (e) {
                res.kept++; if ((res.keptNames = res.keptNames || []).length < 8) res.keptNames.push(j.label + " (" + ((e && e.message) || "couldn't be made smaller") + ")");
                return k;
              });
            }).then(function (k) {
              res.after += k.blob.size;
              if (t.custom) return tmo(adb("readwrite", function (st) { return st.put({ b: k.blob, d: k.dur || 0 }, j.url); }), 60000, "audio database");
              return cacheStrict(AUDIO_CACHE, j.url, audioResp(k.blob, k.dur));
            }).then(function () { audioHave[j.url] = true; res.saved++; });
          }).catch(function (e) {
            var m = String(e && e.name || "") + String(e && e.message || "");
            if (/Quota/i.test(m)) { res.error = "full"; throw e; }
            res.failed++;
            if ((res.failedNames = res.failedNames || []).length < 12) res.failedNames.push(j.label + (m === "Errorempty" || m === "empty" ? " (empty file)" : /stuck|took too long|unpacking|didn't answer/i.test(m) ? " (took too long)" : ""));
          }).then(function () { n++; if (n % 20 === 0) dlEmit(); });
        }
        function lane() {                               // each lane takes the next file until none are left
          if (next >= jobs.length || res.error === "full") return Promise.resolve();
          var j = jobs[next++];
          return one(j).then(lane);
        }
        var lanes = []; for (var i = 0; i < conc; i++) lanes.push(lane());
        return Promise.all(lanes).then(function () { if (onProg) onProg(jobs.length, jobs.length, ""); });
      });
    }).catch(function (e) { if (!res.error) res.error = (e && e.message) || "error"; }).then(function () {
      lastPlan = null;
      if (res.saved && t.custom && !t.audio) setCustomAudio(id, true);   // the version now has a recording, so the player can show
      dlEmit(); return res;
    });
  }

  /* ---------- finding and checking an added version's audio ---------- */
  // saved files of added versions, by version id: { n: in the database, old: still in the older store, elsewhere: saved under another address }
  var FOLDER = /\/bbcustom\/([^\/]+)\/([^\/?#]+)$/;
  function customAudioFolders() {
    var f = {}, oldState = "ok";
    function slot(id) { return f[id] || (f[id] = { n: 0, old: 0, elsewhere: 0 }); }
    var fromDb = window.indexedDB ? tmo(adbKeys(), 10000, "audio database").then(function (ks) {
      ks.forEach(function (k) {
        var m = FOLDER.exec(k); if (!m) return;
        var x = slot(m[1]); x.n++;
        if (TR[m[1]] && TR[m[1]].custom && k.indexOf(audioBase(TR[m[1]])) !== 0) x.elsewhere++;
      });
    }).catch(function () { f._dbError = true; }) : Promise.resolve();
    var fromOld = window.caches ? tmo(caches.open(AUDIO_CACHE).then(function (c) { return c.keys(); }), 6000, "saved audio").then(function (ks) {
      ks.forEach(function (k) { var m = FOLDER.exec(k.url); if (m) slot(m[1]).old++; });
    }, function () { oldState = "not answering"; }) : Promise.resolve();
    return Promise.all([fromDb, fromOld]).then(function () { f._old = oldState; return f; });
  }
  // move saved audio of folder fromId (in the database under another address, or still in the older store) to added version toId
  function adoptAudio(fromId, toId) {
    var t = TR[toId];
    if (!t || !t.custom || !window.indexedDB) return Promise.resolve(0);
    var base = audioBase(t), moved = 0;
    var inDb = tmo(adbKeys(), 10000, "audio database").then(function (ks) {
      var mine = ks.filter(function (k) { var m = FOLDER.exec(k); return m && m[1] === fromId && k.indexOf(base) !== 0; });
      return mine.reduce(function (p, k) {
        return p.then(function () {
          return adb("readonly", function (st) { return st.get(k); }).then(function (v) {
            if (!v) return;
            var to = base + k.split("/").pop();
            return adb("readwrite", function (st) { st.put(v, to); return st.delete(k); }).then(function () { delete audioHave[k]; audioHave[to] = true; moved++; });
          });
        });
      }, Promise.resolve());
    }).catch(function () {});
    return inDb.then(function () {
      if (!window.caches || cacheStuck) return;
      return tmo(caches.open(AUDIO_CACHE).then(function (c) { return c.keys(); }), 6000, "saved audio").then(function (ks) {
        var old = ks.filter(function (k) { var m = FOLDER.exec(k.url); return m && m[1] === fromId; });
        return old.reduce(function (p, k) {
          return p.then(function () {
            var to = base + k.url.split("/").pop();
            return tmo(caches.open(AUDIO_CACHE).then(function (c) { return c.match(k); }), 8000, "saved audio").then(function (r) {
              if (!r) return;
              var known = parseFloat(r.headers.get("X-BB-Len") || ""), chk = r.headers.get("X-BB-Chk") === "2";
              return r.blob().then(function (bl) { return chk && known > 0 ? { blob: bl, dur: known } : checkAudio(bl); }).then(function (k2) {
                return adb("readwrite", function (st) { return st.put({ b: k2.blob, d: k2.dur || 0 }, to); });
              }).then(function () {
                return caches.open(AUDIO_CACHE).then(function (c) { return c.delete(k); }).catch(function () {});
              }).then(function () { delete audioHave[k.url]; audioHave[to] = true; moved++; if (moved % 25 === 0) dlEmit(); });
            });
          });
        }, Promise.resolve());
      });
    }).catch(function () {}).then(function () {
      if (moved && !t.audio) setCustomAudio(toId, true);
      dlEmit(); return moved;
    });
  }
  // at start, in the background: move added versions' audio out of the older store into the database
  function healAudio() {
    return customAudioFolders().then(function (f) {
      return Object.keys(f).filter(function (id) { return id.charAt(0) !== "_" && TR[id] && TR[id].custom && (f[id].old || f[id].elsewhere); })
        .reduce(function (p, id) { return p.then(function () { return adoptAudio(id, id); }); }, Promise.resolve());
    }).catch(function () {});
  }
  // everything this device holds for added versions, in words, for "Storage check"
  function storageReport(id) {
    var t = TR[id], rep = { version: id, page: location.href, audioPlace: t && t.custom ? audioBase(t) : "", list: readCustoms() };
    return Promise.all([
      window.indexedDB ? tmo(idbDo("readonly", function (st) { return st.getAllKeys ? st.getAllKeys() : null; }), 8000, "text storage").catch(function (e) { return "error: " + (e && e.message); }) : Promise.resolve("no IndexedDB"),
      window.indexedDB ? tmo(idbDo("readonly", function (st) { return st.get(id); }), 8000, "text storage").then(function (b) { return b ? b.byteLength : 0; }).catch(function (e) { return "error: " + (e && e.message); }) : Promise.resolve(0),
      customAudioFolders(),
      window.caches ? tmo(caches.keys(), 5000, "storage").catch(function () { return ["not answering"]; }) : Promise.resolve([]),
      navigator.storage && navigator.storage.estimate ? tmo(navigator.storage.estimate(), 5000).catch(function () { return null; }) : Promise.resolve(null),
      navigator.storage && navigator.storage.persisted ? tmo(navigator.storage.persisted(), 5000).catch(function () { return null; }) : Promise.resolve(null)
    ]).then(function (r) {
      rep.textsStored = r[0]; rep.thisTextBytes = r[1]; rep.audioFolders = r[2]; rep.caches = r[3];
      rep.oldAudioStore = r[2]._old; rep.kept = r[5];
      if (r[4]) { rep.usedMB = Math.round((r[4].usage || 0) / 1048576); rep.allowedMB = Math.round((r[4].quota || 0) / 1048576); }
      return rep;
    });
  }

  /* ---------- adding and removing your own versions ---------- */
  function addVersion(file, meta) {
    meta = meta || {};
    if (!window.indexedDB) return Promise.reject(new Error("This browser can't keep a Bible file on the device."));
    return readSlice(file, 0, file.size).then(function (buf) {
      var L = parseInt(new TextDecoder("ascii").decode(buf.slice(0, 10)), 10), j = null, i, k, tot = 0;
      try { j = JSON.parse(new TextDecoder("utf-8").decode(buf.slice(10, 10 + L))); } catch (e) {}
      if (!(L > 0) || !j || !Array.isArray(j.b) || j.b.length !== 66) throw new Error("This isn't a Bible Bridge text file (.bbt) for a whole Bible.");
      for (i = 0; i < 66; i++) {
        if (!Array.isArray(j.b[i]) || j.b[i].length !== CH_COUNT[i]) throw new Error("The books and chapters in this file don't match a standard Bible.");
        for (k = 0; k < j.b[i].length; k++) tot += j.b[i][k];
      }
      if (tot !== buf.byteLength - 10 - L) throw new Error("This file looks cut off or damaged. Try copying it to your phone again.");
      var base = String(meta.id || j.id || "mine").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) || "mine";
      if (!meta.id && meta.short) {                     // adding again under a short name you already have replaces that one
        var same = readCustoms().filter(function (x) { return x.short === String(meta.short).toUpperCase().replace(/\s+/g, "").slice(0, 8); })[0];
        if (same) base = same.id;
      }
      var id = TR[base] && !TR[base].custom ? "my" + base : base;
      var short = String(meta.short || j.id || id).toUpperCase().replace(/\s+/g, "").slice(0, 8) || id.toUpperCase();
      var c = { id: id, short: short, name: String(meta.name || "").trim() || short, lang: /^(en|ru|es)$/.test(meta.lang) ? meta.lang : "en",
        audio: TR[id] && TR[id].custom && TR[id].audio ? 1 : 0 };
      return idbDo("readwrite", function (st) { return st.put(buf, id); }).then(function () {
        return idbDo("readonly", function (st) { return st.get(id); });
      }).then(function (back) {
        if (!back || back.byteLength !== buf.byteLength) throw new Error("This phone didn't keep the file. It may be short on storage. Free up some space, then try again.");
        delete customMissing[id];
        delete idxP[id]; delete whole[id]; delete Ds[id];
        var a = readCustoms().filter(function (x) { return x.id !== id; });
        a.push(c); writeCustoms(a); addCustomTr(c);
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}   // ask the device not to clear it
        return { id: id, short: c.short, name: c.name, lang: c.lang };
      });
    });
  }
  function removeVersion(id) {
    var t = TR[id];
    if (!t || !t.custom) return Promise.resolve();
    if (isOpen && tr === t) close(false);
    var done = function () {
      delete TR[id]; var i = ORDER.indexOf(id); if (i >= 0) ORDER.splice(i, 1);
      delete idxP[id]; delete whole[id]; delete Ds[id];
      writeCustoms(readCustoms().filter(function (x) { return x.id !== id; }));
      dlEmit();
    };
    return removeCustomAudio(t).then(function () { return idbDo("readwrite", function (st) { return st.delete(id); }); }).then(done, done);
  }

  /* ---------- state ---------- */
  var tr = null;               // the translation on screen
  var D = null;                // its text: D[book][chapter-1] (verse array once loaded); D[book].length = number of chapters
  var view = "closed";         // closed | loading | reader
  var isOpen = false, pushed = false, mainScroll = 0, origTitle = "";
  var rendered = [];
  var viewing = null;
  var playing = null;
  var endShown = false;
  var seeking = false;
  var lenCache = {}, probing = {}, probeTimer = 0, seekCh = null;   // lengths read ahead of playing, per chapter
  var pendingFrac = null;      // you moved the bar before the audio had loaded: where (as a fraction) to start once it has
  var preloadedFor = "";
  var readOff = 0;             // how far into the chapter on screen you have scrolled
  var audioT = 0;              // last known audio time of the loaded chapter
  var audioD = 0;              // its length
  var pendingSeek = null;      // time to jump to once the audio file is ready
  var rewound = false;         // true until playback moves on after a restore (so we don't rewind twice)
  var resumeOff = null;        // {b,c,off} used once, when reopening the reader at the saved spot
  var lastSave = 0;
  var preClipPlaying = false, preClipCb = null, preClipGen = 0;   // a short "book name" clip ahead of the first real chapter of a day
  var pendingChapterStart = null;   // {b,c} once the clip has ended but the chapter text hasn't rendered yet
  var openSeq = 0;

  var A = new Audio();
  A.preload = "auto";
  A.setAttribute("playsinline", "");
  var P = new Audio();
  P.preload = "auto";
  var RATES = [1, 1.25, 1.5, 0.8];
  var rate = parseFloat(load("bb-rd-rate")) || 1;
  if (RATES.indexOf(rate) < 0) rate = 1;
  // text size: every tap of A (smaller) or A (larger) changes it by 15%, with no minimum and no maximum
  var ZBASE = 19, ZSTEP = 1.15;
  var zoom = parseInt(load("bb-rd-zoom"), 10);
  if (!isFinite(zoom)) zoom = 0;

  function T() { return S[(tr && tr.lang) || "en"] || S.en; }
  function nm(b) { return (NAMES[(tr && tr.lang) || "en"] || NAMES.en)[b]; }
  function label(b, c) { return nm(b) + " " + c; }
  function audioUrl(b, c) { return audioUrlFor(tr, b, c); }
  function audioUrlFor(t, b, c) {
    if (!t || (!t.audio && !t.custom)) return "";
    if (t.custom) return audioBase(t) + pad(b + 1, 2) + "_" + KJV_AUD[b] + (NO_NUM[b] ? "" : pad(c, 3)) + ".mp3";   // only a name for the copy kept on this device
    if (t.audio === "rst") {
      var n = pad(b + 1, 2) + "_" + (b === 21 ? "SongofSongs" : NAMES.en[b].replace(/ /g, ""));   // the Russian host calls it Song of Songs
      return DBS_BASE + (b < 39 ? "OT" : "NT") + "_RUSS76/" + n + "/" + n + "_" + pad(c, 3) + ".mp3";
    }
    return KJV_BASE + pad(b + 1, 2) + "_" + KJV_AUD[b] + (NO_NUM[b] ? "" : pad(c, 3)) + ".mp3";
  }
  // the short "[Book name]" announcement that leads a day starting mid-book -- KJV only: the Russian Synodal
  // recording already names the book at the start of every chapter, so the clip would just be a duplicate there.
  // (audio/booknames/rst/ clips stay on disk and this still returns a URL for them if re-enabled later.)
  function bookNameClipUrl(t, b, c) {
    if (!t || t.audio !== "kjv" || c <= 1) return "";
    return "audio/booknames/" + t.audio + "/" + pad(b + 1, 2) + "_" + NAMES.en[b].replace(/ /g, "") + ".mp3";
  }
  var seqList = null;   // a day's reading in plan order, e.g. Genesis 2, Job 1, Isaiah 1; null = normal Bible order
  function seqIx(p) { if (seqList) for (var i = 0; i < seqList.length; i++) if (same(seqList[i], p)) return i; return -1; }
  function nextOf(p) {
    if (!p || !D) return null;
    if (seqList) { var si = seqIx(p); return si >= 0 && si < seqList.length - 1 ? { b: seqList[si + 1].b, c: seqList[si + 1].c } : null; }
    if (p.c < D[p.b].length) return { b: p.b, c: p.c + 1 };
    for (var nb = p.b + 1; nb < D.length; nb++) if (D[nb].length) return { b: nb, c: 1 };
    return null;
  }
  function prevOf(p) {
    if (!p || !D) return null;
    if (seqList) { var si = seqIx(p); return si > 0 ? { b: seqList[si - 1].b, c: seqList[si - 1].c } : null; }
    if (p.c > 1) return { b: p.b, c: p.c - 1 };
    for (var pb = p.b - 1; pb >= 0; pb--) if (D[pb].length) return { b: pb, c: D[pb].length };
    return null;
  }

  /* ---------- saved position ---------- */
  var STATE_KEY = "bb-reader";
  function loadState() {
    var raw = load(STATE_KEY);
    if (raw) { try { var s = JSON.parse(raw); if (s && typeof s === "object" && TR[s.tr]) return s; } catch (e) {} }
    return null;
  }
  function persist() {
    if (!tr) return;
    var s = { tr: tr.id };
    if (viewing) s.read = { b: viewing.b, c: viewing.c, off: Math.round(readOff) };
    if (playing) s.audio = { b: playing.b, c: playing.c, t: audioT, d: realDur() || audioD, rw: rewound };
    store(STATE_KEY, JSON.stringify(s));
    lastSave = Date.now();
  }
  function persistSoon() { if (Date.now() - lastSave > 4000) persist(); }
  function savedSpot() {
    var s = loadState();
    if (!s || !s.read || !(s.read.b >= 0 && s.read.b < 66) || !(s.read.c >= 1)) return null;
    return { tr: s.tr, b: s.read.b, c: s.read.c };
  }

  /* ---------- the reader's page (built once) ---------- */
  var MARKUP =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="rd-s-play" viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></symbol>' +
    '<symbol id="rd-s-pause" viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></symbol>' +
    '<symbol id="rd-s-prev" viewBox="0 0 24 24"><path d="M6 5h2v14H6zM19 5.7v12.6a.8.8 0 0 1-1.25.66L9.6 13.2a.8.8 0 0 1 0-1.32l8.15-5.5A.8.8 0 0 1 19 5.7z"/></symbol>' +
    '<symbol id="rd-s-next" viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM5 5.7v12.6a.8.8 0 0 0 1.25.66l8.15-5.76a.8.8 0 0 0 0-1.32L6.25 5.04A.8.8 0 0 0 5 5.7z"/></symbol>' +
    '<symbol id="rd-s-back" viewBox="0 0 24 24"><path d="M15.3 4.3a1 1 0 0 1 0 1.4L9 12l6.3 6.3a1 1 0 1 1-1.4 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.4 0z"/></symbol>' +
    '</svg>' +
    '<header id="rd-bar">' +
    '<button id="rd-back" type="button" aria-label="Back"><svg><use href="#rd-s-back"/></svg></button>' +
    '<h1 id="rd-title"></h1>' +
    '<div id="rd-sizer">' +
    '<button id="rd-sm" type="button" aria-label="Smaller text">A</button>' +
    '<button id="rd-zr" type="button" hidden aria-label="Reset text size to standard">Reset</button>' +
    '<button id="rd-lg" type="button" aria-label="Larger text">A</button>' +
    '</div>' +
    '<button id="rd-langb" type="button" aria-haspopup="true" aria-label="Bible translation"><span></span></button>' +
    '</header>' +
    '<main><div id="rd-body" class="rd-view"></div></main>' +
    '<div id="rd-trmenu" hidden></div>' +
    '<div id="rd-toast" role="status" hidden></div>' +
    '<div id="rd-sband" aria-hidden="true"></div>' +
    '<button id="rd-chip" type="button" hidden></button>' +
    '<div id="rd-player" hidden>' +
    '<div class="rd-in">' +
    '<div class="rd-r1">' +
    '<button id="rd-ptitle" type="button" aria-label="Go to the chapter that is playing"><b id="rd-ptxt"></b><span id="rd-pmsg" role="status" aria-live="polite"></span></button>' +
    '<div class="rd-ctl">' +
    '<button id="rd-prev" type="button" aria-label="Previous chapter"><svg><use href="#rd-s-prev"/></svg></button>' +
    '<button id="rd-pp" type="button" data-state="paused" aria-label="Play"><svg class="rd-i-play"><use href="#rd-s-play"/></svg><svg class="rd-i-pause"><use href="#rd-s-pause"/></svg></button>' +
    '<button id="rd-next" type="button" aria-label="Next chapter"><svg><use href="#rd-s-next"/></svg></button>' +
    '</div></div>' +
    '<div class="rd-r2">' +
    '<span class="rd-t" id="rd-tcur">0:00</span>' +
    '<input id="rd-seek" type="range" min="0" max="1000" step="1" value="0" aria-label="Seek">' +
    '<span class="rd-t" id="rd-tdur">0:00</span>' +
    '<button id="rd-fol" type="button" aria-pressed="true" aria-label="Scroll along with the audio">Auto</button>' +
    '<button id="rd-spd" type="button" aria-label="Playback speed">1×</button>' +
    '</div></div></div>';

  function setTitle(t) {
    $("#rd-title").textContent = t;
    document.title = t + (tr ? " · " + tr.short : "");
  }
  function applyStrings() {
    var s = T();
    $("#rd-back").setAttribute("aria-label", s.back);
    $("#rd-sm").setAttribute("aria-label", s.smaller);
    $("#rd-lg").setAttribute("aria-label", s.larger);
    $("#rd-prev").setAttribute("aria-label", s.prev);
    $("#rd-next").setAttribute("aria-label", s.next);
    $("#rd-spd").setAttribute("aria-label", s.speed);
    $("#rd-zr").textContent = s.reset; $("#rd-zr").setAttribute("aria-label", s.resetLabel);
    $("#rd-fol").textContent = s.auto; $("#rd-fol").setAttribute("aria-label", s.autoLabel);
    $("#rd-seek").setAttribute("aria-label", s.seek);
    $("#rd-ptitle").setAttribute("aria-label", s.jump);
    $("#rd-langb").setAttribute("aria-label", s.trLabel + ": " + tr.name);
    $("#rd-langb").firstChild.textContent = tr.short;
    updatePP();
  }

  /* ---------- reading ---------- */
  function buildChapter(b, c) {
    var sec = el("section", "rd-chap");
    sec.dataset.b = b; sec.dataset.c = c;
    var head = el("div", "rd-chead");
    head.appendChild(el("h2", null, label(b, c)));
    var pb = el("button", "rd-cplay");
    pb.type = "button";
    pb.setAttribute("aria-label", T().play + " " + label(b, c));
    pb.innerHTML = '<svg class="rd-i-play"><use href="#rd-s-play"/></svg><svg class="rd-i-pause"><use href="#rd-s-pause"/></svg>';
    pb.onclick = function () { chapterPlayPressed(b, c); };
    head.appendChild(pb);
    sec.appendChild(head);
    var p = el("p", "rd-text");
    var verses = D[b][c - 1] || [];
    for (var i = 0; i < verses.length; i++) {
      if (!verses[i]) continue;
      var v = el("span", "rd-v");
      v.appendChild(el("sup", "rd-vn", String(i + 1)));
      v.appendChild(document.createTextNode(verses[i] + " "));
      p.appendChild(v);
    }
    sec.appendChild(p);
    return sec;
  }

  var appendP = null;
  function appendNext() {
    if (appendP) return appendP;
    var box = $("#rd-body");
    var last = rendered[rendered.length - 1];
    if (!D) return Promise.resolve(false);
    var n = nextOf(last);
    if (!n) {
      if (!endShown) { box.appendChild(el("p", "rd-endmark", T().end)); endShown = true; }
      return Promise.resolve(false);
    }
    var t = tr;
    appendP = need(n.b, n.c, t).then(function () {
      if (rendered[rendered.length - 1] !== last || view !== "reader" || tr !== t) return false;   // the reader was reopened meanwhile
      var sec = buildChapter(n.b, n.c);
      box.appendChild(sec);
      rendered.push({ b: n.b, c: n.c, el: sec });
      markPlaying();
      prefetchAfter(n);
      return true;
    }, function () { return false; }).then(function (ok) { appendP = null; return ok; });
    return appendP;
  }
  // read the next couple of chapters' text in the background so they are ready when you get there
  function prefetchAfter(p) {
    var t = tr, n = nextOf(p), k = 0;
    while (n && k++ < 2) { need(n.b, n.c, t).catch(function () {}); n = nextOf(n); }
  }
  function ensureRendered(n) {
    var guard = 0;
    return (function step() {
      if (findRendered(n) || guard++ >= 4) return Promise.resolve();
      return appendNext().then(function (ok) { return ok ? step() : null; });
    })();
  }

  function showLoadFailed(retry) {
    var box = $("#rd-body");
    box.textContent = "";
    var d = el("div", "rd-boot", T().noText);
    var bt = el("button", null, T().retry);
    bt.type = "button";
    bt.onclick = retry;
    d.appendChild(el("br"));
    d.appendChild(bt);
    box.appendChild(d);
  }

  function openReader(b, c) {
    var seq = ++openSeq, t = tr;
    var box = $("#rd-body");
    box.textContent = "";
    box.appendChild(el("div", "rd-boot", T().loading));
    rendered = []; endShown = false; viewing = null; appendP = null;
    view = "loading";
    refreshPlayerVisibility();
    setTitle(label(b, c));
    return need(b, c, t).then(function () {
      if (seq !== openSeq || tr !== t) return;
      view = "reader";
      box.textContent = "";
      var sec = buildChapter(b, c);
      box.appendChild(sec);
      rendered.push({ b: b, c: c, el: sec });
      viewing = { b: b, c: c };
      readOff = 0;
      sysUntil = performance.now() + 400; held = false;
      refreshPlayerVisibility();
      setTitle(label(b, c));
      exitGlide();
      window.scrollTo(0, 0);
      // reopening at the saved spot: go back to the same place inside the chapter
      if (resumeOff && resumeOff.b === b && resumeOff.c === c && resumeOff.off > 0) {
        var barB = $("#rd-bar").getBoundingClientRect().bottom;
        var top = sec.getBoundingClientRect().top;
        window.scrollTo(0, Math.max(0, top - barB + resumeOff.off));
        readOff = resumeOff.off;
      }
      resumeOff = null;
      if (pendingChapterStart && same(pendingChapterStart, { b: b, c: c })) {
        pendingChapterStart = null;
        playChapter(b, c);   // the book-name clip finished before the text did -- start now, fresh, at the top
      } else {
        markPlaying();
        updatePlayerIdle();
        persist();
      }
      kick();
      prefetchAfter({ b: b, c: c });
      // load the next chapter in the background so it is already there when you reach the bottom
      setTimeout(function () { if (view === "reader") onScroll(); }, 30);
    }, function () {
      if (seq !== openSeq) return;
      showLoadFailed(function () { openReader(b, c); });
    });
  }

  function findRendered(p) {
    for (var i = 0; i < rendered.length; i++) if (same(rendered[i], p)) return rendered[i];
    return null;
  }
  function scrollToChapter(p, smooth) {
    var r = findRendered(p);
    if (!r) return false;
    exitGlide();
    sysUntil = performance.now() + (smooth && !reduceMotion ? 900 : 150);
    r.el.scrollIntoView({ block: "start", behavior: smooth && !reduceMotion ? "smooth" : "auto" });
    return true;
  }

  function detectViewing() {
    if (!rendered.length) return null;
    var barBottom = $("#rd-bar").getBoundingClientRect().bottom;
    var probe = barBottom + 28;
    var cur = rendered[0], ix = 0;
    for (var i = 0; i < rendered.length; i++) {
      if (rendered[i].el.getBoundingClientRect().top <= probe) { cur = rendered[i]; ix = i; }
    }
    return { b: cur.b, c: cur.c, ix: ix, off: barBottom - cur.el.getBoundingClientRect().top };
  }

  var ticking = false, filling = false;
  function onScroll() {
    if (view !== "reader" || ticking) return;
    ticking = true;
    (window.requestAnimationFrame || function (f) { setTimeout(f, 16); })(function () {
      ticking = false;
      if (view !== "reader") return;
      var cur = detectViewing();
      if (!cur) return;
      readOff = Math.max(0, cur.off);
      if (!same(cur, viewing)) {
        viewing = { b: cur.b, c: cur.c };
        setTitle(label(cur.b, cur.c));
        setHash(cur);
        updatePlayerIdle();
        persist();
      } else persistSoon();
      updateChip();
      fill();
    });
  }
  // keep a chapter or more below the one on screen, so scrolling never runs out of text
  function fill() {
    if (filling) return;
    filling = true;
    var guard = 0;
    (function step() {
      if (view !== "reader" || guard++ >= 4) { filling = false; return; }
      var cur = detectViewing();
      if (!cur) { filling = false; return; }
      var dist = vMax() - vY();
      if (rendered.length - 1 >= cur.ix + 1 && dist >= 1800) { filling = false; return; }
      appendNext().then(function (ok) { if (ok) step(); else filling = false; });
    })();
  }
  function tell(what) { try { if (typeof window.onBBReader === "function") window.onBBReader(what); } catch (e) {} }
  function setHash(p) {
    try { history.replaceState(history.state, "", "#/read/" + tr.id + "/" + (p.b + 1) + "/" + p.c); } catch (e) {}
  }

  /* ---------- audio ---------- */
  function setMsg(t) { $("#rd-pmsg").textContent = t || ""; }

  // plays a short clip on the same <audio> element first (so it inherits the tap that's allowing sound),
  // then hands off to cb -- used to lead a day's audio with the book name when it starts mid-book
  function playPreClip(url, cb) {
    var gen = ++preClipGen;   // guards against a stale play()-rejection landing after a newer open() call took over
    preClipPlaying = true; preClipCb = cb;
    try { A.pause(); A.removeAttribute("src"); A.load(); } catch (e) {}
    A.src = url;
    A.currentTime = 0;
    setMsg(T().loading);
    var pr = A.play();
    if (pr && pr.catch) pr.catch(function () {
      if (gen !== preClipGen) return;   // superseded by a newer open() call
      preClipPlaying = false; preClipCb = null; cb();
    });
  }

  // the clip ending doesn't mean the chapter is ready to read yet -- if the text is still loading (a slow
  // connection can easily take longer than a 1-2 second clip), wait for openReader to finish it first, so the
  // follow-along scroll starts fresh at the top instead of jumping to catch up on audio that got a head start
  function startChapterWhenReady(b, c) {
    if (view === "reader" && findRendered({ b: b, c: c })) { playChapter(b, c); return; }
    pendingChapterStart = { b: b, c: c };
  }

  function playChapter(b, c) {
    playing = { b: b, c: c };
    preloadedFor = "";
    pendingSeek = null; pendingFrac = null; rewound = false; audioT = 0; audioD = 0;
    A.defaultPlaybackRate = rate;
    A.playbackRate = rate;
    setMsg(T().loading);
    $("#rd-seek").value = 0; $("#rd-tcur").textContent = "0:00"; $("#rd-tdur").textContent = "0:00";
    setSrc(A, b, c, function () {
      if (!playing || playing.b !== b || playing.c !== c) return;
      A.defaultPlaybackRate = rate; A.playbackRate = rate;
      if (A._none) { setMsg(T().failNone); updatePP(); return; }   // nothing to play: say so instead of trying
      var pr = A.play();
      if (pr && pr.catch) pr.catch(function (e) {
        var bad = (A.error || (e && e.name === "NotSupportedError")) && /^blob:/.test(A.currentSrc || A.src || "");
        setMsg(e && e.name === "NotAllowedError" ? T().tapStart : bad ? T().failFile : T().failStart);
        updatePP();
      });
    });
    $("#rd-ptxt").textContent = label(b, c);
    refreshPlayerVisibility();
    markPlaying();
    updatePP();
    updateMediaSession();
    updateChip();
    persist();
  }

  // reopening: load the chapter you were listening to, a few seconds earlier, paused
  function restoreAudio(a) {
    if (!a || !tr.audio || !D || !D[a.b] || a.c < 1 || a.c > D[a.b].length) return;
    playing = { b: a.b, c: a.c };
    var t = Math.max(0, a.rw ? (a.t || 0) : (a.t || 0) - 10);
    audioT = t; audioD = a.d || 0; rewound = true; pendingSeek = t;
    setSrc(A, a.b, a.c, function () {
      A.defaultPlaybackRate = rate; A.playbackRate = rate;
      try { A.currentTime = t; } catch (e) {}
    });
    $("#rd-ptxt").textContent = label(a.b, a.c);
    $("#rd-tcur").textContent = fmt(t);
    $("#rd-tdur").textContent = audioD ? fmt(audioD) : "0:00";
    $("#rd-seek").value = audioD ? Math.round(t / audioD * 1000) : 0;
    setMsg(T().resume);
    refreshPlayerVisibility();
    markPlaying();
    updateMediaSession();
  }
  function stopAudio() {
    A.pause();
    if (playing) { try { A.removeAttribute("src"); A.load(); } catch (e) {} }
    playing = null; pendingSeek = null; pendingFrac = null; audioT = 0; audioD = 0; rewound = false; preloadedFor = "";
    setMsg("");
    updatePP();
  }

  function chapterPlayPressed(b, c) {
    var p = { b: b, c: c };
    held = false;
    if (same(playing, p) && !A.error) { togglePlay(); return; }
    playChapter(b, c);
  }

  function togglePlay() {
    if (!tr || !tr.audio) return;
    if (!playing) {
      var cur = viewing || (rendered[0] && { b: rendered[0].b, c: rendered[0].c });
      if (cur) playChapter(cur.b, cur.c);
      return;
    }
    if (A.error || A._none) { var p = playing; playChapter(p.b, p.c); return; }
    if (A.paused) {
      if (followOn && viewingPlaying()) held = false;
      var pr = A.play();
      if (pr && pr.catch) pr.catch(function () { setMsg(T().failStart); });
    } else A.pause();
  }

  function updatePP() {
    if (!root) return;
    var on = !!playing && !A.paused;
    $("#rd-pp").dataset.state = on ? "playing" : "paused";
    $("#rd-pp").setAttribute("aria-label", on ? T().pause : T().play);
    for (var i = 0; i < rendered.length; i++) {
      rendered[i].el.classList.toggle("rd-live", on && same(rendered[i], playing));
    }
  }
  function markPlaying() {
    for (var i = 0; i < rendered.length; i++) rendered[i].el.classList.toggle("rd-playing", same(rendered[i], playing));
    updatePP();
  }
  function updatePlayerIdle() {
    if (playing || seeking) return;
    if (!viewing) return;
    $("#rd-ptxt").textContent = label(viewing.b, viewing.c);
    if (!tr.audio) return;
    var v = viewing, k = lenCache[lenKey(v)];
    $("#rd-tcur").textContent = "0:00"; $("#rd-seek").value = 0;
    $("#rd-tdur").textContent = k ? fmt(k) : "0:00";
    clearTimeout(probeTimer);
    if (!k) probeTimer = setTimeout(function () {      // read the length now, so the slider works before you press play
      probeLen(v, function (len) { if (len && !playing && viewing && same(viewing, v)) $("#rd-tdur").textContent = fmt(len); });
    }, 600);
  }
  function refreshPlayerVisibility() {
    var audio = !!(tr && tr.audio), show = isOpen && audio && view !== "loading";
    $("#rd-player").hidden = !show;
    html.classList.toggle("rd-has-player", show);
    html.classList.toggle("rd-noaudio", !audio);
  }

  function goTo(p, autoplay) {
    if (!p) return;
    if (view === "reader" && findRendered(p)) {
      scrollToChapter(p, false);
      if (autoplay) playChapter(p.b, p.c);
      return;
    }
    setHash(p);
    openReader(p.b, p.c);
    if (autoplay) playChapter(p.b, p.c);
  }
  function onPrev() {
    var base = playing || viewing;
    if (!base) return;
    if (playing && A.currentTime > 3) { A.currentTime = 0; return; }
    var p = prevOf(base);
    if (p) goTo(p, !!playing);
  }
  function onNext() {
    var p = nextOf(playing || viewing);
    if (p) goTo(p, !!playing);
  }

  function onEnded() {
    if (preClipPlaying) { preClipPlaying = false; var cb = preClipCb; preClipCb = null; if (cb) cb(); return; }
    var ended = playing;
    try { if (ended && typeof window.onBBChapterDone === "function") window.onBBChapterDone(tr && tr.id, ended.b, ended.c); } catch (e) {}
    var n = nextOf(ended);
    if (!n) { updatePP(); setMsg(T().end); return; }
    var cur = view === "reader" ? detectViewing() : null;
    var following = !!cur && same(cur, ended);
    var startNext = function () {
      playChapter(n.b, n.c);
      if (following && view === "reader" && !followOn) scrollToChapter(n, true);   // with Auto on, the follow loop glides there
      if (view === "reader") onScroll();
    };
    var go = function () {
      // crossing into a different book mid-day: announce it too, same as the day's very first chapter --
      // audio-only, there'd otherwise be no cue you just left one book and landed in another
      var clipUrl = (ended && n.b !== ended.b) ? bookNameClipUrl(tr, n.b, n.c) : "";
      if (clipUrl) playPreClip(clipUrl, startNext); else startNext();
    };
    if (view === "reader" && !findRendered(n)) ensureRendered(n).then(go, go); else go();
  }

  function preloadNext() {
    var n = nextOf(playing);
    if (!n) return;
    var u = audioUrl(n.b, n.c);
    if (preloadedFor === u) return;
    preloadedFor = u;
    setSrc(P, n.b, n.c, function () { try { P.load(); } catch (e) {} });
  }

  function onMeta() {
    var D0 = realDur();
    if (D0 > 0) { audioD = D0; $("#rd-tdur").textContent = fmt(D0); if (playing) lenCache[lenKey(playing)] = D0; }
    if (pendingFrac !== null && D0 > 0) { pendingSeek = pendingFrac * D0; pendingFrac = null; }
    if (pendingSeek !== null && D0 > 0) {
      var t = Math.min(pendingSeek, Math.max(0, D0 - 1));
      pendingSeek = null;
      try { A.currentTime = t; } catch (e) {}
    }
  }

  /* ---------- seek bar: the text scrolls along while you drag ---------- */
  var sband = null, bandTimer = 0;
  // scroll the text so the spot for audio-time t (or, if the length is not known yet, for a fraction of the chapter) sits in the middle, and show the soft band
  function seekScroll(t, frac, ch) {
    exitGlide();
    var y = null;
    try { y = estimateY(t, frac, ch); } catch (e) { y = null; }
    if (y == null) return;
    var top = $("#rd-bar").getBoundingClientRect().bottom;
    var pl = $("#rd-player"), bottom = pl.hidden ? window.innerHeight : pl.getBoundingClientRect().top;
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var target = Math.max(0, Math.min(max, y - (top + bottom) / 2));
    sysUntil = performance.now() + 400; fpos = null;
    window.scrollTo(0, Math.round(target));
    var h = (bottom - top) / 3;
    sband.style.top = Math.round((top + bottom) / 2 - h / 2) + "px";
    sband.style.height = Math.round(h) + "px";
    sband.classList.add("on");
  }
  function seekDone() {
    seeking = false; seekCh = null;
    clearTimeout(bandTimer);
    bandTimer = setTimeout(function () { sband.classList.remove("on"); }, 3000);   // stays for 3 seconds, then fades out
  }
  // nothing playing yet: load the chapter you are looking at, paused, at the spot you chose
  function loadPaused(ch, t, fr, d) {
    playing = { b: ch.b, c: ch.c };
    preloadedFor = "";
    audioT = t != null ? t : 0; audioD = d || 0; rewound = true;
    pendingSeek = t != null ? t : null; pendingFrac = t != null ? null : fr;
    setSrc(A, ch.b, ch.c, function () { A.defaultPlaybackRate = rate; A.playbackRate = rate; });
    $("#rd-ptxt").textContent = label(ch.b, ch.c);
    $("#rd-tcur").textContent = t != null ? fmt(t) : "0:00";
    $("#rd-tdur").textContent = d ? fmt(d) : "0:00";
    refreshPlayerVisibility(); markPlaying(); updateMediaSession(); updateChip(); persist();
  }

  function showRate() { $("#rd-spd").textContent = (rate === 1 ? "1" : String(rate)) + "×"; }

  function updateMediaSession() {
    if (!("mediaSession" in navigator) || !playing || !tr) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: label(playing.b, playing.c), artist: tr.name, album: nm(playing.b) });
    } catch (e) {}
  }
  function updateSession() {
    if (!("mediaSession" in navigator)) return;
    try { navigator.mediaSession.playbackState = A.paused ? "paused" : "playing"; } catch (e) {}
  }

  function updateChip() {
    if (!root) return;
    var chip = $("#rd-chip");
    var other = view === "reader" && !!playing && !!viewing && !same(playing, viewing);
    var show;
    if (engineOn()) show = false;                                   // Auto is following the audio: no chip needed
    else if (followOn && held && playing && !A.paused && findRendered(playing)) { show = true; chip.textContent = T().followChip; }
    else { show = other; if (show) chip.textContent = T().chip(label(playing.b, playing.c)); }
    chip.hidden = !show;
  }
  function chipTapped() {
    if (followOn && playing && !A.paused && findRendered(playing)) { held = false; updateChip(); kick(); }
    else ptitleTapped();
  }
  function ptitleTapped() {
    var p = playing || viewing;
    if (!p) return;
    if (view === "reader" && findRendered(p)) scrollToChapter(p, true);
    else { setHash(p); openReader(p.b, p.c); }
  }

  /* ---------- Auto: scroll along with the audio ----------
     Guess where the narrator is from the characters of the chapter, spread over the length of the
     recording, and keep that spot in the middle of the visible reading area. */
  var LEAD = { kjv: 2, rst: 3 };   // seconds of "John chapter 3" announcement before the verses start
  var TAIL = 1;                    // seconds of silence at the end
  var followOn = (load("bb-rd-follow") || (reduceMotion ? "0" : "1")) === "1";
  var held = false, sysUntil = 0, raf = 0, lastTs = 0, fpos = null, pitch = 0, rng = document.createRange();

  /* ---------- smooth scrolling while listening ----------
     A page can only scroll in whole pixels, and reading moves only ~10 pixels a second, so following the audio by
     scrolling makes the text hop one pixel at a time. Instead, while the audio plays and the text follows it, the
     chapters are pinned in place and slid by the graphics hardware, a fraction of a pixel every frame ("gliding").
     Whenever anything else needs the page -- your finger, seeking, text size, closing -- it becomes a normal page
     again at exactly the same spot. A swipe while gliding moves the text with your finger, coasts a short way, and
     then hands over to normal scrolling; a tap just stops following. */
  var smoothOn = (load("bb-rd-smooth") || (reduceMotion ? "0" : "1")) === "1";
  var G = { on: false, pos: 0, top: 0, trail: 0, vel: 0, drag: null, viewAt: 0, ck: "", tr: null };
  var CH_GLIDE = 3000;   // ms to glide from the end of one chapter to the start of the next
  function vY() { return G.on ? G.pos : window.scrollY; }               // how far down the reading is, gliding or not
  function vMax() {
    if (!G.on) return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, G.top + $("#rd-body").offsetHeight + G.trail - window.innerHeight);
  }
  function gPlace(p) { G.pos = p; $("#rd-body").style.transform = "translate3d(0," + (-p) + "px,0)"; }
  function enterGlide() {
    if (G.on) return;
    var b = $("#rd-body"), r = b.getBoundingClientRect(), y = window.scrollY;
    G.top = r.top + y;
    G.trail = Math.max(0, document.documentElement.scrollHeight - (G.top + b.offsetHeight));
    G.on = true; G.vel = 0; G.tr = null; G.ck = playing ? playing.b + ":" + playing.c : "";
    b.style.top = G.top + "px"; b.style.left = r.left + "px"; b.style.width = r.width + "px"; b.style.boxSizing = "border-box";
    html.classList.add("rd-glide");
    sysUntil = performance.now() + 300;
    window.scrollTo(0, 0);
    gPlace(y);
  }
  // the audio stopped following for a moment -- most often the gap while one chapter ends and the next one loads.
  // Swapping to a normal page and straight back makes Safari show one misplaced frame (a flash), so wait a little
  // first; if following starts again in time, the text just keeps gliding. A finger, seeking, text size and closing
  // still switch at once (they call exitGlide directly).
  var exitTimer = 0;
  function exitGlideSoon() {
    if (!G.on || exitTimer) return;
    exitTimer = setTimeout(function () { exitTimer = 0; if (!engineOn()) { exitGlide(); onScroll(); } }, 1500);
  }
  function exitGlide() {
    if (exitTimer) { clearTimeout(exitTimer); exitTimer = 0; }
    if (!G.on || G.drag) return;                       // never swap pages under a finger
    var p = G.pos, b = $("#rd-body");
    G.on = false;
    html.classList.remove("rd-glide");
    b.style.top = b.style.left = b.style.width = b.style.transform = b.style.boxSizing = "";
    sysUntil = performance.now() + 300;
    window.scrollTo(0, Math.round(p));
    fpos = null;
  }
  function setSmooth(on) {
    smoothOn = !!on; store("bb-rd-smooth", smoothOn ? "1" : "0");
    if (!smoothOn) exitGlide();
    fpos = null; kick();
  }
  // a finger on the text while it glides
  function gTouchStart(e) {
    if (!G.on || !e.touches || e.touches.length !== 1) return;
    var t = e.touches[0];
    G.drag = { y0: t.clientY, p0: G.pos, pts: [[performance.now(), t.clientY]], moved: false };
    held = true; G.vel = 0; updateChip();                // following stops at once; the text stays where it is
  }
  function gTouchMove(e) {
    if (!G.drag || !e.touches || !e.touches.length) return;
    var t = e.touches[0], dy = t.clientY - G.drag.y0;
    if (Math.abs(dy) > 6) G.drag.moved = true;
    if (e.cancelable) e.preventDefault();
    gPlace(Math.max(0, Math.min(vMax(), G.drag.p0 - dy)));
    G.drag.pts.push([performance.now(), t.clientY]); if (G.drag.pts.length > 6) G.drag.pts.shift();
  }
  function gTouchEnd() {
    if (!G.drag) return;
    var d = G.drag;
    if (!d.moved) { G.drag = null; exitGlide(); onScroll(); return; }   // a tap: a normal page right away
    // the speed of the last moments of the swipe (px per ms; positive = the text moving up), then a short coast
    var a = d.pts[0], z = d.pts[d.pts.length - 1], ms = Math.max(1, z[0] - a[0]);
    var v = performance.now() - z[0] > 80 ? 0 : -(z[1] - a[1]) / ms, last = performance.now(), gone = 0, cap = window.innerHeight * 0.6;
    G.drag = { coasting: true };
    (function coast(now) {
      var dt = Math.min(32, now - last); last = now;
      v *= Math.exp(-dt / 250);
      var step = v * dt; gone += Math.abs(step);
      if (Math.abs(v) > 0.02 && gone < cap) { gPlace(Math.max(0, Math.min(vMax(), G.pos + step))); requestAnimationFrame(coast); }
      else { G.drag = null; exitGlide(); onScroll(); }   // settle into the normal page right here
    })(last);
  }

  function lenKey(ch) { return tr.id + ":" + ch.b + ":" + ch.c; }
  // the playing chapter's length. The browser's number is used unless it disagrees with the length counted from the
  // file itself, or playback has already gone past it -- both mean the file's header was wrong.
  function realDur() {
    var d = A.duration, e = A._estD || 0;
    if (e > 0 && (!isFinite(d) || d <= 0 || Math.abs(d - e) > Math.max(2, e * 0.05))) return e;
    if (isFinite(d) && d > 0 && A.currentTime > d + 1) return 0;     // ran past the end it reported: length unknown
    return isFinite(d) && d > 0 ? d : 0;
  }
  function curDuration(ch) {
    ch = ch || playing;
    if (!ch) return 0;
    if (playing && same(ch, playing)) {
      var d = realDur();
      if (d > 0) return d;
      if (audioD > 0) return audioD;
    }
    return lenCache[lenKey(ch)] > 0 ? lenCache[lenKey(ch)] : 0;
  }
  // read just the length of a chapter's audio, without playing it
  function probeLen(ch, cb) {
    var k = lenKey(ch);
    if (lenCache[k] > 0) { if (cb) cb(lenCache[k]); return; }
    if (probing[k]) { probing[k].push(cb); return; }
    probing[k] = [cb];
    var a = new Audio(), t, done = false;
    function fin(v) {
      if (done) return; done = true; clearTimeout(t);
      a.onloadedmetadata = a.ondurationchange = a.onerror = null;
      try { a.removeAttribute("src"); a.load(); } catch (e) {}
      if (a._bu) { try { URL.revokeObjectURL(a._bu); } catch (e) {} a._bu = null; }
      if (v > 0) lenCache[k] = v;
      var cbs = probing[k]; delete probing[k];
      for (var i = 0; i < cbs.length; i++) if (cbs[i]) cbs[i](v || 0);
    }
    function check() { var d = a._estD > 0 ? a._estD : a.duration; if (isFinite(d) && d > 0) fin(d); }
    a.onloadedmetadata = check; a.ondurationchange = check;
    a.onerror = function () { fin(0); };
    t = setTimeout(function () { fin(0); }, 20000);
    a.preload = "metadata"; setSrc(a, ch.b, ch.c, function () { try { a.load(); } catch (e) {} });
  }
  function charMap(sec) {
    if (sec._cm) return sec._cm;
    var nodes = [], cum = [], tot = 0, vs = sec.querySelectorAll(".rd-v");
    for (var i = 0; i < vs.length; i++) {
      var tn = vs[i].lastChild;
      if (!tn || tn.nodeType !== 3) continue;
      nodes.push(tn); cum.push(tot); tot += tn.nodeValue.length;
    }
    return (sec._cm = { nodes: nodes, cum: cum, total: tot, p: sec.querySelector(".rd-text") });
  }
  function linePitch(p) {
    if (pitch) return pitch;
    var cs = window.getComputedStyle(p);
    var lh = parseFloat(cs.lineHeight);
    if (!isFinite(lh)) lh = parseFloat(cs.fontSize) * 1.72;
    return (pitch = isFinite(lh) && lh > 0 ? lh : 30);
  }
  // document y (in px) of the spot being read right now, or null if it cannot be worked out yet
  function estimateY(tt, fr0, ch) {
    ch = ch || playing;
    if (!ch) return null;
    var r = findRendered(ch); if (!r) return null;
    var d = curDuration(ch); if (fr0 == null && !(d > 2)) return null;
    var m = charMap(r.el); if (!m.total) return null;
    var lead = LEAD[tr.audio] || 2;
    var f = fr0 != null ? fr0 : ((tt == null ? A.currentTime : tt) - lead) / Math.max(1, d - lead - TAIL);
    f = f < 0 ? 0 : f > 1 ? 1 : f;
    var cp = f * (m.total - 1), ci = Math.floor(cp), fr = cp - ci;
    var lo = 0, hi = m.cum.length - 1;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (m.cum[mid] <= ci) lo = mid; else hi = mid - 1; }
    var tn = m.nodes[lo], off = ci - m.cum[lo];
    rng.setStart(tn, off); rng.setEnd(tn, Math.min(tn.nodeValue.length, off + 1));
    var rc = rng.getClientRects()[0];
    if (!rc) return null;
    var pr = m.p.getBoundingClientRect(), pt = linePitch(m.p);
    var lf = pr.width > 0 ? (rc.left + rc.width * fr - pr.left) / pr.width : 0.5;
    lf = lf < 0 ? 0 : lf > 1 ? 1 : lf;
    // position inside the line (left to right) moves the spot smoothly down the line, so scrolling never jumps a whole line
    return vY() + rc.top + rc.height / 2 + (lf - 0.5) * pt;
  }
  function engineOn() { return isOpen && view === "reader" && followOn && !held && !seeking && !!playing && !A.paused; }
  function viewingPlaying() {
    var r = playing && findRendered(playing); if (!r) return false;
    var rc = r.el.getBoundingClientRect(), top = $("#rd-bar").getBoundingClientRect().bottom;
    var pl = $("#rd-player"), bottom = pl.hidden ? window.innerHeight : pl.getBoundingClientRect().top;
    return rc.bottom > top && rc.top < bottom;
  }
  function frame(ts) {
    raf = 0;
    if (!engineOn()) { if (held || !followOn || view !== "reader") exitGlide(); else exitGlideSoon(); return; }
    if (exitTimer) { clearTimeout(exitTimer); exitTimer = 0; }
    raf = requestAnimationFrame(frame);
    if (performance.now() < sysUntil || pendingFrac !== null) { fpos = null; return; }
    var y = null;
    try { y = estimateY(); } catch (e) { y = null; }   // never let a layout hiccup break reading
    if (y == null) return;
    var top = $("#rd-bar").getBoundingClientRect().bottom;
    var pl = $("#rd-player"), bottom = pl.hidden ? window.innerHeight : pl.getBoundingClientRect().top;
    var max = vMax();
    var target = Math.max(0, Math.min(max, y - (top + bottom) / 2));
    if (smoothOn) {
      // glide: move at the steady speed the reading spot moves over the next few seconds, with a gentle pull toward it
      if (!G.on) { enterGlide(); fpos = null; }
      if (fpos === null) { fpos = G.pos; G.tr = null; }
      var dtg = Math.min(0.1, (ts - lastTs) / 1000 || 0.016); lastTs = ts;
      var t0 = A.currentTime, ya = null, yb = null;
      try { ya = estimateY(t0 + 3); yb = estimateY(Math.max(0, t0 - 3)); } catch (e) {}
      var v = ya != null && yb != null ? (ya - yb) / (t0 + 3 - Math.max(0, t0 - 3)) * (A.playbackRate || 1) : 0;
      // the audio moved on to the next chapter: one gentle move across the gap -- speed up, cross, slow into the
      // reading -- over about three seconds (mostly while the book and chapter are announced), instead of a lurch
      var ck = playing ? playing.b + ":" + playing.c : "";
      if (ck !== G.ck) {
        if (G.ck && Math.abs(target - fpos) < window.innerHeight * 3) G.tr = { p0: fpos, t0: ts, v0: G.vel };
        G.ck = ck;
      }
      if (G.tr) {
        var u = (ts - G.tr.t0) / CH_GLIDE;
        if (u >= 1 || Math.abs(target - G.tr.p0) > window.innerHeight * 3) { G.tr = null; G.vel = v; }
        else {
          // ease in and out between where it was and where the reading is now; the reading keeps moving, so
          // the end of the move lands on it and carries straight on at its speed
          var e = u * u * (3 - 2 * u);
          fpos = Math.max(0, Math.min(max, G.tr.p0 + G.tr.v0 * (ts - G.tr.t0) / 1000 * (1 - e) + (target - G.tr.p0) * e));
          gPlace(fpos);
          if (ts - G.viewAt > 300) { G.viewAt = ts; onScroll(); }
          return;
        }
      }
      G.vel += (v - G.vel) * (1 - Math.exp(-dtg / 1.2));
      var gd = target - fpos;
      if (Math.abs(gd) > window.innerHeight * 1.5) fpos = target;                       // far away: jump
      else fpos += G.vel * dtg + gd * (1 - Math.exp(-dtg / (Math.abs(gd) > 40 ? 0.45 : 2.5)));   // catch up briskly, then glide
      fpos = Math.max(0, Math.min(max, fpos));
      gPlace(fpos);
      if (ts - G.viewAt > 300) { G.viewAt = ts; onScroll(); }   // chapter name, saved place, next chapter: as if it had scrolled
      return;
    }
    var cur = window.scrollY;
    if (fpos === null || Math.abs(fpos - cur) > 3) fpos = cur;
    var dt = Math.min(0.1, (ts - lastTs) / 1000 || 0.016); lastTs = ts;
    var dist = target - fpos;
    if (Math.abs(dist) > window.innerHeight * 1.5) fpos = target;          // far away: jump
    else fpos += dist * (1 - Math.exp(-dt / 0.28));                        // near: glide
    var ry = Math.round(fpos);
    if (ry !== Math.round(cur)) window.scrollTo(0, ry);
  }
  function kick() {
    if (!engineOn()) { if (held || !followOn || view !== "reader") exitGlide(); else exitGlideSoon(); updateChip(); return; }
    updateChip();
    if (!raf) { lastTs = performance.now(); fpos = null; raf = requestAnimationFrame(frame); }
  }
  function hold() {
    if (!isOpen || !followOn || held || !playing) return;
    if (performance.now() < sysUntil && !G.on) return;
    held = true; updateChip();
    exitGlide();                                       // (waits while a finger is moving the gliding text)
  }
  function showFollow() { $("#rd-fol").setAttribute("aria-pressed", followOn ? "true" : "false"); }

  /* ---------- text size ---------- */
  function sizePct() { return Math.round(Math.pow(ZSTEP, zoom) * 100); }
  // keep=true: stay on the same line of the same chapter while the text grows or shrinks
  function applySize(keep) {
    var anchor = null;
    exitGlide();
    if (keep && view === "reader") {
      var cur = detectViewing();
      if (cur) { var h = rendered[cur.ix].el.offsetHeight; anchor = { ix: cur.ix, ratio: h ? cur.off / h : 0 }; }
    }
    var px = ZBASE * Math.pow(ZSTEP, zoom);
    html.style.setProperty("--rd-fs", (px >= 1 ? px.toFixed(2) : px.toFixed(8)) + "px");
    pitch = 0;
    if (anchor) {
      var sec = rendered[anchor.ix].el;
      var barB = $("#rd-bar").getBoundingClientRect().bottom;
      var top = sec.getBoundingClientRect().top;
      sysUntil = performance.now() + 300;
      window.scrollTo(0, Math.max(0, window.scrollY + top - barB + anchor.ratio * sec.offsetHeight));
    }
    $("#rd-zr").hidden = zoom === 0;   // the Reset button only shows when the size is not standard
  }
  function changeSize(d) {
    zoom += d; store("bb-rd-zoom", String(zoom));
    applySize(true); onScroll();
    toast(T().textSize + " " + sizePct() + "%", 1200);
  }

  /* ---------- translation menu ---------- */
  function closeTrMenu() { $("#rd-trmenu").hidden = true; }
  function openTrMenu() {
    var m = $("#rd-trmenu");
    m.textContent = "";
    var box = el("div", "box");
    box.setAttribute("role", "menu");
    box.appendChild(el("h2", null, T().trLabel));
    ORDER.forEach(function (id) {
      var t = TR[id];
      var b = el("button", "opt");
      b.type = "button";
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("aria-checked", t === tr ? "true" : "false");
      var n = el("span", "nm");
      n.appendChild(el("b", null, t.name));
      n.appendChild(el("small", null, (S[t.lang] || S.en)[t.audio ? "withAudio" : "textOnly"]));
      b.appendChild(n);
      b.appendChild(el("span", "cd", t.short));
      b.onclick = function () { closeTrMenu(); switchTr(id); };
      box.appendChild(b);
    });
    box.appendChild(el("h2", null, T().scrollLabel));
    var sm = el("button", "opt");
    sm.type = "button";
    sm.setAttribute("role", "menuitemcheckbox");
    sm.setAttribute("aria-checked", smoothOn ? "true" : "false");
    var sn = el("span", "nm");
    sn.appendChild(el("b", null, T().smoothName));
    sn.appendChild(el("small", null, T().smoothHelp));
    sm.appendChild(sn);
    sm.appendChild(el("span", "cd", smoothOn ? T().on : T().off));
    sm.onclick = function () { setSmooth(!smoothOn); closeTrMenu(); toast(T().smoothName + ": " + (smoothOn ? T().on : T().off), 1400); };
    box.appendChild(sm);
    m.appendChild(box);
    m.hidden = false;
    m.onclick = function (e) { if (e.target === m) closeTrMenu(); };
  }
  function setTr(t) {
    tr = t;
    D = Ds[t.id] || null;
  }
  function switchTr(id) {
    var to = TR[id];
    if (!to || to === tr || !isOpen) return;
    var cur = viewing ? { b: viewing.b, c: viewing.c } : { b: 0, c: 1 };
    var from = tr, fromView = view;
    stopAudio();
    setTr(to);
    view = "loading";
    setTitle(T().loading);
    getIndex(to.id).then(function () {
      if (tr !== to) return;
      D = Ds[to.id];
      if (cur.b === 18 && from.ps !== to.ps) cur.c = from.ps === "en" ? psEnToRu(cur.c) : psRuToEn(cur.c);
      cur.c = Math.max(1, Math.min(cur.c, D[cur.b].length));
      applyStrings(); showRate();
      setHash(cur);
      openReader(cur.b, cur.c);
    }, function () {
      if (tr !== to) return;
      setTr(from);
      view = fromView;
      applyStrings();
      refreshPlayerVisibility();
      toast(T().noText);
      if (viewing) setTitle(label(viewing.b, viewing.c));
    });
  }

  /* ---------- opening and closing ---------- */
  function enter(noPush) {
    if (isOpen) return;
    isOpen = true; mainScroll = window.scrollY; origTitle = document.title;
    manualScroll(true);
    tell("opened");
    html.classList.add("rd-open");
    root.hidden = false;
    pushed = false;
    if (!noPush) { try { history.pushState({ rd: 1 }, "", "#/read"); pushed = true; } catch (e) { pushed = false; } }
    window.scrollTo(0, 0);
  }
  function close(fromPop) {
    if (!isOpen) return;
    G.drag = null; exitGlide();
    persist();
    A.pause();
    isOpen = false; view = "closed";
    openSeq++;
    pendingChapterStart = null;
    closeTrMenu();
    sband.classList.remove("on");
    root.hidden = true;
    html.classList.remove("rd-open", "rd-has-player", "rd-noaudio");
    document.title = origTitle;
    manualScroll(false);
    window.scrollTo(0, mainScroll);
    tell("closed");
    if (fromPop) pushed = false;
    else if (pushed) { pushed = false; try { history.back(); } catch (e) {} }
    else { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
  }

  // BBReader.open(translationId, bookIndex, chapter, {play: true, resume: true})
  function open(trId, b, c, o) {
    o = o || {};
    var t = TR[trId];
    if (!t) return false;
    build();
    b = Math.max(0, Math.min(65, b | 0)); c = Math.max(1, c | 0);
    var st = o.resume ? loadState() : null;
    seqList = null;
    if (o.list && o.list.length) {
      seqList = [];
      for (var li = 0; li < o.list.length; li++) { var q = { b: o.list[li].b | 0, c: o.list[li].c | 0 }; if (seqIx(q) < 0) seqList.push(q); }
      if (seqList.length < 2) seqList = null; else { b = seqList[0].b; c = seqList[0].c; }
    }
    enter(o.noPush);
    if (tr !== t) { stopAudio(); setTr(t); }
    else if (!o.resume && playing && !(same(playing, { b: b, c: c }))) stopAudio();
    applyStrings(); showRate(); showFollow();
    view = "loading";
    refreshPlayerVisibility();
    if (o.play && tr.audio) {   // started right here, inside the tap, so the browser allows sound
      var clipUrl = o.bookClip ? bookNameClipUrl(t, b, c) : "";
      if (clipUrl) playPreClip(clipUrl, function () { startChapterWhenReady(b, c); });
      else playChapter(b, c);
    }
    getIndex(t.id).then(function () {
      if (tr !== t || !isOpen) return;
      D = Ds[t.id];
      if (c > D[b].length) c = D[b].length;
      if (st && st.tr === t.id && st.read && st.read.b === b && st.read.c === c) resumeOff = { b: b, c: c, off: st.read.off || 0 };
      setHash({ b: b, c: c });
      if (!o.play && st && st.tr === t.id && st.audio) restoreAudio(st.audio);
      openReader(b, c);
    }, function () {
      if (tr !== t) return;
      showLoadFailed(function () { open(trId, b, c, o); });
    });
    return true;
  }

  /* ---------- wiring (once) ---------- */
  function build() {
    if (root) return;
    root = document.createElement("div");
    root.id = "rd";
    root.hidden = true;
    root.innerHTML = MARKUP;
    document.body.appendChild(root);
    sband = $("#rd-sband");

    A.addEventListener("play", function () { updatePP(); updateSession(); kick(); });
    A.addEventListener("pause", function () { updatePP(); updateSession(); if (playing && pendingSeek === null) { audioT = A.currentTime; persist(); } });
    A.addEventListener("playing", function () { setMsg(""); updatePP(); kick(); });
    A.addEventListener("waiting", function () { setMsg(T().loading); });
    A.addEventListener("canplaythrough", function () { setMsg(""); preloadNext(); });
    A.addEventListener("ended", onEnded);
    A.addEventListener("error", function () {
      if (preClipPlaying) { preClipPlaying = false; var cb = preClipCb; preClipCb = null; if (cb) cb(); return; }   // missing/bad clip: just skip to the chapter
      if (!playing) return;
      if (A._none) { setMsg(T().failNone); updatePP(); return; }
      setMsg(/^blob:/.test(A.currentSrc || A.src || "") ? T().failFile : T().failLoad);
      updatePP();
    });
    A.addEventListener("loadedmetadata", onMeta);
    A.addEventListener("durationchange", onMeta);
    A.addEventListener("timeupdate", function () {
      if (seeking || pendingSeek !== null) return;
      var d = realDur();
      audioT = A.currentTime;
      if (!A.paused && audioT > 0.5) rewound = false;
      $("#rd-tcur").textContent = fmt(A.currentTime);
      if (isFinite(d) && d > 0) $("#rd-seek").value = Math.round(A.currentTime / d * 1000);
      persistSoon();   // saves your place every few seconds while listening
    });

    var seek = $("#rd-seek");
    seek.addEventListener("input", function () {
      var ch = seekCh || playing || viewing;
      if (!ch) return;
      seeking = true; seekCh = ch; clearTimeout(bandTimer);
      var d = curDuration(ch);
      if (d > 0) { var t = seek.value / 1000 * d; $("#rd-tcur").textContent = fmt(t); seekScroll(t, null, ch); }
      else { seekScroll(null, seek.value / 1000, ch); if (!playing) probeLen(ch, null); }   // length not known yet: use how far along the bar is
    });
    seek.addEventListener("change", function () {
      var ch = seekCh || playing || viewing;
      if (!ch) { seeking = false; return; }
      var d = curDuration(ch), fr = seek.value / 1000, t = d > 0 ? fr * d : null;
      seekScroll(t, t == null ? fr : null, ch);
      if (!playing) loadPaused(ch, t, fr, d);
      else if (t != null) { A.currentTime = t; audioT = A.currentTime; pendingSeek = null; pendingFrac = null; rewound = false; persist(); }
      else { pendingFrac = fr; pendingSeek = null; rewound = false; }   // applied as soon as the audio reports its length
      seekDone();
      held = false; updateChip(); kick();   // after you let go, auto-scroll carries on from the new spot
    });

    $("#rd-spd").onclick = function () {
      rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
      A.defaultPlaybackRate = rate; A.playbackRate = rate;
      store("bb-rd-rate", String(rate));
      showRate();
    };
    $("#rd-pp").onclick = togglePlay;
    $("#rd-prev").onclick = onPrev;
    $("#rd-next").onclick = onNext;
    $("#rd-ptitle").onclick = ptitleTapped;

    if ("mediaSession" in navigator) {
      var acts = {
        play: function () { togglePlay(); }, pause: function () { A.pause(); },
        previoustrack: onPrev, nexttrack: onNext,
        seekbackward: function () { A.currentTime = Math.max(0, A.currentTime - 15); },
        seekforward: function () { A.currentTime = Math.min(realDur() || 1e9, A.currentTime + 15); }
      };
      Object.keys(acts).forEach(function (k) { try { navigator.mediaSession.setActionHandler(k, acts[k]); } catch (e) {} });
    }

    $("#rd-chip").onclick = chipTapped;
    // on iPhone, touching the screen while it is still coasting only stops the coasting and gives no "click";
    // reacting to the touch itself makes the button work even then
    $("#rd-chip").addEventListener("touchstart", function (e) { e.preventDefault(); chipTapped(); }, { passive: false });

    document.addEventListener("touchstart", function (e) { if (e.target && e.target.closest && e.target.closest("#rd-body")) gTouchStart(e); }, { passive: true });
    document.addEventListener("touchmove", function (e) { if (G.drag && !G.drag.coasting) gTouchMove(e); }, { passive: false });
    document.addEventListener("touchend", gTouchEnd, { passive: true });
    document.addEventListener("touchcancel", gTouchEnd, { passive: true });
    document.addEventListener("touchmove", function (e) { if (e.target && e.target.closest && e.target.closest("#rd-body")) hold(); }, { passive: true });
    window.addEventListener("wheel", hold, { passive: true });
    window.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { if (!$("#rd-trmenu").hidden) closeTrMenu(); else close(false); return; }
      if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key) && !/INPUT|TEXTAREA|BUTTON/.test((e.target && e.target.tagName) || "")) hold();
    });
    window.addEventListener("resize", function () { pitch = 0; exitGlide(); onScroll(); });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden" && isOpen) persist(); });
    window.addEventListener("pagehide", function () { if (isOpen) persist(); });
    // the phone's back swipe / back button closes the reader
    window.addEventListener("popstate", function () { if (isOpen) close(true); });

    $("#rd-fol").onclick = function () {
      followOn = !followOn; store("bb-rd-follow", followOn ? "1" : "0");
      held = false; showFollow(); updateChip(); kick();
    };
    $("#rd-sm").onclick = function () { changeSize(-1); };
    $("#rd-lg").onclick = function () { changeSize(1); };
    $("#rd-zr").onclick = function () { changeSize(-zoom); };
    $("#rd-langb").onclick = openTrMenu;
    $("#rd-back").onclick = function () { close(false); };
    showRate(); showFollow();
    applySize(false);
  }

  /* ---------- start: a reload while reading comes back to the same spot ---------- */
  function boot() {
    var m = /^#\/read\/([a-z0-9]+)\/(\d+)\/(\d+)/.exec(location.hash);
    if (m && TR[m[1]]) open(m[1], Math.max(0, parseInt(m[2], 10) - 1), parseInt(m[3], 10), { resume: true, noPush: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  loadAudioHave().catch(function () {});
  healCustoms().then(healAudio);
  tell("ready");

  window.BBReader = {
    dl: {
      importAudio: importAudio, planAudio: planAudio, prepShrink: prepShrink, benchShrink: benchShrink, parseAudioName: parseAudioName, quick: dlQuick, status: dlStatus, start: dlStart, pause: dlPause, resume: dlResume, remove: dlRemove,
      job: function (id, kind) { return dlJobs[id + "|" + kind] || null; },
      on: function (fn) { dlSubs.push(fn); }, off: function (fn) { var i = dlSubs.indexOf(fn); if (i >= 0) dlSubs.splice(i, 1); },
      supported: function () { return !!window.caches; }
    },
    open: open,
    addVersion: addVersion, removeVersion: removeVersion, customs: readCustoms, healCustoms: healCustoms,
    customMissing: function (id) { return !!customMissing[id]; },
    storageReport: storageReport, adoptAudio: adoptAudio, audioFolders: customAudioFolders,
    audioUrl: function (id, b, c) { return audioUrlFor(TR[id], b, c); },   // the recording's address, so the plan screen can ask it how long a chapter is
    close: function () { close(false); },
    saved: savedSpot,
    translations: function () { return ORDER.map(function (id) { return TR[id]; }); },
    isOpen: function () { return isOpen; },
    // used by the tests
    _t: { A: A, P: P, audioUrl: audioUrl, state: function () { return { tr: tr && tr.id, playing: playing, pendingSeek: pendingSeek, view: view, viewing: viewing, rendered: rendered.length }; }, psEnToRu: psEnToRu, psRuToEn: psRuToEn }
  };
})();
