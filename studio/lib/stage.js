// Shared runtime for every scene. A scene builds one paused GSAP timeline and
// hands it to Stage.run(); the renderer then seeks it frame by frame. Nothing
// here may read the wall clock, or two renders of the same scene would differ.
import { gsap } from '../node_modules/gsap/index.js';
import { CustomEase } from '../node_modules/gsap/CustomEase.js';

gsap.registerPlugin(CustomEase);
gsap.ticker.lagSmoothing(0);

// One signature curve for most moves (expo out), a snappier one for hits, and a
// soft overshoot for things that land.
CustomEase.create('pv', '0.16, 1, 0.3, 1');
CustomEase.create('pvIn', '0.7, 0, 0.84, 0');
CustomEase.create('pvPop', 'M0,0 C0.2,0 0.2,1.18 0.55,1.04 0.75,0.98 0.85,1 1,1');

export { gsap };
export const W = 1080, H = 1920;
// Platform UI covers the top ~230px, the bottom ~480px and the right ~230px
// column of a 1080x1920 frame. Text that must be read stays inside this box.
export const SAFE = { top: 230, bottom: 1440, left: 60, right: 850 };

const hooks = [];
export function onSeek(fn) { hooks.push(fn); }

// Deterministic pseudo-random, so grain and jitter repeat exactly.
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function el(tag, cls, html, parent) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  (parent || document.getElementById('stage')).appendChild(n);
  return n;
}

// Splits text into word spans (and optionally characters) for staggered moves.
export function split(node, { chars = false } = {}) {
  const words = node.textContent.trim().split(/\s+/);
  node.textContent = '';
  const out = [];
  words.forEach((w, i) => {
    const ws = document.createElement('span');
    ws.className = 'w';
    ws.style.display = 'inline-block';
    ws.style.whiteSpace = 'pre';
    if (chars) {
      [...w].forEach((c) => {
        const cs = document.createElement('span');
        cs.className = 'c';
        cs.style.display = 'inline-block';
        cs.textContent = c;
        ws.appendChild(cs);
        out.push(cs);
      });
    } else {
      ws.textContent = w;
      out.push(ws);
    }
    node.appendChild(ws);
    if (i < words.length - 1) node.appendChild(document.createTextNode(' '));
  });
  return out;
}

// Image sequences stand in for <video>: the bundled Chromium has no H.264.
// <img data-seq="frames/f_%04d.jpg" data-fps="30" data-start="1.2" data-count="90">
function seekSequences(t) {
  document.querySelectorAll('img[data-seq]').forEach((img) => {
    const fps = +(img.dataset.fps || 30), start = +(img.dataset.start || 0), count = +(img.dataset.count || 1);
    const loop = img.dataset.loop !== undefined;
    let i = Math.floor((t - start) * fps * +(img.dataset.rate || 1));
    i = loop ? ((i % count) + count) % count : Math.max(0, Math.min(count - 1, i));
    const src = img.dataset.seq.replace(/%0(\d)d/, (_, n) => String(i + 1).padStart(+n, '0'));
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
  });
}

async function settle() {
  const imgs = [...document.images].filter((i) => !i.complete);
  await Promise.all(imgs.map((i) => new Promise((r) => { i.onload = i.onerror = r; })));
  await Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
}

export function run(tl, duration) {
  tl.pause(0);
  window.__duration = duration || tl.duration();
  window.__seek = async (t) => {
    tl.seek(t, false);
    seekSequences(t);
    for (const h of hooks) await h(t);
    await settle();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  };
  // Opened in a normal browser (not the renderer): play in real time with
  // ?t=3.2 to hold on a frame, for eyeballing a scene while writing it.
  if (!window.__RENDER) {
    const q = new URLSearchParams(location.search);
    if (q.has('t')) window.__seek(+q.get('t'));
    else {
      const t0 = performance.now();
      const tick = () => { window.__seek(((performance.now() - t0) / 1000) % window.__duration); requestAnimationFrame(tick); };
      tick();
    }
  }
}

// Word-by-word captions. words: [{text, start, end}] in seconds.
// Groups words into short lines; the spoken word is emphasised as it lands.
export function captions(words, opts = {}) {
  const { maxWords = 3, maxChars = 16, y = 1180, size = 84, emphasis = [], cls = '' } = opts;
  const groups = [];
  let cur = [];
  const flush = () => { if (cur.length) { groups.push(cur); cur = []; } };
  words.forEach((w, i) => {
    const len = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    const gap = cur.length ? w.start - cur[cur.length - 1].end : 0;
    if (cur.length >= maxWords || len > maxChars || gap > 0.45) flush();
    cur.push(w);
    if (/[.!?]$/.test(w.text) || i === words.length - 1) flush();
  });
  const layer = el('div', 'caps ' + cls);
  layer.style.cssText = `position:absolute;left:${SAFE.left}px;width:${W - SAFE.left * 2}px;top:${y}px;text-align:center;font-size:${size}px;z-index:50`;
  const nodes = groups.map((g) => {
    const line = el('div', 'cap-line', '', layer);
    line.style.cssText = 'position:absolute;left:0;right:0;top:0;opacity:0';
    const spans = g.map((w) => {
      const s = el('span', 'cap-word', w.text, line);
      if (emphasis.some((e) => w.text.toLowerCase().replace(/[^a-z0-9]/g, '') === e.toLowerCase())) s.classList.add('em');
      line.appendChild(document.createTextNode(' '));
      return s;
    });
    return { g, line, spans, start: g[0].start, end: g[g.length - 1].end };
  });
  onSeek((t) => {
    nodes.forEach((n, i) => {
      const next = nodes[i + 1];
      const until = next ? Math.min(next.start, n.end + 0.6) : n.end + 0.5;
      const on = t >= n.start - 0.04 && t < until;
      n.line.style.opacity = on ? 1 : 0;
      if (!on) return;
      const k = Math.min(1, (t - (n.start - 0.04)) / 0.12);
      const e = 1 - Math.pow(1 - k, 3);
      n.line.style.transform = `translateY(${(1 - e) * 18}px) scale(${0.94 + 0.06 * e})`;
      n.spans.forEach((s, j) => {
        const w = n.g[j];
        s.classList.toggle('said', t >= w.start - 0.02);
        s.classList.toggle('now', t >= w.start - 0.02 && t < w.end + 0.08);
      });
    });
  });
  return layer;
}

export const Stage = { run, captions, split, el, onSeek, rng, gsap, W, H, SAFE };
export default Stage;
