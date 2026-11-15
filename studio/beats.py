#!/usr/bin/env python3
"""Beat grid for cutting to music.

    python studio/beats.py track.mp3 > beats.json

Output: {"tempo": 99.4, "duration": 17.8, "beats": [...], "downbeats": [...],
         "hits": [...]}  (seconds). "hits" are the loudest onsets, for accents.
"""
import json, sys
import numpy as np
import librosa

y, sr = librosa.load(sys.argv[1], sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, hop_length=512, units="time")
env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=512)
on = librosa.onset.onset_detect(onset_envelope=env, sr=sr, hop_length=512, units="frames")
strength = env[on] if len(on) else np.array([])
keep = on[strength >= np.percentile(strength, 75)] if len(on) else on
json.dump({
    "tempo": round(float(np.atleast_1d(tempo)[0]), 2),
    "duration": round(len(y) / sr, 3),
    "beats": [round(float(b), 3) for b in beats],
    "downbeats": [round(float(b), 3) for b in beats[::4]],
    "hits": [round(float(t), 3) for t in librosa.frames_to_time(keep, sr=sr, hop_length=512)],
}, sys.stdout, indent=1)
