# Product footage

Captured on 15 November 2026 with Playwright, frame-stepped at 30 fps. Trust the pixel sizes below, not the
`_1920x1080` in some filenames.

## From the live site (pyrovue.com, public landing page, nothing submitted)

| File | Size | Shows |
| --- | --- | --- |
| 01, 02 landing hero scroll | 1080x1920, 1920x1080 | hero, product window, repo wall; 14.5 s |
| 03, 04 typing a repo URL | 1080x1920, 1920x1080 | `github.com/drawdb-io/drawdb` typed into the box, the real repo card resolves; 7 s |
| 05, 06 pasting a repo URL | 1080x1920, 1920x1080 | the same as a paste; 5 s |
| 07, 08 product demo loop | 2560x1440, 1080x1080 | the landing page's own demo: terminal 0-7 s, preview 7-12, map 12-17, tour 17-23 |
| 09, 10 code map section | 2560x1440, 1080x1920 | the "Understand" section; 10 s |
| 11, 12 setup logs section | 2560x1440, 1080x1920 | the "Set up" section; 9 s |
| 24 code map of Pyrovue's own repo | 2560x1440, 1080x1920 | the real map, slow zoom and drag; 8 s |

## From a local dev build with fixture data

The real workspace UI, driven by the repository's own `/__dev` fixtures. The UI is real; the data is not.

| File | Size | Shows | What is not real |
| --- | --- | --- | --- |
| 20 setup to running | 2560x1440, 1080x1920 | clone, install, launch, running preview; 13.5 s | step timings are scripted and compressed |
| 21 tab tour | 2560x1440, 1080x1920 | Preview, Tour, Map, Files, Terminal; 15 s | the map is a synthetic 140-file graph |
| 22 guided tour | 2560x1440, 1080x1920 | the tour stepping through; 12.2 s | |
| 23 terminal | 2560x1440, 1080x1920 | `ls`, `node -v`, `npm run build`; 9.9 s | canned answers |
| 25 workspace map zoom | 2560x1440, 1080x1920 | Map tab alone, zoom and drag; 6 s | synthetic graph |

Rules for using it: never quote a time from clips 20 to 25 or present them as a named real repository. For a
code map that has to be real, use 24. The preview address `vite-template-react-9f3c.pyrovue.app` seen in 20 is
invented; do not zoom on it. No clip has a mouse cursor; add one in the scene when a click matters.

`stills/` holds 17 screenshots at 2x: s01 to s07 from the live site, s08 to s17 from the dev build.
