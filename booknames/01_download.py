#!/usr/bin/env python3
"""Download chapter-1 recordings for all 66 books, KJV + Russian Synodal.
URL logic copied exactly from reader.js's audioUrlFor() / KJV_BASE / KJV_AUD / NO_NUM / DBS_BASE.
Re-run safe: skips files already downloaded.
"""
import os, sys, json, time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")

NAMES_EN = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel",
    "1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
    "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
    "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark",
    "Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
    "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews",
    "James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"]

KJV_BASE = "https://www.audiotreasure.com/content/KJV_AT/"
KJV_AUD = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1Samuel","2Samuel",
    "1Kings","2Kings","1Chronicles","2Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs",
    "Ecclesiastes","Song_of_Soloman","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
    "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark",
    "Luke","John","Acts","Romans","1Corinthians","2Corinthians","Galatians","Ephesians","Philippians",
    "Colossians","1Thessalonians","2Thessalonians","1Timothy","2Timothy","Titus","Philemon","Hebrews",
    "James","1Peter","2Peter","1John","2John","3John","Jude","Revelation"]
NO_NUM = {56: 1, 62: 1, 63: 1, 64: 1}
DBS_BASE = "https://dbs.org/cdn/audio/RUSS76_ISA_FB_N/"

assert len(NAMES_EN) == 66 and len(KJV_AUD) == 66

def pad(n, w):
    s = str(n)
    return "0" * (w - len(s)) + s if len(s) < w else s

def kjv_url(b):
    return KJV_BASE + pad(b + 1, 2) + "_" + KJV_AUD[b] + ("" if NO_NUM.get(b) else pad(1, 3)) + ".mp3"

def rst_url(b):
    n = pad(b + 1, 2) + "_" + ("SongofSongs" if b == 21 else NAMES_EN[b].replace(" ", ""))
    section = "OT" if b < 39 else "NT"
    return DBS_BASE + section + "_RUSS76/" + n + "/" + n + "_" + pad(1, 3) + ".mp3"

def safe_name(b):
    return pad(b + 1, 2) + "_" + NAMES_EN[b].replace(" ", "")

def fetch(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return True, "already have it", os.path.getsize(dest)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (BibleBridge booknames extraction)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(dest, "wb") as f:
            f.write(data)
        return True, "ok", len(data)
    except Exception as e:
        return False, str(e), 0

def main():
    results = {"kjv": [], "rst": []}
    for b in range(66):
        name = safe_name(b)

        ku = kjv_url(b)
        kdest = os.path.join(RAW, "kjv", name + ".mp3")
        ok, msg, size = fetch(ku, kdest)
        results["kjv"].append({"b": b, "name": NAMES_EN[b], "file": name, "url": ku, "ok": ok, "msg": msg, "bytes": size})
        print(f"KJV {name:20s} {'OK' if ok else 'FAIL'} {msg} ({size} bytes)")

        ru = rst_url(b)
        rdest = os.path.join(RAW, "rst", name + ".mp3")
        ok, msg, size = fetch(ru, rdest)
        results["rst"].append({"b": b, "name": NAMES_EN[b], "file": name, "url": ru, "ok": ok, "msg": msg, "bytes": size})
        print(f"RST {name:20s} {'OK' if ok else 'FAIL'} {msg} ({size} bytes)")

        time.sleep(0.05)

    with open(os.path.join(HERE, "download_log.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    kjv_fail = [r for r in results["kjv"] if not r["ok"]]
    rst_fail = [r for r in results["rst"] if not r["ok"]]
    print(f"\nKJV: {len(results['kjv'])-len(kjv_fail)}/66 ok, {len(kjv_fail)} failed")
    print(f"RST: {len(results['rst'])-len(rst_fail)}/66 ok, {len(rst_fail)} failed")
    if kjv_fail: print("KJV failures:", [r["name"] for r in kjv_fail])
    if rst_fail: print("RST failures:", [r["name"] for r in rst_fail])

if __name__ == "__main__":
    main()
