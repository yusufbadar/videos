#!/usr/bin/env node
// Renders an HTML scene to video, one frame at a time, so the result is
// identical on every run. The scene never uses wall-clock time: it exposes
// window.__seek(t) (lib/stage.js does this) and we screenshot each frame.
//
//   node studio/render.cjs scene.html --out out.mp4 [--duration 12] [--fps 30]
//        [--data data.json] [--base footage.mp4] [--audio track.wav]
//        [--width 1080 --height 1920] [--alpha] [--from 0 --to 3] [--still 2.5]
//
// --base   composite the scene (transparent background) over this footage
// --alpha  write a transparent ProRes 4444 .mov instead of an mp4
// --still  write one PNG at that time instead of a video (for checking a frame)

const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

function args() {
  const a = process.argv.slice(2);
  const o = { _: [] };
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) {
      const k = a[i].slice(2);
      const v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true;
      o[k] = v;
    } else o._.push(a[i]);
  }
  return o;
}

(async () => {
  const o = args();
  const scene = path.resolve(o._[0] || '');
  if (!fs.existsSync(scene)) throw new Error('scene not found: ' + scene);
  const width = +(o.width || 1080), height = +(o.height || 1920), fps = +(o.fps || 30);
  const transparent = !!(o.alpha || o.base);
  const data = o.data ? JSON.parse(fs.readFileSync(path.resolve(o.data), 'utf8')) : {};

  const browser = await chromium.launch({
    args: ['--allow-file-access-from-files', '--disable-web-security', '--force-color-profile=srgb',
      '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const problems = [];
  page.on('pageerror', (e) => problems.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => problems.push('failed: ' + r.url()));
  await page.addInitScript((d) => { window.DATA = d; window.__RENDER = true; }, data);
  await page.goto(pathToFileURL(scene).href, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.__seek === 'function', null, { timeout: 30000 });
  await page.evaluate(async () => { await document.fonts.ready; if (window.__ready) await window.__ready; });

  const sceneDuration = await page.evaluate(() => window.__duration || 0);
  const duration = +(o.duration || sceneDuration);
  if (!duration) throw new Error('no duration: pass --duration or set it in the scene');

  // Capture through the DevTools protocol: optimizeForSpeed makes PNG frames
  // (needed for transparency) several times faster than page.screenshot.
  const cdp = await page.context().newCDPSession(page);
  if (transparent) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  const shot = async (t) => {
    await page.evaluate((tt) => window.__seek(tt), t);
    const { data } = await cdp.send('Page.captureScreenshot', transparent
      ? { format: 'png', optimizeForSpeed: true }
      : { format: 'jpeg', quality: 96, optimizeForSpeed: true });
    return Buffer.from(data, 'base64');
  };

  if (o.still !== undefined) {
    const out = path.resolve(o.out || 'still.png');
    await page.evaluate((tt) => window.__seek(tt), +o.still);
    await page.screenshot({ path: out, type: 'png', omitBackground: transparent });
    await browser.close();
    if (problems.length) console.error(problems.join('\n'));
    console.log('wrote', out);
    return;
  }

  const from = +(o.from || 0), to = +(o.to || duration);
  const first = Math.round(from * fps), last = Math.round(to * fps);
  const out = path.resolve(o.out || 'out.mp4');
  const ff = ['-y', '-loglevel', 'error'];
  if (o.base) ff.push('-i', path.resolve(o.base));
  ff.push('-f', 'image2pipe', '-framerate', String(fps), '-c:v', transparent ? 'png' : 'mjpeg', '-i', 'pipe:0');
  if (o.audio) ff.push('-i', path.resolve(o.audio));
  const audioIndex = o.base ? 2 : 1;
  if (o.base) {
    ff.push('-filter_complex',
      `[0:v]fps=${fps},scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1[b];[b][1:v]overlay=0:0:format=auto,format=yuv420p[v]`,
      '-map', '[v]');
    if (o.audio) ff.push('-map', `${audioIndex}:a`); else ff.push('-map', '0:a?');
  } else {
    ff.push('-map', '0:v');
    if (o.audio) ff.push('-map', `${audioIndex}:a`);
  }
  if (o.alpha) ff.push('-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le');
  else ff.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart');
  if (o.audio || o.base) ff.push('-c:a', 'aac', '-b:a', '192k');
  ff.push('-t', String((last - first) / fps), out);

  const proc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => proc.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  const t0 = Date.now();
  for (let f = first; f < last; f++) {
    const buf = await shot(f / fps);
    if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
    if ((f - first) % 90 === 0) process.stderr.write(`\rframe ${f - first}/${last - first}`);
  }
  proc.stdin.end();
  await done;
  await browser.close();
  process.stderr.write(`\rrendered ${last - first} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
  if (problems.length) console.error([...new Set(problems)].join('\n'));
  console.log('wrote', out);
})().catch((e) => { console.error(e); process.exit(1); });
