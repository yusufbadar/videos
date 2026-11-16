// Parts every video shares, so the channel reads as one thing: the mark, the
// end card, the address-bar trick and the hook line.
import { gsap, el, split, W, H, SAFE } from './stage.js';

export const MARK = (stroke = 'currentColor', sw = 8) => `
<svg class="mark" viewBox="15 13 70 68" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
  <path class="m2" d="M21.5,73.9 L50,52 L78.5,73.9"/>
  <path class="m1" d="M33.8,48 L50,20 L66.2,48"/>
</svg>`;

// End card. Covers the frame from `at` for `hold` seconds: the mark draws on,
// the wordmark rises, and the one line that matters sits underneath.
export function endcard(tl, at, { hold = 1.9, fade = 0.001, line = 'pyrovue.com/<i>github.com/any/repo</i>', sub = 'Run any GitHub repo. No setup.', light = false } = {}) {
  const c = el('div', 'endcard');
  c.style.cssText = `position:absolute;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;background:${light ? 'var(--paper)' : 'var(--black)'};color:${light ? 'var(--ink)' : 'var(--fg)'}`;
  c.innerHTML = `
    <div class="ec-mark" style="width:190px;height:185px;margin-bottom:54px">${MARK()}</div>
    <div class="ec-word wordmark" style="font-size:168px;line-height:1">pyrovue</div>
    <div class="ec-sub" style="font-family:var(--sans);font-weight:400;font-size:44px;margin-top:40px;color:${light ? 'var(--slate)' : 'var(--fg-2)'}">${sub}</div>
    <div class="ec-line mono" style="font-size:38px;margin-top:86px;padding:26px 36px;border-radius:18px;border:1.5px solid ${light ? 'rgba(24,26,31,.25)' : 'rgba(111,122,138,.5)'};color:${light ? 'var(--ink)' : 'var(--fg)'}">${line}</div>`;
  c.querySelectorAll('.ec-line i').forEach((i) => { i.style.fontStyle = 'normal'; i.style.color = light ? 'var(--fg-4)' : 'var(--fg-3)'; });
  const paths = c.querySelectorAll('.mark path');
  paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  tl.to(c, { opacity: 1, duration: fade, ease: 'none' }, at)
    .to(paths[0], { strokeDashoffset: 0, duration: 0.42, ease: 'pv' }, at + 0.04)
    .to(paths[1], { strokeDashoffset: 0, duration: 0.42, ease: 'pv' }, at + 0.14)
    .from(c.querySelector('.ec-mark'), { y: 46, duration: 0.6, ease: 'pv' }, at)
    .from(c.querySelector('.ec-word'), { y: 60, opacity: 0, duration: 0.55, ease: 'pv' }, at + 0.22)
    .from(c.querySelector('.ec-sub'), { y: 30, opacity: 0, duration: 0.5, ease: 'pv' }, at + 0.36)
    .from(c.querySelector('.ec-line'), { y: 30, opacity: 0, duration: 0.5, ease: 'pv' }, at + 0.48)
    .to(c.querySelector('.ec-mark'), { scale: 1.035, duration: hold, ease: 'none' }, at);
  return c;
}

// The address bar with the trick typed into it: "pyrovue.com/" lands in front
// of a GitHub URL. Returns the node; typing runs from `at` on the timeline.
export function urlTrick(tl, at, { repo = 'github.com/you/app', y = 860, size = 44, cps = 22, parent } = {}) {
  const bar = el('div', 'urlbar', '', parent);
  bar.style.cssText += `;position:absolute;left:50%;top:${y}px;transform:translateX(-50%);font-size:${size}px`;
  const pre = 'pyrovue.com/';
  bar.innerHTML = `<b class="pre"></b><span class="rest">${repo}</span><span class="caret" style="display:inline-block;width:3px;height:1.05em;background:var(--ink);vertical-align:-0.18em;margin-left:2px"></span>`;
  const b = bar.querySelector('.pre');
  // Shrink the type until the finished line fits inside the frame.
  b.textContent = pre;
  const max = W - 2 * SAFE.left;
  if (bar.offsetWidth > max) bar.style.fontSize = Math.floor(size * max / bar.offsetWidth) + 'px';
  b.textContent = '';
  b.style.display = 'none';
  const state = { n: 0 };
  tl.to(state, {
    n: pre.length, duration: pre.length / cps, ease: 'none',
    onUpdate: () => { const k = Math.round(state.n); b.textContent = pre.slice(0, k); b.style.display = k ? 'inline' : 'none'; },
  }, at);
  return bar;
}

// Hook line: big, at most six words, on screen from the first frame.
export function hook(tl, text, { at = 0, out = 2.2, y = 420, size = 104, serif = false, color } = {}) {
  const h = el('div', 'hook ' + (serif ? 'serif' : ''));
  h.style.cssText = `position:absolute;left:${SAFE.left + 20}px;width:${SAFE.right - SAFE.left - 20}px;top:${y}px;font-size:${size}px;line-height:1.02;font-weight:${serif ? 380 : 800};letter-spacing:-0.03em;z-index:60;text-shadow:0 4px 0 rgba(2,2,3,.8),0 0 40px rgba(2,2,3,.8);${color ? 'color:' + color : ''}`;
  h.textContent = text;
  const words = split(h);
  // A line that starts later stays hidden until its time. The opening line is
  // whole on the first frame; only a small settle moves.
  if (at > 0) { h.style.opacity = 0; tl.set(h, { opacity: 1 }, at); }
  tl.from(words, { y: 26, scale: 0.96, duration: 0.32, stagger: 0.035, ease: 'pvPop' }, at);
  if (out !== null) tl.to(h, { opacity: 0, y: -24, duration: 0.22, ease: 'pvIn' }, out);
  return h;
}

export { W, H, SAFE };
