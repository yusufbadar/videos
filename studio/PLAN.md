# The month: 16 November to 15 December 2026

150 videos, five a day, on Instagram, TikTok and YouTube Shorts. `PLAYBOOK.md` says how a video is made and
checked; this file says what gets made when, and what it may cost.

## The constraint that shapes everything

The Higgsfield Ultra subscription ends on 30 November. Unlimited and free generations are refused from this
connection, so every generation here is paid from one pool of credits that started at 2,957. Nothing can be
generated after 30 November. So the month has two halves:

- **16 to 30 November: generate.** Make each day's five videos and, on top of that, bank clips, stills and music
  for December. Every credit is spent by the evening of 30 November.
- **1 to 15 December: assemble.** 75 videos from the bank and from code-rendered scenes (real product footage,
  motion design, chat threads, slideshows), which cost nothing.

## Budget

| Line | Videos | Credits | Per video |
| --- | --- | --- | --- |
| Week one, 16 to 22 November (experiment) | 35 | 700 | 20 |
| 23 to 30 November | 40 | 600 | 15 |
| Bank for 1 to 15 December | 75 | 1,000 | 13 |
| Launch film | 1 | 300 | |
| Held back for retakes and one more aura edit | | 357 | |
| **Total** | **150** | **2,957** | **17 average** |

What a credit buys: a 5-second `kling3_0_turbo` clip is 7.5, a start frame 2, a music track 3. A 15-second
skit of four clips with four frames and a track is about 41. A video made of real product footage and code is 3.
The December bank is 100 clips (750), 100 stills (200) and 15 tracks (45).

The ledger carries the running balance. If the balance on a given evening is below
`2,957 - 2,957 x (days elapsed / 15) - 150`, the next day uses only `demo`, `trick`, `thread`, `race` and
`slides` until it is back on the line.

## Week one: the experiment

Each day covers five different formats so that by Sunday every format has at least three posts behind it.

| Day | 08:42 | 10:52 | 13:12 | 16:18 | 19:07 |
| --- | --- | --- | --- | --- | --- |
| Mon 16 | `aura` run any repo | `demo` run it before you clone it | `pov` the README said two minutes | `satisfying` every repo should open like this | `ugc` stop cloning repos |
| Tue 17 | `thread` "can you just run it and tell me if it works" | `race` clone and install against one link | `pov` the interviewer asks you to walk through the repo | `satisfying` a repo assembling into a glass box | `wild` one clip redrawn in a Genjutsu Style |
| Wed 18 | `trick` the eight-second loop | `explainer` a well-known repo's code map in 20 seconds | `pov` first day: "just get it running locally" | `satisfying` one key press, the app boots | `slides` five repos worth running this weekend |
| Thu 19 | `thread` the "works on my machine" PR comment | `demo` the guided tour | `ugc` the three tabs to open before trusting a repo | `aura` a velocity edit of the product itself, rendered in code | `wild` a top video model not yet tried, on the cast |
| Fri 20 | `film` the launch film | `demo` a terminal in the browser | `pov` Friday 16:59, "can you run my branch" | `satisfying` a paper city of repos | `thread` the stack trace that reads like a poem |
| Sat 21 | `slides` what is actually in node_modules | `trick` variant two | `pov` both cast: sharing one link instead of a setup doc | `wild` the unboxing in a second style | `demo` inviting someone into the same box |
| Sun 22 | `explainer` variant two | `race` variant two | `ugc` variant with the man | `satisfying` best performer, new subject | `aura` second Genjutsu edit if the first earned it |

Concepts are starting points. The run that makes them writes the actual hook and beats, and swaps a slot when
something timely is better (a repo trending that day, a format that just spiked).

## From 23 November: follow the numbers

On the evening of 22 November, rank formats by median views per post across the three platforms, using posts
that are at least 24 hours old. Then, each day:

- three slots to the two best formats,
- one slot to the third,
- one slot stays an experiment (a new format, a new model, a new style).

Re-rank every Sunday. Drop a format with five posts and a median under half the channel median. When one video
passes ten times the channel median, make three variations of it within 48 hours: same structure, new subject.

## The bank (by 30 November)

`bank/manifest.json` lists every clip, still and track with its Higgsfield URL, its local file, what it shows and
which videos have used it. Bank what December will need whatever wins:

- Cast reaction shots, both people, three outfits each: confident, confused, despair, stunned, laughing, typing,
  looking at phone, turning to camera. Five seconds each.
- Hands and objects: the box, keyboard, laptop lid with the mark, phone with the URL, coffee, a whiteboard.
- Environments without people: desk at night, office at dawn, server room, train, cafe.
- Stills of all of the above for slideshows and covers.
- Fifteen instrumental tracks across four moods (sneaky comedy, clean product, tense build, warm resolve),
  12 to 20 seconds each, with their beat grids.
- Download every file into the repository under `bank/` as it is made; Higgsfield links may not outlive the
  subscription.

## What a million views needs

150 videos on three platforms is 450 posts. A million views is an average of about 2,200 a post. A new account
with a few dozen posts usually sees a few hundred views on most of them, so the target is not reached by the
average post: it is reached if a handful break out. The plan is built for that: many different swings in week one,
then concentration on whatever shows signal, then fast variations of anything that spikes. It cannot be promised.
The ledger shows the running total against the line (33,000 views a day) so the gap is always visible.

## Things only the owner can do

- Spend the free and unlimited generations (web UI, or the Higgsfield connector in Claude chat or Cowork).
  `studio/PROMPT-PACK.md` is a ready set of prompts for the photo library.
- Add X to the pyrovue brand in Metricool so the schedule can include it.
- Give a Pyrovue login or record boxes of well-known repositories running, which unlocks the `repo` and
  `explainer` formats with real footage of those repositories.
- Link the Instagram account to a Facebook Page if it is not already, which is what native Instagram audio needs.
