# Pyrovue video studio: playbook

This is the operating manual for the daily video run. Read it before producing anything. It holds what was
measured (costs, limits, what the tools refuse), the channel's look, the formats, and the checks a video has to pass
before it is scheduled. `PLAN.md` is the month's calendar and budget; `ledger.json` is the record of what was made,
what it cost and where it was scheduled.

## The job

Five finished vertical videos a day on Instagram, TikTok and YouTube Shorts for @pyrovue, from 16 November to
15 December 2026. Target: one million views across the three platforms. Week one (16 to 22 November) is an
experiment across formats; from then on the mix follows what the numbers say.

Pyrovue runs a GitHub or GitLab repository in an isolated cloud box and shows it running, with a terminal, an
editor, a map of the code and a guided tour. The trick every video can end on: put `pyrovue.com/` in front of any
GitHub link.

## What the tools refuse (checked 15 November 2026, check again before relying on it)

- **Unlimited generations** are refused from this connection: "unlimited generations are not available [from Claude
  Code]. They are available in: Claude chat, Claude Cowork, ChatGPT." Do not pass `use_unlim`.
- **Free generations** (3 Genjutsu, 5,000 Soul) are refused: "free generations can be spent from the ChatGPT
  Higgsfield connector only." Do not pass `use_free_gens`. The owner can spend them in the Higgsfield web UI.
- So every generation made here costs credits. The Ultra subscription and its credits end on **30 November**. All
  generating has to be done by then; December videos are assembled from the bank (`bank/manifest.json`) and from
  code-rendered scenes, which cost nothing.
- **X** is not connected to Metricool or vidIQ, and the Higgsfield tools here only publish to TikTok through a form
  the owner has to submit. No X posting until X is added to the pyrovue brand in Metricool.
- **vidIQ** posts cannot be cancelled or edited once scheduled, and its publish tool wants the owner to approve each
  draft. Schedule through **Metricool** (brand id `7946068`, timezone `America/New_York`), which takes a public media
  URL and lets a scheduled post be changed.
- **YouTube** refused uploads with `uploadLimitExceeded` when 8 to 10 went up in a day. Five a day has been fine.
- The bundled Chromium has no H.264. Footage inside a scene is an image sequence (`<img data-seq>`), or the scene is
  rendered transparent and laid over footage with `--base`.

## Costs (credits, measured)

| What | Model | Cost |
| --- | --- | --- |
| Image, 2K | `nano_banana_pro` | 2 |
| Image, 2K high | `gpt_image_2_6` | 2.75 |
| Image | `soul_2` | 0.12 |
| Video 5 s 720p | `grok_video_v15_lite` | 5 |
| Video 5 s 720p | `kling3_0_turbo` | 7.5 |
| Video 5 s 768p | `minimax_h3_max` | 12.5 |
| Video 5 s 720p | `kling_4_0_flash` | 15 |
| Video 5 s 720p, no audio | `seedance_2_0` | 22.5 |
| Video 5 s 720p, with speech | `seedance_2_5` | 35 (7 per second; 1080p is 16 per second) |
| Genjutsu, 18 s source | `hf_mult_motion_control` | 54 at 480p, 126 at 720p, 360 at 1080p |
| Music 20 s | `elevenlabs_music_v2_5` | 2.9 |
| Speech, one line | `seed_audio` | 0.3 |

Bake-off on one start frame (16 November): `kling3_0_turbo` matched `seedance_2_0` for identity and natural motion
at a third of the price, so it is the default for image-to-video. `grok_video_v15_lite` is usable for simple
motion but invented a thumbs-up. `seedance_2_5` is for a person speaking on camera and for the few hero shots.
Always call with `get_cost: true` first when a model or setting is not in this table.

Target average is 17 credits a video. A video over 60 credits needs a reason written in the ledger.

## The look (the "set theme")

Every video is recognisably the same channel:

- **Palette:** matte black `#020203` / `#181a1f`, cool white `#f3f5f9`, slate, ice blue `#bcd6ff` for one emphasised
  word. No yellow or orange, no purple-blue gradients, no glowing orbs. (`studio/lib/brand.css`)
- **Type:** Fraunces light italic for the wordmark and big editorial lines; Geist 800 for captions and hooks; Geist
  Mono for code and URLs. Sentence case. No emoji in on-screen text, no exclamation marks, no em dashes.
