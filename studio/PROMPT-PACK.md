# Prompt pack: spending the free and unlimited generations

The scheduled run cannot spend unlimited or free generations (Higgsfield refuses both from the connection it
uses). They work from the Higgsfield connector in Claude chat or Cowork, and from the Higgsfield web UI. This file
is what to paste there. Everything it produces lands in the same Higgsfield account, so the daily run can pick the
results up by job id.

## 1. The photo library (unlimited image models)

Open Claude chat or Cowork with the Higgsfield connector on and paste the block below. It asks for about 240
images on the unlimited models at 2K. Run it again with a different outfit list whenever you want more.

```text
Generate a reusable photo library for Pyrovue's short-form videos with the Higgsfield tools. Use my unlimited
generations for every image (use_unlim: true); if a call says a model or setting is not covered, switch to
another unlimited model at 2K rather than spending credits, and tell me. Put everything in a Higgsfield project
called "pyrovue bank" (create it if it does not exist).

Models, in rotation so I can compare them: nano_banana_pro (2k), seedream_v5_pro (2k), gpt_image_2_6 (2k, quality
high). Aspect ratio 9:16 unless stated. Submit in batches of 12 with generate_image_batch and wait with jobs_wait.

References (media ids already in my library, pass them as image_references):
- the man: edd1438a-4c56-4e89-9b10-bfbe4ca00497
- the woman: 95698770-f6a5-4e7d-9d5c-fb50dfc862fb
- the Pyrovue mark, white on black: f74049de-ffcc-47c0-b444-2cd06d8672b7

House style for every image: cinematic 35mm still, shallow depth of field, real skin texture, unretouched,
slight film grain, natural light sources in frame, subject's face in the upper-middle third with empty space
below for captions. No text, no logos, no brand names on any object, no yellow or orange lighting. When the
Pyrovue mark appears, it is "the exact two-chevron logo mark from the reference image".

Set A, the cast (each person x each outfit x each moment = 2 x 4 x 10 = 80 images). Always say "the same person
as in the reference sheet, same face and hair".
Outfits, man: oversized heather-grey hoodie with headphones round his neck; black crew-neck tee and silver chain;
olive overshirt over a white tee; navy puffer vest over a charcoal knit.
Outfits, woman: oversized navy quarter-zip; cream ribbed knit and gold hoops; black blazer over a white tee;
vintage band-style plain grey tee and round glasses.
Moments: confident, about to start typing; confused, squinting at the screen; face lit red by errors, in
disbelief; head on the desk at 3 AM; stunned, sitting bolt upright, lit clean white; laughing in relief; holding
a phone toward the camera to show the screen (screen blank white); looking over the shoulder at the camera with a
knowing smile; whispering a secret to the camera, hand beside the mouth; arms crossed, unimpressed.
Settings: rotate small apartment desk at night, bright co-working space, cafe window seat, train seat with a
laptop, couch with a laptop.

Set B, front-camera selfie frames for talking videos (2 people x 4 outfits x 5 places = 40 images): arm's
length phone framing, slightly above eye level, looking into the lens mid-sentence. Places: couch, kitchen
counter, parked car, office corridor, walking outdoors at dusk.

Set C, objects and hands (40 images): the matte black cube box with the mark on the lid, closed, half open with
white light leaking, open with a paper diorama of tiny browser windows; a black laptop lid with the glowing mark;
a single glowing key with the mark on a black keyboard; a phone on a desk showing only the mark; a hand sliding a
black card with the mark across a table; a wax seal with the mark; the mark as a neon sign in a dark window; the
mark stencilled in chalk on asphalt; ten variations of each of the first three.

Set D, places without people (40 images): developer desk at night with three monitors (screens dark); empty
open-plan office at dawn; server aisle in cool white light; rain on a cafe window with a laptop; a train
carriage at night; a bedroom desk with a single lamp; a whiteboard wall; a rooftop at blue hour with a laptop.
Five variations each.

Set E, style tests of the same scene (40 images): "the man at his desk at night, stunned, lit clean white"
redrawn as: hand-painted cel animation; knitted yarn world; rounded toy CGI; claymation; paper cut-out collage;
blueprint line drawing; 1990s anime; risograph print; isometric diorama; pixel art. Four variations each, two
with the man and two with the woman.

When everything is done, show me all of it with one show_generation_by_ids call and give me a plain list of
job ids grouped by set.
```

When it finishes, paste the list of job ids into the scheduled session (or just say "the bank is ready") and the
next run will download them into `bank/` and add them to `bank/manifest.json`.

## 2. The three free Genjutsu generations (web UI)

Free Genjutsu runs can only be started from higgsfield.ai/genjutsu with "Use free generations" switched on.
Three uses, in order of value:

1. **The aura edit at 720p.** Motion transfer. Reference video: `ref_aura.mp4` from your uploads. Characters,
   products or clothes: the ten "aura" stills (generated 15 November, the ink circle with the mark through the
   keyboard key). Prompt on, with the text below. Quality 720p. The version posted on 16 November was made at
   480p for 54 credits; a free 720p pass is sharper and can replace it in a later repost.

   ```text
   Recreate the driving video shot for shot with the same cuts, timing, camera moves, flashes, inversions and
   effects, but with the subjects from the reference images in place of the originals. Opening emblem: the
   ink-brush circle with the two-chevron logo. The tiny standing and running figure: the developer in a hoodie
   holding a glowing laptop. The hand holding a camera: the hands holding the matte black laptop with the glowing
   chevron logo. The technical drawings: the container-box blueprint and the chalkboard diagram. The streetlamp
   scene: the snowy streetlamp with three developers outlined in cool white neon. The grid of eyes: the grid of
   CRT monitors with the logo in the centre. The hand in the white frames: the hand pressing the glowing logo key.
   The flower with lightning: the neon chevron logo crackling with blue-white lightning. Final fireworks: white
   and ice-blue fireworks forming the chevron logo, fading to black. Palette is black, cool white, slate and ice
   blue only. Keep the chevron logo shape exact.
   ```

2. **A Style pass on the POV skit.** Styles tab, upload `reels/2026-11-16-v02-pov.mp4`, pick "Hand-painted cel
   animation". The result is the Tuesday `wild` slot.
3. **A Style pass on the unboxing.** Same, with `reels/2026-11-16-v04-unbox.mp4` and "Rounded toy CGI" or
   "Knitted yarn world".

Download each result and drop it in `inbox/` in this repository (or just tell the session the Higgsfield job is
done); the next run finishes and schedules it.

## 3. The 5,000 free Soul generations

Same route as section 1: in Claude chat or the web UI, Soul 2.0 at 9:16. Soul is the best of the image models for
phone-camera realism, so use it for Set B (selfie frames). From the scheduled run a Soul image costs 0.12
credits, so the run uses it freely on credits anyway.
