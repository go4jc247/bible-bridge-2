#!/usr/bin/env python3
"""Build review.html from cut_log.json. Re-run anytime after re-cutting to refresh the page."""
import os, json

HERE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(HERE, "cut_log.json"), encoding="utf-8") as f:
    clips = json.load(f)

# stable order: KJV first (book order), then Russian Synodal (book order) -- already that order from 02_cut.py,
# but sort defensively in case of a partial re-run.
order = {"KJV": 0, "Russian Synodal": 1}
clips.sort(key=lambda c: (order.get(c["translation"], 9), c["b"]))

for i, c in enumerate(clips):
    c["id"] = i

DATA_JSON = json.dumps(clips, ensure_ascii=False)

HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Book-name cut review</title>
<style>
  :root{color-scheme:light dark;--bg:#f5f5f3;--card:#fff;--ink:#17202a;--muted:#6b7684;--line:#e2e2e0;
    --ok:#2e7d46;--bad:#b3261e;--accent:#2f5fae;}
  @media (prefers-color-scheme:dark){:root{--bg:#14171c;--card:#1d2127;--ink:#eef0f3;--muted:#9aa4b2;--line:#2b3038;}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  .wrap{max-width:560px;margin:0 auto;padding:16px 16px 48px}
  h1{font-size:18px;margin:4px 0 2px}
  .sub{color:var(--muted);font-size:13px;margin-bottom:14px}
  .progress{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:13px;color:var(--muted)}
  .bar{height:6px;background:var(--line);border-radius:3px;overflow:hidden;margin-bottom:16px}
  .bar>i{display:block;height:100%;background:var(--accent)}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin-bottom:14px}
  .tr{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
  .book{font-size:26px;font-weight:700;margin:2px 0 4px}
  .flagged{color:var(--bad);font-size:13px;margin-bottom:10px}
  audio{width:100%;margin-top:6px}
  .replayRow{display:flex;justify-content:flex-end;gap:16px;margin-top:2px}
  .replayBtn.on{color:var(--bad)}
  .replayBtn{border:0;background:transparent;color:var(--accent);font-size:13px;font-weight:600;cursor:pointer;padding:4px 0}
  .autoplayHint{font-size:12px;color:var(--bad);margin-top:4px}
  .meta{font-size:12px;color:var(--muted);margin-top:4px}
  .bigrow{display:flex;gap:10px;margin-top:16px}
  .bigbtn{flex:1;min-height:84px;border:0;border-radius:16px;color:#fff;font-size:20px;font-weight:800;cursor:pointer}
  .bigbtn.correct{background:var(--ok)}
  .bigbtn.wrong{background:var(--bad)}
  .bigbtn:active{opacity:.85}
  .secondary{display:flex;gap:8px;margin-top:10px}
  .btn{flex:1;min-height:40px;border-radius:10px;border:1.5px solid var(--line);background:transparent;
    color:var(--muted);font-size:13px;font-weight:600;cursor:pointer}
  textarea{width:100%;min-height:36px;margin-top:8px;border-radius:10px;border:1.5px solid var(--line);
    background:var(--bg);color:var(--ink);padding:8px;font:13px inherit;resize:vertical}
  .editbox{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}
  .editRow{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--muted);margin-bottom:8px}
  .editRow .cutval{color:var(--ink);font-weight:700}
  .linkbtn{border:0;background:transparent;color:var(--accent);font-size:12px;font-weight:600;cursor:pointer;padding:0}
  .msRow{display:flex;gap:4px;margin-bottom:6px}
  .msBtn{flex:1;min-height:34px;border-radius:8px;border:1.5px solid var(--line);background:transparent;
    color:var(--ink);font-size:10.5px;font-weight:700;cursor:pointer;padding:0 2px}
  .msBtn:active{opacity:.8}
  .list{margin-top:22px}
  .list h2{font-size:14px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
  .litem{display:flex;justify-content:space-between;gap:8px;padding:9px 4px;border-bottom:1px solid var(--line);
    font-size:14px;cursor:pointer}
  .litem .st{font-size:12px;padding:2px 8px;border-radius:8px;background:var(--line);color:var(--muted)}
  .litem .st.correct{background:var(--ok);color:#fff}
  .litem .st.wrong{background:var(--bad);color:#fff}
  .exportrow{display:flex;gap:8px;margin-top:18px}
  .exportrow button{flex:1;min-height:44px;border-radius:12px;border:1.5px solid var(--accent);background:transparent;
    color:var(--accent);font-weight:600;cursor:pointer}
  .hint{font-size:12px;color:var(--muted);margin-top:10px}
</style>
</head>
<body>
<div class="wrap">
  <h1>Book-name cut review</h1>
  <div class="sub">Each clip plays itself. One tap: Correct or Wrong, and it moves on. Laptop: C / W, or &larr;/&rarr; to move without marking.</div>

  <div class="progress"><span id="posTxt"></span><span id="markedTxt"></span></div>
  <div class="bar"><i id="barFill" style="width:0%"></i></div>

  <div class="card">
    <div class="tr" id="trTxt"></div>
    <div class="book" id="bookTxt"></div>
    <div id="flagTxt" class="flagged" hidden></div>

    <audio id="player"></audio>
    <div class="replayRow">
      <button class="replayBtn" id="speedBtn">1&times;</button>
      <button class="replayBtn" id="replayBtn">&#8635; Replay</button>
    </div>
    <div id="autoplayHint" class="autoplayHint" hidden>Tap Replay once &mdash; your browser blocked autoplay until you do.</div>
    <div class="meta" id="metaTxt"></div>

    <div class="bigrow">
      <button class="bigbtn correct" id="btnCorrect">&#10003; Correct</button>
      <button class="bigbtn wrong" id="btnWrong">&#10007; Wrong</button>
    </div>
    <div class="secondary">
      <button class="btn" id="prevBtn">&larr; Back</button>
      <button class="btn" id="btnAlt">Try next pause</button>
      <button class="btn" id="noteToggle">+ Note</button>
      <button class="btn" id="editToggle">Edit cut</button>
    </div>
    <textarea id="noteBox" placeholder="Optional note&hellip;" hidden></textarea>
    <div id="editBox" class="editbox" hidden>
      <div class="editRow">
        <span id="editCutTxt"></span>
        <button class="linkbtn" id="editReset" hidden>Reset to auto cut</button>
      </div>
      <div class="msRow" id="msMinusRow"></div>
      <div class="msRow" id="msPlusRow"></div>
    </div>
  </div>

  <div class="exportrow">
    <button id="expCsv">Export CSV</button>
    <button id="expJson">Export JSON</button>
  </div>
  <div class="hint">Marks save to this browser automatically and reload if you come back.</div>

  <div class="list" id="listBox"></div>
</div>

<script>
var CLIPS = __DATA__;
var LS_KEY = "bb_booknames_marks_v1";

function loadMarks(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }catch(e){ return {}; } }
function saveMarks(m){ try{ localStorage.setItem(LS_KEY, JSON.stringify(m)); }catch(e){} }
var marks = loadMarks();

var cur = 0;
var altIndex = {}; // clip id -> which alternative index is currently previewed (-1 = primary cut)

var RATE_KEY = "bb_booknames_rate_v1";
var rate = parseFloat(localStorage.getItem(RATE_KEY)) || 1;

var player = document.getElementById("player");
var speedBtn = document.getElementById("speedBtn");
var replayBtn = document.getElementById("replayBtn");
var autoplayHint = document.getElementById("autoplayHint");
var trTxt = document.getElementById("trTxt");
var bookTxt = document.getElementById("bookTxt");
var flagTxt = document.getElementById("flagTxt");
var metaTxt = document.getElementById("metaTxt");
var noteBox = document.getElementById("noteBox");
var noteToggle = document.getElementById("noteToggle");
var btnCorrect = document.getElementById("btnCorrect");
var btnWrong = document.getElementById("btnWrong");
var btnAlt = document.getElementById("btnAlt");
var posTxt = document.getElementById("posTxt");
var markedTxt = document.getElementById("markedTxt");
var barFill = document.getElementById("barFill");
var listBox = document.getElementById("listBox");
var editToggle = document.getElementById("editToggle");
var editBox = document.getElementById("editBox");
var editCutTxt = document.getElementById("editCutTxt");
var editReset = document.getElementById("editReset");
var msMinusRow = document.getElementById("msMinusRow");
var msPlusRow = document.getElementById("msPlusRow");
var MS_STEPS = [1, 5, 25, 100, 500, 1000];
var editActive = false;
var editStopAt = 0;

function markFor(id){ return marks[id] || {status:null, note:"", adjustedCutAt:null}; }
function baseCut(c){ return c.cut_at != null ? c.cut_at : (c.duration ? Math.min(5, c.duration/2) : 3); }
function currentCut(c){ var m = markFor(c.id); return m.adjustedCutAt != null ? m.adjustedCutAt : baseCut(c); }

function render(){
  var c = CLIPS[cur];
  trTxt.textContent = c.translation;
  bookTxt.textContent = (c.b+1) + ". " + c.book;
  if(c.flag){
    flagTxt.hidden = false;
    flagTxt.textContent = "Flagged: " + c.flag;
  } else {
    flagTxt.hidden = true;
  }
  altIndex[c.id] = -1; // always land on the main cut, not a leftover alt-preview position
  player.src = c.clip ? c.clip : "";
  player.currentTime = 0;
  player.playbackRate = rate;
  autoplayHint.hidden = true;
  var p = player.play();
  if(p && p.catch) p.catch(function(){ autoplayHint.hidden = false; });

  btnAlt.textContent = c.alternatives && c.alternatives.length
    ? "Try next pause (" + c.alternatives.length + " found)" : "No alt pauses";
  btnAlt.disabled = !(c.alternatives && c.alternatives.length);

  var m = markFor(c.id);
  updateMetaTxt();

  noteBox.value = m.note || "";
  noteBox.hidden = !m.note;
  noteToggle.textContent = m.note ? "Edit note" : "+ Note";

  editActive = false;
  editBox.hidden = true;
  renderEdit();

  posTxt.textContent = "Clip " + (cur+1) + " of " + CLIPS.length;
  var markedCount = Object.keys(marks).filter(function(k){return marks[k].status}).length;
  markedTxt.textContent = markedCount + " marked";
  barFill.style.width = Math.round((cur+1)/CLIPS.length*100) + "%";

  document.getElementById("prevBtn").disabled = cur === 0;

  renderList();
}

function renderList(){
  listBox.innerHTML = "";
  var h = document.createElement("h2"); h.textContent = "All clips"; listBox.appendChild(h);
  CLIPS.forEach(function(c, i){
    var m = markFor(c.id);
    var row = document.createElement("div");
    row.className = "litem";
    row.innerHTML = "<span>" + (i+1) + ". " + c.translation + " · " + c.book + "</span>" +
      "<span class='st" + (m.status ? " " + m.status : "") + "'>" + (m.status || (c.flag ? "flagged" : "unmarked")) + "</span>";
    row.onclick = function(){ cur = i; render(); window.scrollTo({top:0, behavior:"smooth"}); };
    listBox.appendChild(row);
  });
}

function go(delta){
  var n = cur + delta;
  if(n < 0) return;
  if(n >= CLIPS.length){ player.pause(); posTxt.textContent = "All " + CLIPS.length + " clips reviewed"; return; }
  cur = n; render();
  window.scrollTo({top:0, behavior:"smooth"});
}

function setMark(status){
  var c = CLIPS[cur];
  var m = markFor(c.id);
  m.status = status;
  marks[c.id] = m;
  saveMarks(marks);
  go(1); // one tap: mark it and move straight to the next clip
}

noteBox.addEventListener("change", function(){
  var c = CLIPS[cur];
  var m = markFor(c.id);
  m.note = noteBox.value;
  marks[c.id] = m;
  saveMarks(marks);
});

noteToggle.onclick = function(){ noteBox.hidden = !noteBox.hidden; if(!noteBox.hidden) noteBox.focus(); };

btnCorrect.onclick = function(){ setMark("correct"); };
btnWrong.onclick = function(){ setMark("wrong"); };

replayBtn.onclick = function(){
  if(editActive){ previewEditCut(); return; }
  var c = CLIPS[cur], ai = altIndex[c.id];
  if(ai != null && ai >= 0 && c.alternatives[ai]) player.currentTime = c.alternatives[ai].start;
  else player.currentTime = 0;
  player.playbackRate = rate;
  player.play();
  autoplayHint.hidden = true;
};

function updateMetaTxt(){
  var c = CLIPS[cur];
  var m = markFor(c.id);
  var adjusted = m.adjustedCutAt != null;
  var cutInfo = (c.cut_at != null || adjusted)
    ? ("cut at " + currentCut(c).toFixed(2) + "s" + (adjusted ? " (edited)" : ""))
    : "no cut (flagged)";
  metaTxt.textContent = cutInfo + (c.threshold_used ? " · threshold " + c.threshold_used : "") +
    (c.duration ? " · source " + c.duration.toFixed(1) + "s" : "");
}

function renderEdit(){
  var c = CLIPS[cur];
  var m = markFor(c.id);
  var cutNow = currentCut(c);
  var base = baseCut(c);
  var adjusted = m.adjustedCutAt != null;
  editCutTxt.innerHTML = "Cut at <span class='cutval'>" + cutNow.toFixed(3) + "s</span>" +
    (adjusted ? " (auto was " + base.toFixed(2) + "s)" : "");
  editReset.hidden = !adjusted;
  updateMetaTxt();
}

function nudgeCut(deltaMs){
  var c = CLIPS[cur];
  var next = Math.max(0, currentCut(c) + deltaMs / 1000);
  var m = markFor(c.id);
  m.adjustedCutAt = Math.round(next * 1000) / 1000;
  marks[c.id] = m;
  saveMarks(marks);
  renderEdit();
  previewEditCut();
}

function buildMsRow(row, sign){
  MS_STEPS.forEach(function(ms){
    var b = document.createElement("button");
    b.className = "msBtn";
    b.textContent = (sign < 0 ? "−" : "+") + (ms >= 1000 ? (ms/1000) + "s" : ms + "ms");
    b.onclick = function(){ nudgeCut(sign * ms); };
    row.appendChild(b);
  });
}
buildMsRow(msMinusRow, -1);
buildMsRow(msPlusRow, 1);

function previewEditCut(){
  var c = CLIPS[cur];
  var cutNow = currentCut(c);
  var trKey = c.translation === "KJV" ? "kjv" : "rst";
  var src = "raw/" + trKey + "/" + c.file + ".mp3";
  if(player.getAttribute("src") !== src) player.src = src;
  editStopAt = cutNow;
  var start = Math.max(0, cutNow - 1.0);
  var doPlay = function(){
    player.currentTime = start;
    player.playbackRate = rate;
    var p = player.play();
    if(p && p.catch) p.catch(function(){ autoplayHint.hidden = false; });
  };
  if(player.readyState >= 1) doPlay(); else player.addEventListener("loadedmetadata", doPlay, {once:true});
}

// a plain timeupdate listener only fires a few times a second, too coarse to stop
// right at the cut when nudges are as fine as 1ms -- poll on a short interval instead
// (requestAnimationFrame would be tighter, but it stalls if the tab isn't the foreground one)
setInterval(function(){
  if(editActive && !player.paused && player.currentTime >= editStopAt) player.pause();
}, 30);

editReset.onclick = function(){
  var c = CLIPS[cur];
  var m = markFor(c.id);
  m.adjustedCutAt = null;
  marks[c.id] = m;
  saveMarks(marks);
  renderEdit();
  previewEditCut();
};

editToggle.onclick = function(){
  editBox.hidden = !editBox.hidden;
  var c = CLIPS[cur];
  if(!editBox.hidden){
    editActive = true;
    renderEdit();
    previewEditCut();
  } else {
    editActive = false;
    player.pause();
    player.src = c.clip ? c.clip : "";
    player.currentTime = 0;
    player.playbackRate = rate;
  }
};

function setRate(r){
  rate = r;
  try{ localStorage.setItem(RATE_KEY, rate); }catch(e){}
  speedBtn.textContent = (rate===2?"2":"1") + "\\u00d7";
  speedBtn.classList.toggle("on", rate===2);
  player.playbackRate = rate;
}
speedBtn.onclick = function(){ setRate(rate===2?1:2); };
setRate(rate);

btnAlt.onclick = function(){
  var c = CLIPS[cur];
  if(!c.alternatives || !c.alternatives.length) return;
  var ai = altIndex[c.id] == null ? -1 : altIndex[c.id];
  ai = ai + 1;
  if(ai >= c.alternatives.length) ai = -1; // wrap back to the main cut
  altIndex[c.id] = ai;
  if(ai >= 0){
    player.src = "raw/" + (c.translation==="KJV"?"kjv":"rst") + "/" + c.file + ".mp3";
    btnAlt.textContent = "Pause " + (ai+1) + "/" + c.alternatives.length + " — tap for next, or main cut";
  } else {
    player.src = c.clip ? c.clip : "";
    btnAlt.textContent = "Try next pause (" + c.alternatives.length + " found)";
  }
  player.currentTime = 0;
  player.playbackRate = rate;
  var doPlay = function(){
    if(ai >= 0) player.currentTime = c.alternatives[ai].start;
    player.playbackRate = rate;
    player.play();
  };
  if(player.readyState >= 1) doPlay(); else player.addEventListener("loadedmetadata", doPlay, {once:true});
};

document.getElementById("prevBtn").onclick = function(){ go(-1); };

document.addEventListener("keydown", function(e){
  if(e.target === noteBox) return;
  if(e.key === "ArrowRight"){ e.preventDefault(); go(1); }
  else if(e.key === "ArrowLeft"){ e.preventDefault(); go(-1); }
  else if(e.key === " "){ e.preventDefault(); replayBtn.click(); }
  else if(e.key === "c" || e.key === "C"){ setMark("correct"); }
  else if(e.key === "w" || e.key === "W"){ setMark("wrong"); }
});

function toCSV(){
  var rows = [["id","translation","book_number","book","status","note","cut_at","adjusted_cut_at","threshold","flag","clip"]];
  CLIPS.forEach(function(c){
    var m = markFor(c.id);
    rows.push([c.id,c.translation,c.b+1,c.book,m.status||"",(m.note||"").replace(/\\n/g," "),
      c.cut_at==null?"":c.cut_at,m.adjustedCutAt==null?"":m.adjustedCutAt,c.threshold_used||"",c.flag||"",c.clip||""]);
  });
  return rows.map(function(r){
    return r.map(function(v){
      v = String(v);
      return /[",\\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v;
    }).join(",");
  }).join("\\n");
}

function download(filename, text, mime){
  var blob = new Blob([text], {type: mime});
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
}

document.getElementById("expCsv").onclick = function(){ download("booknames_marks.csv", toCSV(), "text/csv"); };
document.getElementById("expJson").onclick = function(){
  var out = CLIPS.map(function(c){
    var m = markFor(c.id);
    return {id:c.id, translation:c.translation, book_number:c.b+1, book:c.book, status:m.status||null,
      note:m.note||"", cut_at:c.cut_at, adjusted_cut_at:m.adjustedCutAt==null?null:m.adjustedCutAt,
      threshold_used:c.threshold_used, flag:c.flag, clip:c.clip};
  });
  download("booknames_marks.json", JSON.stringify(out, null, 2), "application/json");
};

render();
</script>
</body>
</html>
"""

HTML = HTML.replace("__DATA__", DATA_JSON)

with open(os.path.join(HERE, "review.html"), "w", encoding="utf-8") as f:
    f.write(HTML)

print("wrote review.html with", len(clips), "clips")