- **End card:** `endcard()` from `studio/lib/parts.js`, 1.6 to 2 seconds, on every video.
- **Cast:** two recurring people. Use their reference sheets as `image_references` every time so they stay the
  same people; change outfits and settings freely.
  - the man: media `edd1438a-4c56-4e89-9b10-bfbe4ca00497` (cropped dark hair with fade, stubble, hazel eyes)
  - the woman: media `95698770-f6a5-4e7d-9d5c-fb50dfc862fb` (long straight black hair, centre part, brown eyes)
- **Logo:** media `f74049de-ffcc-47c0-b444-2cd06d8672b7` (white mark on black),
  `0eaa26d8-0130-44a5-b7c6-403bf76c1576` (dark mark), `bfbba666-59ee-430c-9d8b-09aaefe776f4` (light mark). Pass it as
  an image reference whenever the mark has to appear in a generated image; say "the exact two-chevron logo mark
  from the reference image".
- **Real product footage** is in `footage/` (captured from pyrovue.com and the dev build). Use it whenever the
  product is shown. Never show an invented UI as if it were the product.

## Writing

The old videos were walls of animated text. These are pictures first.

- The hook is on screen on frame one, six words or fewer, and makes sense with the sound off. The first frame has
  motion or a face in it.
- One idea per video. A beat changes the picture; no beat holds longer than four seconds; nothing holds still
  longer than 1.5 seconds.
- At most six words per text card. Captions are the spoken words, two or three at a time.
- Write like a developer talking to another developer. Name the real thing: the repo, the error, the version
  number. No "seamless", "supercharge", "game-changer", "say goodbye to".
- The last line or frame echoes the first so the loop closes.
- Length: 7 to 20 seconds for visual and humour pieces, 20 to 45 for demos.
- Do not claim what the product does not do. No invented testimonials, numbers or user quotes.
- Keep readable text inside x 60 to 850 and y 230 to 1440 of the 1080 x 1920 frame; the platforms cover the rest.

Hook formulas that fit: cold-open demo, time collapse ("two hours of setup, eight seconds"), the replacement
("stop cloning repos"), head to head, wrong way and right way, before and after on screen, the receipt.

## Formats

Each video is tagged with one format in the ledger so results can be compared.

| Tag | What it is | Typical cost |
| --- | --- | --- |
| `aura` | Fast-cut brand edit on a reference rhythm (Genjutsu), cut to a track | 54 to 126 |
| `pov` | Cast skit told in reaction shots with on-screen lines, ends on the URL trick and real UI | 30 to 45 |
| `ugc` | Cast member talking to camera with native speech (`seedance_2_5`), cut with a real screen recording | 70 to 110 |
| `satisfying` | Macro or 3D "feel" piece with almost no text: the box opening, a repo assembling | 15 to 30 |
| `demo` | Real product footage: URL typed, box boots, app runs, with a clock | 0 to 5 |
| `trick` | 7 to 12 second loop of the URL trick alone | 0 to 3 |
| `thread` | Fake chat, PR comment or terminal exchange rendered in code | 0 to 3 |
| `race` | Split screen: clone and install against Pyrovue, with a timer | 0 to 10 |
| `repo` | "I ran [well-known repo] so you don't have to": needs real footage of that repo running | 0 to 10 |
| `explainer` | "How [repo] works in 30 seconds" on the code map and tour | 0 to 10 |
| `slides` | Photo slideshow ("five repos to run this weekend") | 5 to 15 |
| `film` | The launch film: one flagship piece built the Torqk way (music first, shared beat timeline, gates) | 300 to 400, once |
| `wild` | Trend remix or style experiment (Genjutsu Styles, a top model not yet tried) | up to 60 |

A day is five slots: one `pov` or `ugc`, one `satisfying`, one `demo` or `trick` or `race`, one `thread` or
`repo` or `explainer`, one `aura` or `wild` or `slides`. Do not repeat a concept; check the ledger.

## Making one

```bash
cd studio && npm ci                       # once per fresh container
python3 -m venv .venv && .venv/bin/pip install -q -r requirements.txt   # once, for words.py and beats.py
```

1. **Brief.** Format tag, hook, the beats (picture and words for each), the last frame, the audio, the caption.
2. **Music first** when the piece is cut to music: generate the track at the exact length
   (`elevenlabs_music_v2_5`, instrumental, no timecodes in the prompt), run `studio/beats.py` on it and put every
   cut and text hit on a beat.
3. **Start frames** with `nano_banana_pro` at 9:16 2K, cast sheet and logo as references. Look at each one before
   animating it; regenerate rather than animate a bad frame.
