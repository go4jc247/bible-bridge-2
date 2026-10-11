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
      chip: function (x) { return "Playing " + x + " · Jump there"; }, followChip: "Resume auto-scroll", textSize: "Text size", reset: "Reset",
      resetLabel: "Reset text size to standard", auto: "Auto", autoLabel: "Scroll along with the audio", resume: "Ready to resume · tap play",
      play: "Play", pause: "Pause", prev: "Previous chapter", next: "Next chapter", back: "Back", smaller: "Smaller text",
      larger: "Larger text", speed: "Playback speed", seek: "Seek", jump: "Go to the chapter that is playing",
      trLabel: "Bible translation", withAudio: "Text and audio", textOnly: "Text only",
      noText: "The text did not load. Check your connection.", retry: "Try again" },
    ru: { end: "Конец Библии", loading: "Загрузка…", tapStart: "Нажмите «Воспроизвести»",
      failStart: "Аудио не запустилось. Нажмите «Воспроизвести» ещё раз.", failLoad: "Аудио не загрузилось. Проверьте соединение и нажмите «Воспроизвести».",
      chip: function (x) { return "Играет " + x + " · Перейти"; }, followChip: "Возобновить автопрокрутку", textSize: "Размер текста", reset: "Сброс",
      resetLabel: "Вернуть стандартный размер текста", auto: "Авто", autoLabel: "Прокручивать вместе с аудио", resume: "Готово продолжить · нажмите «Воспроизвести»",
      play: "Воспроизвести", pause: "Пауза", prev: "Предыдущая глава", next: "Следующая глава", back: "Назад", smaller: "Мельче",
      larger: "Крупнее", speed: "Скорость", seek: "Перемотка", jump: "К воспроизводимой главе",
      trLabel: "Перевод Библии", withAudio: "Текст и аудио", textOnly: "Только текст",
      noText: "Текст не загрузился. Проверьте соединение.", retry: "Повторить" },
    es: { end: "Fin de la Biblia", loading: "Cargando…", tapStart: "Toca reproducir para empezar",
      failStart: "El audio no empezó. Toca reproducir para intentarlo de nuevo.", failLoad: "El audio no cargó. Revisa tu conexión y toca reproducir.",
      chip: function (x) { return "Reproduciendo " + x + " · Ir allí"; }, followChip: "Reanudar desplazamiento automático", textSize: "Tamaño del texto", reset: "Restablecer",
      resetLabel: "Restablecer el tamaño estándar del texto", auto: "Auto", autoLabel: "Desplazar junto con el audio", resume: "Listo para continuar · toca reproducir",
      play: "Reproducir", pause: "Pausa", prev: "Capítulo anterior", next: "Capítulo siguiente", back: "Atrás", smaller: "Texto más pequeño",
      larger: "Texto más grande", speed: "Velocidad de reproducción", seek: "Buscar", jump: "Ir al capítulo que se está reproduciendo",
      trLabel: "Traducción", withAudio: "Texto y audio", textOnly: "Solo texto",
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

  function loadAudioHave() {
    try {
      if (!window.caches) return Promise.resolve();
      return caches.open(AUDIO_CACHE).then(function (c) { return c.keys(); }).then(function (ks) {
        for (var i = 0; i < ks.length; i++) audioHave[ks[i].url] = true;
      }).catch(function () {});
    } catch (e) { return Promise.resolve(); }
  }
  // give an audio element a chapter: from this device when it is saved here, otherwise from the internet
  function setSrc(el, b, c, after) {
    var u = audioUrlFor(tr, b, c), n = el._sq = (el._sq || 0) + 1;
    if (el._bu) { try { URL.revokeObjectURL(el._bu); } catch (e) {} el._bu = null; }
    if (!u || !audioHave[u] || !window.caches) { el.src = u; if (after) after(); return; }
    caches.open(AUDIO_CACHE).then(function (ca) { return ca.match(new Request(u)); })
      .then(function (r) { return r ? r.blob() : null; })
      .catch(function () { return null; })
      .then(function (bl) {
        if (el._sq !== n) return;
        if (bl) { el._bu = URL.createObjectURL(bl); el.src = el._bu; } else { delete audioHave[u]; el.src = u; }
        if (after) after();
      });
  }
  function dlEmit() { for (var i = 0; i < dlSubs.length; i++) { try { dlSubs[i](); } catch (e) {} } }
  function cacheStrict(name, key, body) {            // like cachePut, but says if it did not fit
    return caches.open(name).then(function (c) { return c.put(new Request(key), body); });
  }
  function haveText(id) {
    var out = {};
    if (!window.caches) return Promise.resolve(out);
    var re = new RegExp("bible/" + id + "\\.bbt\\?c=(\\d+)\\.(\\d+)$");
    return caches.open(CACHE_NAME).then(function (c) { return c.keys(); }).then(function (ks) {
      for (var i = 0; i < ks.length; i++) { var m = re.exec(ks[i].url); if (m) out[m[1] + "." + m[2]] = true; }
      return out;
    }).catch(function () { return out; });
  }
  function haveAudio(t) {
    var out = {};
    if (!window.caches || !t.audio) return Promise.resolve(out);
    return loadAudioHave().then(function () { return audioHave; });
  }
  // how much is saved, without needing the book index (for the little icons in the version list)
  function dlQuick(id) {
    var t = TR[id];
    return Promise.all([haveText(id), t && t.audio ? haveAudio(t) : Promise.resolve(null)]).then(function (r) {
      var tx = Object.keys(r[0]).length, au = null;
      if (r[1]) {
        var n = 0;
        for (var u in r[1]) if (u.indexOf(t.audio === "rst" ? DBS_BASE : KJV_BASE) === 0) n++;
        au = n;
      }
      return { text: tx, audio: au, total: CH_TOTAL };
    });
  }
  // full picture for one translation: every book, every chapter
  function dlStatus(id) {
    var t = TR[id];
    return getIndex(id).then(function (ix) {
      return Promise.all([haveText(id), t.audio ? haveAudio(t) : Promise.resolve(null)]).then(function (r) {
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
    var key = id + "|" + kind, j = dlJobs[key];
    if (j) { j.paused = true; j.running = false; delete dlJobs[key]; }
    if (!window.caches) return Promise.resolve();
    if (kind === "text") {
      var re = new RegExp("bible/" + id + "\\.bbt\\?c=");
      return caches.open(CACHE_NAME).then(function (c) {
        return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return re.test(k.url); }).map(function (k) { return c.delete(k); })); });
      }).then(function () { dlEmit(); });
    }
    var t = TR[id], base = t.audio === "rst" ? DBS_BASE : KJV_BASE;
    return caches.open(AUDIO_CACHE).then(function (c) {
      return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.url.indexOf(base) === 0; }).map(function (k) { delete audioHave[k.url]; return c.delete(k); })); });
    }).then(function () { dlEmit(); });
  }

  /* ---------- audio you saved yourself: pick the files (or a zip of them) and keep every chapter on this device ---------- */
  function normName(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ""); }
  var AUD_ALIAS = { songofsongs: 21, songofsolomon: 21, songofsoloman: 21, psalm: 18, revelations: 65 };
  // "43_John001.mp3", "John001.mp3", "62_1John001.mp3" ... -> { b, c } or null
  function parseAudioName(file) {
    var base = String(file).split("/").pop().replace(/\.[A-Za-z0-9]+$/, "");
    var m = /^(?:(\d{1,2})[_\- ])?(.*?)(\d+)?$/.exec(base);
    if (!m) return null;
    var num = m[1] ? parseInt(m[1], 10) - 1 : -1, nm2 = normName(m[2]), ch = m[3] ? parseInt(m[3], 10) : 0, b = -1, i;
    for (i = 0; i < KJV_AUD.length; i++) if (normName(KJV_AUD[i]) === nm2) { b = i; break; }
    if (b < 0 && AUD_ALIAS[nm2] != null) b = AUD_ALIAS[nm2];
    if (b < 0 && num >= 0 && num < 66) b = num;
    if (b < 0) return null;
    if (NO_NUM[b]) ch = 1;
    if (!ch) return null;
    return { b: b, c: ch };
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
  function zipEntries(f) {
    var tail = Math.min(f.size, 65557);
    return readSlice(f, f.size - tail, f.size).then(function (buf) {
      var v = new DataView(buf), p = -1, i;
      for (i = buf.byteLength - 22; i >= 0; i--) if (u32(v, i) === 0x06054b50) { p = i; break; }
      if (p < 0) throw new Error("This doesn't look like a zip file.");
      var n = u16(v, p + 10), size = u32(v, p + 12), off = u32(v, p + 16);
      if (n === 0xffff || size === 0xffffffff || off === 0xffffffff) throw new Error("This zip uses a format the app can't read.");
      return readSlice(f, off, off + size).then(function (cb) {
        var cv = new DataView(cb), out = [], q = 0, dec = new TextDecoder("utf-8");
        while (q + 46 <= cb.byteLength && u32(cv, q) === 0x02014b50) {
          var nl = u16(cv, q + 28), el = u16(cv, q + 30), cl = u16(cv, q + 32);
          out.push({
            name: dec.decode(new Uint8Array(cb, q + 46, nl)), method: u16(cv, q + 10),
            csize: u32(cv, q + 20), usize: u32(cv, q + 24), off: u32(cv, q + 42)
          });
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
      if (e.method === 0) return new Blob([data], { type: "audio/mpeg" });
      if (e.method !== 8) throw new Error("unsupported zip compression");
      if (typeof DecompressionStream === "undefined") throw new Error("This browser can't open compressed zips. Unpack the zip in Files and pick the MP3 files instead.");
      return new Response(data.stream().pipeThrough(new DecompressionStream("deflate-raw"))).blob();
    });
  }
  function importAudio(id, files, onProg) {
    var t = TR[id], res = { saved: 0, skipped: 0, unmatched: [], failed: 0, error: "" };
    if (!t || !t.audio || t.audio === "rst") return Promise.resolve(res);
    if (!window.caches) { res.error = "nocache"; return Promise.resolve(res); }
    files = Array.prototype.slice.call(files || []);
    var ix = { len: CH_COUNT.map(function (n) { return new Array(n); }) };
    return Promise.resolve().then(function () {
      var jobs = [];
      function addJob(label, bc, get) {
        if (!bc || !ix.len[bc.b] || bc.c < 1 || bc.c > ix.len[bc.b].length) { res.skipped++; if (res.unmatched.length < 8) res.unmatched.push(label); return; }
        jobs.push({ label: label, bc: bc, get: get });
      }
      return files.reduce(function (p, f) {
        return p.then(function () {
          if (/\.zip$/i.test(f.name) || f.type === "application/zip" || f.type === "application/x-zip-compressed") {
            if (onProg) onProg(0, 0, "Opening " + f.name);
            return stuck(zipEntries(f), 30000, "reading the zip's file list").then(function (es) {
              es.forEach(function (e) { if (/\.mp3$/i.test(e.name) && !/(^|\/)__MACOSX\//.test(e.name)) addJob(e.name.split("/").pop(), parseAudioName(e.name), function () { return zipBlob(f, e); }); });
            });
          }
          if (/\.(mp3|m4a|aac|wav)$/i.test(f.name) || /^audio\//.test(f.type)) { addJob(f.name, parseAudioName(f.name), function () { return Promise.resolve(f); }); return; }
          res.skipped++; if (res.unmatched.length < 8) res.unmatched.push(f.name);
        });
      }, Promise.resolve()).then(function () {
        var n = 0;
        return jobs.reduce(function (p, j) {
          return p.then(function () {
            if (onProg) onProg(n, jobs.length, label(j.bc.b, j.bc.c));
            return stuck(j.get(), 60000, "unpacking " + j.label).then(function (bl) {
              if (!bl || bl.size < 2000) throw new Error("empty");
              var url = audioUrlFor(t, j.bc.b, j.bc.c);
              return cacheStrict(AUDIO_CACHE, url, new Response(bl, { status: 200, headers: { "Content-Type": bl.type || "audio/mpeg" } })).then(function () { audioHave[url] = true; res.saved++; });
            }).catch(function (e) {
              var m = String(e && e.name || "") + String(e && e.message || "");
              if (/Quota/i.test(m)) { res.error = "full"; throw e; }
              res.failed++;
            }).then(function () { n++; if (n % 20 === 0) dlEmit(); });
          });
        }, Promise.resolve()).then(function () { if (onProg) onProg(jobs.length, jobs.length, ""); });
      });
    }).catch(function (e) { if (!res.error) res.error = (e && e.message) || "error"; }).then(function () { dlEmit(); return res; });
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
    if (!t || !t.audio) return "";
    if (t.audio === "rst") {
      var n = pad(b + 1, 2) + "_" + (b === 21 ? "SongofSongs" : NAMES.en[b].replace(/ /g, ""));   // the Russian host calls it Song of Songs
      return DBS_BASE + (b < 39 ? "OT" : "NT") + "_RUSS76/" + n + "/" + n + "_" + pad(c, 3) + ".mp3";
    }
    return KJV_BASE + pad(b + 1, 2) + "_" + KJV_AUD[b] + (NO_NUM[b] ? "" : pad(c, 3)) + ".mp3";
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
    if (playing) s.audio = { b: playing.b, c: playing.c, t: audioT, d: isFinite(A.duration) && A.duration > 0 ? A.duration : audioD, rw: rewound };
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
      window.scrollTo(0, 0);
      // reopening at the saved spot: go back to the same place inside the chapter
      if (resumeOff && resumeOff.b === b && resumeOff.c === c && resumeOff.off > 0) {
        var barB = $("#rd-bar").getBoundingClientRect().bottom;
        var top = sec.getBoundingClientRect().top;
        window.scrollTo(0, Math.max(0, top - barB + resumeOff.off));
        readOff = resumeOff.off;
      }
      resumeOff = null;
      markPlaying();
      updatePlayerIdle();
      persist();
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
      var dist = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
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
      var pr = A.play();
      if (pr && pr.catch) pr.catch(function (e) {
        setMsg(e && e.name === "NotAllowedError" ? T().tapStart : T().failStart);
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
    if (A.error) { var p = playing; playChapter(p.b, p.c); return; }
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
    var ended = playing;
    try { if (ended && typeof window.onBBChapterDone === "function") window.onBBChapterDone(tr && tr.id, ended.b, ended.c); } catch (e) {}
    var n = nextOf(ended);
    if (!n) { updatePP(); setMsg(T().end); return; }
    var cur = view === "reader" ? detectViewing() : null;
    var following = !!cur && same(cur, ended);
    var go = function () {
      playChapter(n.b, n.c);
      if (following && view === "reader" && !followOn) scrollToChapter(n, true);   // with Auto on, the follow loop glides there
      if (view === "reader") onScroll();
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
    if (isFinite(A.duration) && A.duration > 0) { audioD = A.duration; $("#rd-tdur").textContent = fmt(A.duration); if (playing) lenCache[lenKey(playing)] = A.duration; }
    if (pendingFrac !== null && isFinite(A.duration) && A.duration > 0) { pendingSeek = pendingFrac * A.duration; pendingFrac = null; }
    if (pendingSeek !== null && isFinite(A.duration) && A.duration > 0) {
      var t = Math.min(pendingSeek, Math.max(0, A.duration - 1));
      pendingSeek = null;
      try { A.currentTime = t; } catch (e) {}
    }
  }

  /* ---------- seek bar: the text scrolls along while you drag ---------- */
  var sband = null, bandTimer = 0;
  // scroll the text so the spot for audio-time t (or, if the length is not known yet, for a fraction of the chapter) sits in the middle, and show the soft band
  function seekScroll(t, frac, ch) {
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

  function lenKey(ch) { return tr.id + ":" + ch.b + ":" + ch.c; }
  function curDuration(ch) {
    ch = ch || playing;
    if (!ch) return 0;
    if (playing && same(ch, playing)) {
      var d = A.duration;
      if (isFinite(d) && d > 0) return d;
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
    function check() { var d = a.duration; if (isFinite(d) && d > 0) fin(d); }
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
    return window.scrollY + rc.top + rc.height / 2 + (lf - 0.5) * pt;
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
    if (!engineOn()) return;
    raf = requestAnimationFrame(frame);
    if (performance.now() < sysUntil || pendingFrac !== null) { fpos = null; return; }
    var y = null;
    try { y = estimateY(); } catch (e) { y = null; }   // never let a layout hiccup break reading
    if (y == null) return;
    var top = $("#rd-bar").getBoundingClientRect().bottom;
    var pl = $("#rd-player"), bottom = pl.hidden ? window.innerHeight : pl.getBoundingClientRect().top;
    var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var target = Math.max(0, Math.min(max, y - (top + bottom) / 2));
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
    if (!engineOn()) { updateChip(); return; }
    updateChip();
    if (!raf) { lastTs = performance.now(); fpos = null; raf = requestAnimationFrame(frame); }
  }
  function hold() {
    if (!isOpen || !followOn || held || !playing) return;
    if (performance.now() < sysUntil) return;
    held = true; updateChip();
  }
  function showFollow() { $("#rd-fol").setAttribute("aria-pressed", followOn ? "true" : "false"); }

  /* ---------- text size ---------- */
  function sizePct() { return Math.round(Math.pow(ZSTEP, zoom) * 100); }
  // keep=true: stay on the same line of the same chapter while the text grows or shrinks
  function applySize(keep) {
    var anchor = null;
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
    persist();
    A.pause();
    isOpen = false; view = "closed";
    openSeq++;
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
    if (o.play && tr.audio) playChapter(b, c);   // started right here, inside the tap, so the browser allows sound
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
      if (!playing) return;
      setMsg(T().failLoad);
      updatePP();
    });
    A.addEventListener("loadedmetadata", onMeta);
    A.addEventListener("durationchange", onMeta);
    A.addEventListener("timeupdate", function () {
      if (seeking || pendingSeek !== null) return;
      var d = A.duration;
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
        seekforward: function () { A.currentTime = Math.min(A.duration || 1e9, A.currentTime + 15); }
      };
      Object.keys(acts).forEach(function (k) { try { navigator.mediaSession.setActionHandler(k, acts[k]); } catch (e) {} });
    }

    $("#rd-chip").onclick = chipTapped;
    // on iPhone, touching the screen while it is still coasting only stops the coasting and gives no "click";
    // reacting to the touch itself makes the button work even then
    $("#rd-chip").addEventListener("touchstart", function (e) { e.preventDefault(); chipTapped(); }, { passive: false });

    document.addEventListener("touchmove", function (e) { if (e.target && e.target.closest && e.target.closest("#rd-body")) hold(); }, { passive: true });
    window.addEventListener("wheel", hold, { passive: true });
    window.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { if (!$("#rd-trmenu").hidden) closeTrMenu(); else close(false); return; }
      if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/.test(e.key) && !/INPUT|TEXTAREA|BUTTON/.test((e.target && e.target.tagName) || "")) hold();
    });
    window.addEventListener("resize", function () { pitch = 0; onScroll(); });
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

  loadAudioHave();
  tell("ready");

  window.BBReader = {
    dl: {
      importAudio: importAudio, parseAudioName: parseAudioName, quick: dlQuick, status: dlStatus, start: dlStart, pause: dlPause, resume: dlResume, remove: dlRemove,
      job: function (id, kind) { return dlJobs[id + "|" + kind] || null; },
      on: function (fn) { dlSubs.push(fn); }, off: function (fn) { var i = dlSubs.indexOf(fn); if (i >= 0) dlSubs.splice(i, 1); },
      supported: function () { return !!window.caches; }
    },
    open: open,
    close: function () { close(false); },
    saved: savedSpot,
    translations: function () { return ORDER.map(function (id) { return TR[id]; }); },
    isOpen: function () { return isOpen; },
    // used by the tests
    _t: { A: A, P: P, audioUrl: audioUrl, state: function () { return { tr: tr && tr.id, playing: playing, pendingSeek: pendingSeek, view: view, viewing: viewing, rendered: rendered.length }; }, psEnToRu: psEnToRu, psRuToEn: psRuToEn }
  };
})();
