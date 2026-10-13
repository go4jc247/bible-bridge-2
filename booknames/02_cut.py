#!/usr/bin/env python3
"""Find the first natural pause after the spoken book-name intro in each chapter-1 recording,
cut from the start to just after that pause begins (short fade-out), save as NN_BookName.mp3.
Logs cut time, alternative pauses, and anomalies to cut_log.json for the review page.
"""
import os, sys, json, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
CLIPS = os.path.join(HERE, "clips")

NAMES_EN = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel",
    "1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
    "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
    "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark",
    "Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
    "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews",
    "James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"]

WINDOW = 45.0        # only look for pauses in the first N seconds
MIN_SPEECH = 0.8     # at least this much speech must precede the pause
MIN_SILENCE = 0.3    # the pause itself must be at least this long
FADE_DUR = 0.15      # fade-out length applied at the cut
CUT_INTO_PAUSE = 0.08  # cut this far into the silence (past silence_start), not right at the edge

def pad(n, w):
    s = str(n); return "0" * (w - len(s)) + s if len(s) < w else s

def safe_name(b):
    return pad(b + 1, 2) + "_" + NAMES_EN[b].replace(" ", "")

# try a few noise thresholds, loosest last; keep the first threshold that finds any qualifying pause
THRESHOLDS = ["-30dB", "-35dB", "-25dB", "-40dB"]

def detect_silences(path, noise):
    cmd = ["ffmpeg", "-i", path, "-af", f"silencedetect=noise={noise}:d={MIN_SILENCE}", "-f", "null", "-"]
    p = subprocess.run(cmd, capture_output=True, text=True)
    out = p.stderr
    starts = [float(m) for m in re.findall(r"silence_start:\s*([\-0-9.]+)", out)]
    ends_durs = re.findall(r"silence_end:\s*([\-0-9.]+)\s*\|\s*silence_duration:\s*([\-0-9.]+)", out)
    ends = [float(e) for e, d in ends_durs]
    durs = [float(d) for e, d in ends_durs]
    n = min(len(starts), len(ends), len(durs))
    return [{"start": starts[i], "end": ends[i], "dur": durs[i]} for i in range(n)]

def qualifying(silences):
    return [s for s in silences if s["start"] >= MIN_SPEECH and s["start"] < WINDOW and s["dur"] >= MIN_SILENCE]

def ffprobe_duration(path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrapper=1:nokey=1", path]
    p = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return float(p.stdout.strip())
    except Exception:
        return None

def cut_clip(src, dest, cut_at):
    fade_start = max(0.0, cut_at - FADE_DUR)
    cmd = ["ffmpeg", "-y", "-i", src, "-to", f"{cut_at:.3f}",
           "-af", f"afade=t=out:st={fade_start:.3f}:d={FADE_DUR}",
           "-c:a", "libmp3lame", "-q:a", "4", dest]
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.returncode == 0, p.stderr[-800:] if p.returncode != 0 else ""

def process(tr_key, tr_label):
    results = []
    raw_dir = os.path.join(RAW, tr_key)
    clip_dir = os.path.join(CLIPS, tr_key)
    os.makedirs(clip_dir, exist_ok=True)
    for b in range(66):
        name = safe_name(b)
        src = os.path.join(raw_dir, name + ".mp3")
        entry = {"translation": tr_label, "b": b, "book": NAMES_EN[b], "file": name,
                  "cut_at": None, "threshold_used": None, "alternatives": [], "flag": None,
                  "duration": None, "clip": None}
        if not os.path.exists(src):
            entry["flag"] = "source file missing"
            results.append(entry); print(f"{tr_label} {name}: MISSING SOURCE"); continue

        dur = ffprobe_duration(src)
        entry["duration"] = dur

        chosen = None; used_thr = None; all_q = []
        for thr in THRESHOLDS:
            sil = detect_silences(src, thr)
            q = qualifying(sil)
            if q:
                chosen = q[0]; used_thr = thr; all_q = q
                break
        if not chosen:
            entry["flag"] = f"no qualifying pause found in first {WINDOW:.0f}s (tried {', '.join(THRESHOLDS)})"
            results.append(entry); print(f"{tr_label} {name}: NO PAUSE FOUND"); continue

        entry["threshold_used"] = used_thr
        entry["alternatives"] = [{"start": round(s["start"],3), "dur": round(s["dur"],3)} for s in all_q[:6]]
        cut_at = chosen["start"] + CUT_INTO_PAUSE
        entry["cut_at"] = round(cut_at, 3)

        dest = os.path.join(clip_dir, name + ".mp3")
        ok, err = cut_clip(src, dest, cut_at)
        if ok:
            entry["clip"] = os.path.relpath(dest, HERE)
            print(f"{tr_label} {name}: cut at {cut_at:.2f}s (thr {used_thr}, {len(all_q)} candidate pause(s))")
        else:
            entry["flag"] = "ffmpeg cut failed: " + err
            print(f"{tr_label} {name}: CUT FAILED")
        results.append(entry)
    return results

def main():
    all_results = process("kjv", "KJV") + process("rst", "Russian Synodal")
    with open(os.path.join(HERE, "cut_log.json"), "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    flagged = [r for r in all_results if r["flag"]]
    print(f"\n{len(all_results)-len(flagged)}/{len(all_results)} clips cut cleanly. {len(flagged)} flagged:")
    for r in flagged:
        print(f"  {r['translation']} {r['book']}: {r['flag']}")

if __name__ == "__main__":
    main()