4. **Clips** with `kling3_0_turbo`, 5 seconds, 720p, 9:16, one action per clip, "No camera cut, no text" in the
   prompt. Batch them (`generate_video_batch`) and wait with `jobs_wait`.
5. **Scene.** Copy a folder in `studio/scenes/`. A scene is one HTML file that builds a paused GSAP timeline and
   calls `run(tl, duration)`. Use `hook()`, `captions()`, `urlTrick()` and `endcard()`. Never use CSS transitions,
   `setTimeout` or the clock: the renderer seeks frame by frame.
6. **Render.** `node studio/render.cjs scene/index.html --base footage.mp4 --audio track.mp3 --out comp.mp4`
   (footage and audio are optional; `--still 2.5` writes one frame to look at).
7. **Finish.** `studio/finish.sh comp.mp4 reels/2026-11-16-v01-aura 0.4` writes the mp4, a cover and a contact
   sheet, at 1080 x 1920, 30 fps, -14 LUFS.
8. **Check** (below). Fix and re-render until it passes.
9. **Commit and push** the reel, then **schedule** it and write the ledger entry.

## The check before scheduling

Look at the contact sheet and at single frames at the first frame, each text card and the end card.

- The first frame is not black, not blank, and has the hook on it.
- Every word on screen is spelled right and inside the safe area; nothing is clipped at the frame edge.
- Faces and hands are right in every clip used (count fingers, check eyes). Cut around a bad second or regenerate.
- The cast are the same two people as their sheets.
- No third-party logo, brand or readable real product is in shot.
- Pyrovue's mark is the right shape wherever it appears.
- Nothing holds still for more than 1.5 seconds; no black frames in the middle; the end card is there.
- Audio is present, not clipped, starts within the first quarter second and ends with the picture.
- 1080 x 1920, H.264, 30 fps, under 60 seconds, under 50 MB.

## Scheduling

Slots, Eastern time, every day: **08:42, 10:52, 13:12, 16:18, 19:07**. They follow Metricool's best-time data
(peaks at 10, 12 and 18) and keep two hours between posts. The old vidIQ queue still posts until 19 November at
10:00, 12:00, 18:00, 19:30 and 20:30; it cannot be cancelled.

One `createScheduledPost` call per video, with all three networks:

- `media`: `https://raw.githubusercontent.com/yusufbadar/videos/claude/adoring-cray-ejt8ay/reels/<file>.mp4`
  (the repository is public; the file must be pushed first).
- `providers`: instagram, tiktok, youtube. `instagramData.type` `REEL`; `youtubeData.type` `short`,
  `madeForKids` false, a title under 70 characters, category `SCIENCE_TECHNOLOGY`; `tiktokData.title`.
- Set the AI flags (`isAiGenerated`, `isAigc`, `isAiGeneratedContent`) to true on any video with generated people
  or realistic generated scenes. Code-rendered and screen-recorded videos are not flagged.
- Set `tiktokData.commercialContentOwnBrand` true: these promote the account's own product.
- Caption: first 125 characters carry the point, with a real name or number in them; then one line that says what
  Pyrovue is; then at most five hashtags. A question at the end only when it is a real one.

## Audio

- Scheduled uploads carry their own audio. Native trending sounds cannot be attached to TikTok or Shorts uploads.
- Instagram can take a native track through `instagramData.audioConfiguration.audioId` (a search term), on a
  business account linked to a Facebook Page. Try it on one `aura` or `satisfying` reel a day and keep the
  video's own sound at `videoVolume` 0 only when the picture does not depend on it.
- Otherwise bake in generated music and sound. Generated tracks are original, so nothing gets muted or claimed.
- The track on v01 was supplied by the owner from someone else's reel. It may be muted or claimed. Do not reuse
  a ripped track without the owner asking for it again.

## Learning loop

Every run, before making anything: pull views, watch time and shares for everything posted more than 24 hours ago
(Metricool analytics, vidIQ channel analytics for YouTube, `vidiq_instagram_owner_insights`), write the numbers
into the ledger, and rank formats by median views. From 23 November: three of the five daily slots go to the top
two formats, one to the third, one stays an experiment. A format with five posts and a median under half the
channel median is dropped.

## Helpers

A helper gets one video. Give it the brief, the media ids it needs, a credit cap, this file to read, and the
output path. It returns the finished file, the contact sheet path, the credits it spent and the caption. Look at
the frames yourself before scheduling; a helper's "looks good" is not a check.
