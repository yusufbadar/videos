#!/usr/bin/env python3
"""Word timings for captions.

    python studio/words.py voice.wav > words.json            # transcribe
    python studio/words.py voice.wav --script "exact words"  # keep our spelling

With --script the timings come from the recording but the text is ours, so
product names and numbers are spelled the way the script spells them.
Output: [{"text": "...", "start": 0.12, "end": 0.40}, ...]
"""
import argparse, json, re, sys
import numpy as np
import librosa
from faster_whisper import WhisperModel


def main():
    p = argparse.ArgumentParser()
    p.add_argument("audio")
    p.add_argument("--script")
    p.add_argument("--model", default="small.en")
    a = p.parse_args()
    y, _ = librosa.load(a.audio, sr=16000, mono=True)
    model = WhisperModel(a.model, device="cpu", compute_type="int8")
    segs, _ = model.transcribe(y.astype(np.float32), word_timestamps=True, vad_filter=True,
                               initial_prompt=a.script[:200] if a.script else None)
    heard = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
             for s in segs for w in s.words if w.word.strip()]
    if not a.script:
        json.dump(heard, sys.stdout, indent=1)
        return
    ours = a.script.split()
    norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
    # Align our words to the heard words in order; unmatched words share the
    # gap between their matched neighbours.
    out, j = [], 0
    for w in ours:
        hit = None
        for k in range(j, min(j + 5, len(heard))):
            if norm(heard[k]["text"]) == norm(w) or norm(w).startswith(norm(heard[k]["text"])[:4] or "~"):
                hit = k
                break
        if hit is None:
            out.append({"text": w, "start": None, "end": None})
        else:
            out.append({"text": w, "start": heard[hit]["start"], "end": heard[hit]["end"]})
            j = hit + 1
    total = heard[-1]["end"] if heard else 0.0
    i = 0
    while i < len(out):
        if out[i]["start"] is None:
            k = i
            while k < len(out) and out[k]["start"] is None:
                k += 1
            lo = out[i - 1]["end"] if i else 0.0
            hi = out[k]["start"] if k < len(out) else total
            step = (hi - lo) / (k - i + 1) if hi > lo else 0.2
            for n in range(i, k):
                out[n]["start"] = round(lo + step * (n - i), 3)
                out[n]["end"] = round(lo + step * (n - i + 1), 3)
            i = k
        else:
            i += 1
    json.dump(out, sys.stdout, indent=1)


if __name__ == "__main__":
    main()
