(() => {
const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const W = 1480, H = 360, WALL_BASE = 280, FEET = 312;
const DOOR_X = 40, DOOR_W = 36, DOOR_H = 70, DOOR_Y = WALL_BASE - DOOR_H;
const SPR_FOOT = 61, SPR_CX = 34, START_X = 140;

const EXHIBITS = [
  { id: 'paper', x: 480, lines: ['SLATE TILE', 'RE-ID'], sub: 'DEEP FEATURE MATCHING', panel: 'p-paper', dir: 'Slate tiles · deep feature matching', kind: 'Paper' },
  { id: 'thesis', x: 680, lines: ['CHEST X-RAY', 'BIAS'], sub: 'ADVERSARIAL DEEP LEARNING', panel: 'p-thesis', dir: 'Chest X-ray bias · adversarial DL', kind: 'Thesis' },
  { id: 'otsu', x: 880, lines: ['OTSU &', 'K-MEANS'], sub: 'C++ · THRESHOLDING', panel: 'p-threshold', method: 'otsu', dir: 'Otsu & k-means', kind: 'Live demo' },
  { id: 'line', x: 1080, lines: ['BRIGHT-LINE', 'FIT'], sub: 'C++ · REGRESSION', panel: 'p-line', dir: 'Bright-line fit', kind: 'Live demo' },
  { id: 'unet', x: 1280, lines: ['BRAIN TUMOUR', 'SEGMENTATION'], sub: 'C++ · U-NET', panel: 'p-unet', dir: 'Brain tumour U-Net', kind: 'C++' },
];

/* ---------- assets ---------- */
const SRC = {
  idle: '../assets/char_idle.png?v=10', front: '../assets/char_front.png?v=10', back: '../assets/char_back.png?v=10',
  walk0: '../assets/char_walk_0.png?v=10', walk1: '../assets/char_walk_1.png?v=10', walk2: '../assets/char_walk_2.png?v=10',
  walk3: '../assets/char_walk_3.png?v=10', walk4: '../assets/char_walk_4.png?v=10', walk5: '../assets/char_walk_5.png?v=10',
  doorFrame: '../assets/door_frame.png', doorPanel: '../assets/door_panel.png', plant: '../assets/plant.png', bench: '../assets/bench.png',
  car: 'img/car_view.png', match: 'img/matching_art.png', diffuse: 'img/diffuse.png', brain: '../mdr/samples/s0.png', pca: 'img/pca_art.png',
};
const IMG = {};
const loadAll = () => Promise.all(Object.entries(SRC).map(([k, src]) => new Promise(res => {
  const im = new Image(); im.onload = () => { IMG[k] = im; res(); }; im.onerror = res; im.src = src;
})));
let HIST = null;
const pixelsOf = im => { const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d'); g.drawImage(im, 0, 0); return g.getImageData(0, 0, c.width, c.height); };
let CAR = null, DIFF = null, LINE0 = null;

/* ---------- exhibit art ---------- */
function thumb(source, w, h, map, crop) {
  const big = document.createElement('canvas'); big.width = source.width; big.height = source.height;
  const bg = big.getContext('2d');
  if (source instanceof ImageData) bg.putImageData(source, 0, 0); else bg.drawImage(source, 0, 0);
  if (map) { const d = bg.getImageData(0, 0, big.width, big.height); map(d.data); bg.putImageData(d, 0, 0); }
  const t = document.createElement('canvas'); t.width = w; t.height = h;
  const g = t.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  if (crop) g.drawImage(big, crop[0], crop[1], crop[2], crop[3], 0, 0, w, h);
  else {
    const s = Math.max(w / big.width, h / big.height), sw = w / s, sh = h / s;
    g.drawImage(big, (big.width - sw) / 2, (big.height - sh) / 2, sw, sh, 0, 0, w, h);
  }
  return t;
}
const gain = k => d => { for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k); } };
const CAR_CROP = [30, 268, 487, 266];
// Max-pool downsample so thin bright strips survive at frame size.
function maxThumb(src, w, h, crop, keep, colorFor) {
  const [cx, cy, cw, ch] = crop, d = src.data, W0 = src.width;
  const t = document.createElement('canvas'); t.width = w; t.height = h;
  const g = t.getContext('2d'), out = g.createImageData(w, h), o = out.data;
  for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++) {
    let best = -1, bi = -1;
    const x0 = cx + Math.floor(tx * cw / w), x1 = cx + Math.floor((tx + 1) * cw / w), y0 = cy + Math.floor(ty * ch / h), y1 = cy + Math.floor((ty + 1) * ch / h);
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const i = (y * W0 + x) * 4; if (keep(d, i) && d[i] > best) { best = d[i]; bi = i; } }
    const c = colorFor(d, bi), j = (ty * w + tx) * 4;
    o[j] = c[0]; o[j + 1] = c[1]; o[j + 2] = c[2]; o[j + 3] = 255;
  }
  g.putImageData(out, 0, 0);
  return t;
}
function buildArt() {
  const otsuT = Vision.otsu(HIST.red).threshold;
  return {
    otsu: maxThumb(CAR, 68, 40, CAR_CROP, (d, i) => d[i] >= otsuT,
      (d, i) => i < 0 ? [6, 6, 8] : [Math.min(255, d[i] * 2.4), Math.min(255, d[i + 1] * 2.4), Math.min(255, d[i + 2] * 2.4)]),
    line: (() => {
      const c = document.createElement('canvas'); c.width = DIFF.width; c.height = DIFF.height;
      const g = c.getContext('2d'); g.putImageData(DIFF, 0, 0);
      g.fillStyle = '#ff4d40'; for (const [x, y] of LINE0.kept) if (x % 3 === 0) g.fillRect(x - 3, y - 3, 7, 7);
      g.strokeStyle = '#ffffff'; g.lineWidth = 9; g.beginPath(); g.moveTo(0, LINE0.intercept); g.lineTo(c.width, LINE0.slope * c.width + LINE0.intercept); g.stroke();
      return thumb(c, 64, 48, gain(1.25));
    })(),
    paper: IMG.match,
    thesis: IMG.pca,
    unet: thumb(IMG.brain, 48, 48, d => { for (let i = 0; i < d.length; i += 4) { const v = Math.min(1, d[i] / 255 * 1.5); d[i] = 191 * v; d[i + 1] = 238 * v; d[i + 2] = 255 * v; } }),
  };
}

/* ---------- world ---------- */
const world = document.createElement('canvas'); world.width = W; world.height = H;
const ART_CY = 148;
function paint(art) {
  const g = world.getContext('2d'); g.imageSmoothingEnabled = false;
  const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const dither = (x0, y0, w, h, c, step = 4) => { g.fillStyle = c; for (let y = y0; y < y0 + h; y += 2) for (let x = x0 + ((y >> 1) & 1) * (step >> 1); x < x0 + w; x += step) g.fillRect(x, y, 1, 1); };
  // ceiling + track
  R(0, 0, W, 62, '#f1eee6');
  for (let x = 0; x < W; x += 80) R(x, 0, 1, 62, '#e7e3d9');
  R(0, 48, W, 3, '#3a332b'); R(0, 51, W, 1, '#5c5246');
  R(0, 62, W, 2, '#d3cec2'); R(0, 64, W, 2, '#f7f5ef');
  // wall + wainscot
  R(0, 66, W, 170, '#ebe6da'); R(0, 66, W, 10, '#f0ece2');
  R(0, 228, W, 4, '#2f463a'); R(0, 232, W, 40, '#3f5a4a'); dither(0, 232, W, 40, '#3a5444', 6);
  for (let x = 30; x < W; x += 120) { R(x, 238, 90, 1, '#4e6d5a'); R(x, 238, 1, 28, '#4e6d5a'); R(x, 266, 90, 1, '#2f463a'); R(x + 89, 238, 1, 29, '#2f463a'); }
  R(0, 272, W, 8, '#2b2620'); R(0, 272, W, 1, '#4a4136');
  // wood floor
  R(0, WALL_BASE, W, H - WALL_BASE, '#6e5136');
  for (let y = WALL_BASE; y < H; y += 8) {
    R(0, y, W, 1, '#5f4630'); R(0, y + 1, W, 1, '#7b5c3e');
    const off = ((y - WALL_BASE) / 8 % 3) * 47;
    for (let x = off; x < W; x += 141) R(x, y, 1, 8, '#5a422d');
  }
  R(0, WALL_BASE, W, 3, '#4a3624');
  // corridor ends
  R(0, 66, 12, 214, '#dfd9cb'); R(W - 12, 66, 12, 214, '#dfd9cb');
  // exit door
  R(DOOR_X - 2, WALL_BASE, DOOR_W + 4, 2, '#3f2e1f');
  drawDoor(g, 0);
  // spotlights + exhibits
  for (const ex of EXHIBITS) {
    const x = ex.x;
    R(x - 5, 51, 10, 6, '#2b2620'); R(x - 3, 57, 6, 3, '#4a4136'); R(x - 2, 60, 4, 1, '#fff7d6');
    g.fillStyle = 'rgba(255, 246, 214, 0.22)';
    g.beginPath(); g.moveTo(x - 3, 60); g.lineTo(x + 3, 60); g.lineTo(x + 44, 226); g.lineTo(x - 44, 226); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255, 246, 214, 0.05)'; g.fillRect(x - 40, WALL_BASE + 5, 80, 6); g.fillRect(x - 28, WALL_BASE + 4, 56, 8);
    drawExhibit(g, ex, art);
  }
  // furniture
  if (IMG.bench) g.drawImage(IMG.bench, 755, WALL_BASE + 8 - IMG.bench.height);
  if (IMG.bench) g.drawImage(IMG.bench, 1155, WALL_BASE + 8 - IMG.bench.height);
  if (IMG.plant) { g.drawImage(IMG.plant, 262, WALL_BASE + 2 - IMG.plant.height); g.drawImage(IMG.plant, W - 60, WALL_BASE + 2 - IMG.plant.height); }
}
function frameAround(g, x, y, w, h) {
  g.fillStyle = '#1e1813'; g.fillRect(x - 5, y - 5, w + 10, h + 10);
  g.fillStyle = '#4a3b2c'; g.fillRect(x - 4, y - 4, w + 8, h + 8);
  g.fillStyle = '#6b5640'; g.fillRect(x - 4, y - 4, w + 8, 1); g.fillRect(x - 4, y - 4, 1, h + 8);
  g.fillStyle = '#c9b48a'; g.fillRect(x - 1, y - 1, w + 2, h + 2);
}
function drawExhibit(g, ex, art) {
  const sprite = null;
  if (sprite) {
    const w = sprite.width * 1, h = sprite.height * 1;
    g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(ex.x - w / 2 + 2, ART_CY - h / 2 + 3, w, h);
    g.drawImage(sprite, Math.round(ex.x - w / 2), Math.round(ART_CY - h / 2));
    ex.box = [ex.x - w / 2, ART_CY - h / 2, w, h];
    return;
  }
  const t = art[ex.id]; if (!t) return;
  const x = Math.round(ex.x - t.width / 2), y = Math.round(ART_CY - t.height / 2);
  g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x - 3, y - 2, t.width + 10, t.height + 10);
  frameAround(g, x, y, t.width, t.height);
  g.drawImage(t, x, y);
  ex.box = [x - 5, y - 5, t.width + 10, t.height + 10];
}
function drawDoor(g, open) {
  const x = DOOR_X, y = DOOR_Y;
  if (open > 0) { g.fillStyle = '#1d2420'; g.fillRect(x + 2, y + 2, 32, 68); }
  if (IMG.doorPanel) { const w = Math.max(4, Math.round(32 * (1 - open * 0.84))); g.drawImage(IMG.doorPanel, x + 2, y + 2, w, 68); }
  if (IMG.doorFrame) g.drawImage(IMG.doorFrame, x, y);
}

/* ---------- player ---------- */
const player = { x: START_X, dir: 'right', step: 0, acc: 0, alpha: 1, lift: 0, target: null, pending: null, walking: false };
function drawPlayer(g, ox) {
  const x = Math.round(player.x) + ox, y = FEET;
  g.globalAlpha = player.alpha;
  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x - 9, y - 1, 18, 3); g.fillRect(x - 6, y - 2, 12, 5);
  let im, flip = false;
  if (player.dir === 'up') im = IMG.back;
  else if (player.dir === 'down') im = IMG.front;
  else { im = player.walking ? IMG['walk' + (player.step % 6)] : IMG.idle; flip = player.dir === 'left'; }
  if (im) {
    const dy = y - SPR_FOOT - Math.round(player.lift);
    if (flip) { g.save(); g.translate(x, 0); g.scale(-1, 1); g.drawImage(im, -SPR_CX, dy); g.restore(); }
    else g.drawImage(im, x - SPR_CX, dy);
  }
  g.globalAlpha = 1;
}

/* ---------- DOM ---------- */
const cv = $('#cv'), ctx = cv.getContext('2d'), labels = $('#labels'), help = $('#help'), whiteout = $('#whiteout');
const exitPlaque = document.createElement('div'); exitPlaque.className = 'plaque';
exitPlaque.innerHTML = '<b>EXIT</b><small>BACK TO HALLWAY</small>'; labels.appendChild(exitPlaque);
const exEls = EXHIBITS.map(ex => {
  const el = document.createElement('div'); el.className = 'plaque';
  el.innerHTML = ex.lines.map(() => '<b></b>').join('') + '<small></small>';
  el.querySelectorAll('b').forEach((b, i) => { b.textContent = ex.lines[i]; });
  el.querySelector('small').textContent = ex.sub;
  labels.appendChild(el); return el;
});
const prompt = document.createElement('div'); prompt.className = 'prompt'; prompt.hidden = true; labels.appendChild(prompt);
const hoverTag = document.createElement('div'); hoverTag.className = 'prompt hovertag'; hoverTag.hidden = true; labels.appendChild(hoverTag);
let hover = null;
const directory = $('#directory');
EXHIBITS.forEach((ex, i) => {
  const li = document.createElement('li'), b = document.createElement('button');
  b.innerHTML = '<span class="n"></span><span class="t"></span><span class="m"></span>';
  b.querySelector('.n').textContent = String(i + 1).padStart(2, '0');
  b.querySelector('.t').textContent = ex.dir;
  b.querySelector('.m').textContent = '→';
  b.addEventListener('click', () => { b.blur(); goTo({ ex }); });
  li.appendChild(b); $('#dirlist').appendChild(li);
});
$('#dirHow').innerHTML = coarse
  ? 'OR TAP THE FLOOR TO WALK YOURSELF'
  : 'OR WALK YOURSELF: <kbd>&larr;</kbd><kbd>&rarr;</kbd> MOVE &nbsp; <kbd>&uarr;</kbd> OPEN';
help.innerHTML = coarse ? 'Tap a frame to view · tap the floor to walk' : '&larr; &rarr; walk &nbsp;·&nbsp; &uarr; view &nbsp;·&nbsp; &darr; face front &nbsp;·&nbsp; Esc hallway';

let s = 2, viewW = 720, top = 0, camX = 0, busy = false, openPanel = null, moved = false, ready = false;
function layout() {
  const vw = innerWidth, vh = innerHeight;
  const v = Math.min(vh / H, Math.max(vw / 720, 1.2));
  s = v >= 2 ? Math.floor(v) : v;
  viewW = Math.ceil(vw / s); top = Math.round((vh - H * s) / 2);
  cv.width = viewW; cv.height = H;
  Object.assign(cv.style, { width: viewW * s + 'px', height: H * s + 'px', top: top + 'px' });
  ctx.imageSmoothingEnabled = false;
  [exitPlaque, ...exEls].forEach(el => { el.style.fontSize = (6 * s) + 'px'; el.style.padding = (1.6 * s) + 'px ' + (3 * s) + 'px'; });
  prompt.style.fontSize = Math.max(10, 5.6 * s) + 'px';
  directory.style.fontSize = Math.round(6.4 * s) + 'px';
}
addEventListener('resize', layout);
function updateCam() {
  const px = Math.round(player.x);
  camX = viewW >= W ? Math.round((W - viewW) / 2) : Math.max(0, Math.min(W - viewW, px - Math.floor(viewW / 2)));
}
const sx = wx => (wx - camX) * s, sy = wy => top + wy * s;
function nearTarget() {
  if (Math.abs(DOOR_X + DOOR_W / 2 - player.x) < 22) return { exit: true };
  const ex = EXHIBITS.find(e => Math.abs(e.x - player.x) < 30);
  return ex ? { ex } : null;
}
function noteMoved() { moved = true; }

let last = performance.now(), doorOpen = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(50, now - last); last = now;
  if (!ready) return;
  let vx = 0;
  if (!busy && !openPanel) {
    if (keys.left) vx -= 1;
    if (keys.right) vx += 1;
    if (vx) { player.target = null; player.pending = null; }
    else if (player.target != null) {
      const dx = player.target - player.x;
      if (Math.abs(dx) < 2) { player.x = player.target; player.target = null; if (player.pending) { const p = player.pending; player.pending = null; activate(p); } }
      else vx = Math.sign(dx);
    }
    if (vx) {
      const nx = Math.max(30, Math.min(W - 30, player.x + vx * dt * 0.19));
      player.acc += Math.abs(nx - player.x); player.x = nx;
      player.dir = vx > 0 ? 'right' : 'left'; player.step = Math.floor(player.acc / 16);
      noteMoved();
    }
  }
  player.walking = !!vx;
  updateCam();
  render();
}
function render() {
  const ox = -camX;
  ctx.clearRect(0, 0, viewW, H);
  ctx.drawImage(world, ox, 0);
  if (doorOpen > 0) { ctx.save(); ctx.translate(ox, 0); drawDoor(ctx, doorOpen); ctx.restore(); }
  if (hover && !busy && !openPanel) {
    const b = hover.exit ? [DOOR_X - 3, DOOR_Y - 3, DOOR_W + 6, DOOR_H + 3] : (hover.ex.box || null);
    if (b) {
      ctx.fillStyle = 'rgba(125,255,178,.14)'; ctx.fillRect(b[0] - 3 + ox, b[1] - 3, b[2] + 6, b[3] + 6);
      ctx.strokeStyle = '#3ee07a'; ctx.lineWidth = 2; ctx.strokeRect(b[0] - 3 + ox + 1, b[1] - 3 + 1, b[2] + 4, b[3] + 4);
    }
  }
  drawPlayer(ctx, ox);
  exitPlaque.style.left = sx(DOOR_X + DOOR_W / 2) + 'px'; exitPlaque.style.top = sy(176) + 'px';
  directory.style.left = sx(98) + 'px'; directory.style.top = sy(54) + 'px';
  EXHIBITS.forEach((ex, i) => { exEls[i].style.left = sx(ex.x) + 'px'; exEls[i].style.top = sy(194) + 'px'; });
  const n = busy || openPanel ? null : nearTarget();
  if (n) {
    prompt.hidden = false;
    const x = n.exit ? DOOR_X + DOOR_W / 2 : n.ex.x;
    prompt.textContent = n.exit ? (coarse ? 'Tap to leave' : '↑ Back to hallway') : (coarse ? 'Tap to view' : '↑ View exhibit');
    prompt.style.left = sx(x) + 'px'; prompt.style.top = sy(FEET - 64) + 'px';
  } else prompt.hidden = true;
  const hv = hover && !busy && !openPanel ? hover : null;
  exEls.forEach((el, i) => el.classList.toggle('hover', !!(hv && hv.ex === EXHIBITS[i])));
  exitPlaque.classList.toggle('hover', !!(hv && hv.exit));
  const same = hv && n && ((hv.exit && n.exit) || (hv.ex && n.ex === hv.ex));
  if (hv && !same) {
    hoverTag.hidden = false; hoverTag.textContent = hv.exit ? 'Click to go back to the hallway' : 'Click to view';
    const b = hv.exit ? [DOOR_X, DOOR_Y] : hv.ex.box;
    hoverTag.style.left = sx(hv.exit ? DOOR_X + DOOR_W / 2 : hv.ex.x) + 'px'; hoverTag.style.top = sy((hv.exit ? 172 : b[1]) - 4) + 'px';
  } else hoverTag.hidden = true;
}

/* ---------- transitions ---------- */
function tween(ms, fn) {
  if (reduced) { fn(1); return Promise.resolve(); }
  return new Promise(res => { const t0 = performance.now(); (function st(t) { const k = Math.min(1, (t - t0) / ms); fn(k); k < 1 ? requestAnimationFrame(st) : res(); })(t0); });
}
function white(on, ms = 600) { whiteout.style.transitionDuration = (reduced ? 0 : ms) + 'ms'; whiteout.style.opacity = on ? 1 : 0; return sleep(reduced ? 0 : ms); }
async function leave() {
  if (busy) return; busy = true;
  if (Math.abs(DOOR_X + DOOR_W / 2 - player.x) < 22) {
    player.x = DOOR_X + DOOR_W / 2; player.dir = 'up';
    await tween(300, k => { doorOpen = k; });
    await tween(380, k => { player.alpha = 1 - k; player.lift = k * 6; });
  }
  await white(true, 450);
  location.href = '../index.html#od';
}
async function activate(t) {
  if (busy || openPanel) return;
  if (t.exit) return leave();
  const ex = t.ex;
  player.x = ex.x; player.dir = 'up';
  if (ex.href) { busy = true; await white(true, 500); location.href = ex.href; return; }
  busy = true;
  await white(true, 260);
  openPanelFor(ex);
  player.dir = 'down';
  await white(false, 380);
  busy = false;
}
function openPanelFor(ex) {
  openPanel = $('#' + ex.panel); openPanel.hidden = false; openPanel.scrollTop = 0;
  history.replaceState(null, '', '#' + ex.id);
  if (ex.panel === 'p-threshold') { setMethod(ex.method); renderThreshold(); }
  if (ex.panel === 'p-line') renderLine();
  openPanel.querySelector('[data-close]').focus({ preventScroll: true });
}
async function closePanel() {
  if (!openPanel || busy) return;
  busy = true; kmAnim = null;
  await white(true, 240);
  openPanel.hidden = true; openPanel = null;
  history.replaceState(null, '', location.pathname);
  await white(false, 380);
  busy = false;
}
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closePanel));
function goTo(t) {
  if (busy || openPanel) return;
  player.target = t.exit ? DOOR_X + DOOR_W / 2 : t.ex.x; player.pending = t; noteMoved();
}
async function toStart() {
  if (busy || openPanel) return;
  busy = true; await white(true, 220);
  player.x = START_X; player.dir = 'right'; player.target = null; player.pending = null;
  await white(false, 320); busy = false;
}

/* ---------- input ---------- */
const keys = { left: false, right: false };
addEventListener('keydown', e => {
  const k = e.key;
  if (openPanel) { if (k === 'Escape') { e.preventDefault(); closePanel(); } return; }
  if (k === 'Escape') { e.preventDefault(); leave(); return; }
  if (k === 'Home') { e.preventDefault(); toStart(); return; }
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; e.preventDefault(); }
  else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; e.preventDefault(); }
  else if ((k === 'ArrowDown' || k === 's' || k === 'S') && !busy) { e.preventDefault(); player.target = null; player.pending = null; player.dir = 'down'; }
  else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === 'Enter' || k === ' ') {
    if (document.activeElement && document.activeElement.closest('#directory')) return;
    const n = nearTarget(); if (n && !busy) { e.preventDefault(); activate(n); }
  }
});
addEventListener('keyup', e => {
  const k = e.key;
  if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
  if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
});
addEventListener('blur', () => { keys.left = keys.right = false; });
function hitAt(cx, cy) {
  const wx = camX + cx / s, wy = (cy - top) / s;
  if (wx >= DOOR_X - 6 && wx <= DOOR_X + DOOR_W + 6 && wy >= 170 && wy <= WALL_BASE + 6) return { exit: true };
  const ex = EXHIBITS.find(e => e.box && wx >= e.box[0] - 8 && wx <= e.box[0] + e.box[2] + 8 && wy >= e.box[1] - 8 && wy <= 230);
  return ex ? { ex } : null;
}
cv.addEventListener('click', e => {
  if (busy || openPanel) return;
  const t = hitAt(e.clientX, e.clientY);
  if (t) { goTo(t); return; }
  player.pending = null; player.target = Math.max(30, Math.min(W - 30, camX + e.clientX / s)); noteMoved();
});
cv.addEventListener('mousemove', e => { hover = hitAt(e.clientX, e.clientY); cv.style.cursor = hover ? 'pointer' : 'default'; });
cv.addEventListener('mouseleave', () => { hover = null; });
$('#leave').addEventListener('click', e => { e.preventDefault(); leave(); });

/* ================= thresholding demo ================= */
const CODE = {
  otsu: `<span class="c">// Maximize variance between classes, by iterating over each part of the intensity histogram</span>
<span class="k">int</span> <span class="n">otsu_threshold</span>(<span class="k">const</span> std::vector&lt;<span class="k">unsigned char</span>&gt;&amp; sorted_pixels, <span class="k">int</span> width, <span class="k">int</span> height) {
    <span class="k">long int</span> N = width * height;
    <span class="k">int</span> threshold = 0;  <span class="k">float</span> sum = 0, sumB = 0, varMax = 0;  <span class="k">int</span> q1 = 0, q2 = 0;
    std::vector&lt;<span class="k">float</span>&gt; hist(256, 0);
    <span class="k">for</span> (<span class="k">int</span> i = 0; i &lt; N; i++) hist[(<span class="k">int</span>) sorted_pixels[i]]++;
    <span class="k">for</span> (<span class="k">int</span> i = 0; i &lt;= MAX_INTENSITY; i++) sum += i * ((<span class="k">int</span>)hist[i]);
    <span class="k">for</span> (<span class="k">int</span> i = 0; i &lt;= MAX_INTENSITY; i++) {
        q1 += hist[i];                      <span class="c">// pixels up till i</span>
        <span class="k">if</span> (q1 == 0) <span class="k">continue</span>;
        q2 = N - q1;                        <span class="c">// rest of the pixels</span>
        <span class="k">if</span> (q2 == 0) <span class="k">break</span>;
        sumB += (<span class="k">float</span>) (i * ((<span class="k">int</span>)hist[i]));
        <span class="k">float</span> m1 = sumB / q1;
        <span class="k">float</span> m2 = (sum - sumB) / q2;
        <span class="k">float</span> varBetween = (<span class="k">float</span>) q1 * (<span class="k">float</span>) q2 * (m1 - m2) * (m1 - m2);
        <span class="k">if</span> (varBetween &gt; varMax) { varMax = varBetween; threshold = i; }
    }
    <span class="k">return</span> threshold;
}`,
  kmeans: `<span class="k">int</span> <span class="n">assignCluster</span>(Point point, <span class="k">const</span> std::vector&lt;Point&gt;&amp; centroids) {
    <span class="k">double</span> min_dist = distance(point, centroids[0]);  <span class="k">int</span> cluster_index = 0;
    <span class="k">for</span> (size_t i = 1; i &lt; centroids.size(); ++i) {
        <span class="k">double</span> dist = distance(point, centroids[i]);
        <span class="k">if</span> (dist &lt; min_dist) { min_dist = dist; cluster_index = i; }
    }
    <span class="k">return</span> cluster_index;
}

<span class="k">void</span> <span class="n">kMeans</span>(<span class="k">const</span> std::vector&lt;Point&gt;&amp; points, <span class="k">int</span> k, std::vector&lt;Point&gt;&amp; centroids,
            std::vector&lt;<span class="k">int</span>&gt;&amp; new_assignments, <span class="k">int</span> max_iterations) {
    <span class="k">for</span> (<span class="k">int</span> i = 0; i &lt; k; ++i) centroids.push_back(points[i]);   <span class="c">// start of the sorted image</span>
    <span class="k">for</span> (<span class="k">int</span> iter = 0; iter &lt; max_iterations; ++iter) {
        new_assignments.clear();
        <span class="k">for</span> (<span class="k">int</span> i = 0; i &lt; points.size(); i++)
            new_assignments.push_back(assignCluster(points[i], centroids));
        updateCentroids(points, centroids, new_assignments);       <span class="c">// mean intensity per cluster</span>
    }
}
<span class="c">// threshold = max over clusters of each cluster's minimum intensity (getClusterStats)</span>`,
  line: `<span class="c">// Calculate z-scores for y (intensity):  z = (x - mu) / stdev</span>
<span class="k">for</span> (size_t i = 0; i &lt; y.size(); ++i) z_scores[i] = (y[i][0] - y_mean_intensity) / y_stddev;

<span class="c">// Filter data points based on z-scores</span>
<span class="k">for</span> (size_t i = 0; i &lt; y.size(); ++i)
    <span class="k">if</span> (std::abs(z_scores[i]) &lt;= zscore_threshold) { filtered_x.push_back(x[i]); filtered_y.push_back(y[i][1]); }

<span class="c">// m = (nExy - ExEy) / (nEx^2 - (Ex)^2)</span>
slope = (n*(sum_xy) - (sum_x*sum_y)) / (n*sum_x2 - std::pow(sum_x, 2));
intercept = (sum_y - slope*sum_x) / n;`,
};
const TH = { channel: 'red', method: 'otsu', bright: true, manual: { red: 40, green: 55 } };
let RES = null, kmAnim = null;
const CH_COLOR = { red: '#e0534a', green: '#3fbf73' };
function computeAll() {
  RES = {};
  for (const ch of ['red', 'green']) {
    const o = Vision.otsu(HIST[ch]), k = Vision.kmeans(HIST[ch]);
    let N = 0; for (const c of HIST[ch]) N += c;
    RES[ch] = { otsu: o, km: k, N };
  }
}
function thresholdFor(ch) {
  if (TH.method === 'otsu') return RES[ch].otsu.threshold;
  if (TH.method === 'kmeans') return RES[ch].km.threshold;
  if (TH.method === 'manual') return TH.manual[ch];
  return 0;
}
function setSeg(id, v) { document.querySelectorAll('#' + id + ' button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); }
function setMethod(m) { TH.method = m; setSeg('mSeg', m); }
document.querySelectorAll('#chSeg button').forEach(b => b.addEventListener('click', () => { TH.channel = b.dataset.v; setSeg('chSeg', TH.channel); $('#manualT').value = TH.manual[TH.channel]; renderThreshold(); }));
document.querySelectorAll('#mSeg button').forEach(b => b.addEventListener('click', () => { setMethod(b.dataset.v); renderThreshold(); }));
$('#manualT').addEventListener('input', e => { TH.manual[TH.channel] = +e.target.value; renderThreshold(); });
$('#bright').addEventListener('change', e => { TH.bright = e.target.checked; drawCar(); });
$('#kmRun').addEventListener('click', () => {
  if (TH.method !== 'kmeans') setMethod('kmeans');
  const hist = RES[TH.channel].km.history, stop = Math.min(hist.length - 1, RES[TH.channel].km.convergedAt + 1);
  kmAnim = { i: 0, stop, t: performance.now() };
  renderThreshold();
  (function tick(now) {
    if (!kmAnim) return;
    if (now - kmAnim.t > (reduced ? 0 : 650)) { kmAnim.t = now; kmAnim.i++; drawHist(); }
    if (kmAnim.i < kmAnim.stop) requestAnimationFrame(tick); else { kmAnim = null; drawHist(); }
  })(performance.now());
});

function renderThreshold() {
  const ch = TH.channel, m = TH.method;
  $('#manualCtl').hidden = m !== 'manual';
  $('#manualV').textContent = TH.manual[ch];
  $('#kmRun').hidden = m === 'original';
  $('#codeTitle').textContent = m === 'kmeans' ? 'assignCluster() + kMeans() · Task_2/kmeans.h' : 'otsu_threshold() · Task_2/car.cpp';
  $('#codeBox').innerHTML = m === 'kmeans' ? CODE.kmeans : CODE.otsu;
  drawCar(); drawHist(); drawStats();
}
let carKept = 0;
function drawCar() {
  const c = $('#carCv'), g = c.getContext('2d');
  const out = new ImageData(new Uint8ClampedArray(CAR.data), CAR.width, CAR.height), d = out.data;
  let kept = 0;
  if (TH.method !== 'original') {
    const T = thresholdFor(TH.channel);
    for (let i = 0; i < d.length; i += 4) {
      const keep = d[i + (TH.channel === 'green' ? 1 : 0)] >= T;
      if (keep) kept++; else d[i] = d[i + 1] = d[i + 2] = 0;
    }
  }
  carKept = kept / (CAR.width * CAR.height);
  if (TH.bright) for (let i = 0; i < d.length; i += 4) { d[i] = Math.min(255, d[i] * 3); d[i + 1] = Math.min(255, d[i + 1] * 3); d[i + 2] = Math.min(255, d[i + 2] * 3); }
  g.putImageData(out, 0, 0);
  $('#carCap').textContent = TH.method === 'original' ? 'Original frame (downscaled for the web)' :
    'Pixels below the threshold are set to black, as in car.cpp';
}
function drawHist() {
  const c = $('#histCv'), dpr = Math.min(2, devicePixelRatio || 1);
  const w = c.clientWidth || 500, h = c.clientHeight || 300;
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const ch = TH.channel, hist = HIST[ch], R0 = RES[ch];
  const padL = 34, padR = 10, padT = 12, padB = 26, pw = w - padL - padR, ph = h - padT - padB;
  g.clearRect(0, 0, w, h);
  let max = 0; for (const v of hist) max = Math.max(max, v);
  const lmax = Math.log1p(max);
  const X = v => padL + (v + 0.5) / 256 * pw;
  const T = TH.method === 'original' ? -1 : thresholdFor(ch);
  for (let v = 0; v < 256; v++) {
    if (!hist[v]) continue;
    const bh = Math.log1p(hist[v]) / lmax * ph;
    g.fillStyle = T < 0 || v >= T ? CH_COLOR[ch] : '#c4bdae';
    g.fillRect(padL + v / 256 * pw, padT + ph - bh, Math.max(1, pw / 256), bh);
  }
  // axes
  g.strokeStyle = '#1f2b24'; g.lineWidth = 1; g.beginPath(); g.moveTo(padL, padT + ph + .5); g.lineTo(padL + pw, padT + ph + .5); g.stroke();
  g.fillStyle = '#5e6a62'; g.font = '10px "IBM Plex Mono", monospace'; g.textAlign = 'center';
  for (const t of [0, 64, 128, 192, 255]) g.fillText(t, X(t), h - 8);
  g.save(); g.translate(10, padT + ph / 2); g.rotate(-Math.PI / 2); g.fillText('pixels (log)', 0, 0); g.restore();
  // otsu variance curve
  if (TH.method === 'otsu') {
    let vm = 0; for (const v of R0.otsu.curve) vm = Math.max(vm, v);
    g.strokeStyle = '#e6a33a'; g.lineWidth = 2; g.beginPath(); let started = false;
    for (let v = 0; v < 256; v++) { const y = padT + ph - R0.otsu.curve[v] / vm * ph * 0.92; if (!R0.otsu.curve[v]) continue; started ? g.lineTo(X(v), y) : g.moveTo(X(v), y); started = true; }
    g.stroke();
  }
  const vline = (v, color, label, dash) => {
    g.save(); g.strokeStyle = color; g.lineWidth = 2; if (dash) g.setLineDash([5, 4]);
    g.beginPath(); g.moveTo(X(v), padT); g.lineTo(X(v), padT + ph); g.stroke(); g.restore();
    g.fillStyle = color; g.textAlign = v > 200 ? 'right' : 'left'; g.font = '11px "IBM Plex Mono", monospace';
    g.fillText(label, X(v) + (v > 200 ? -6 : 6), padT + 12);
  };
  if (TH.method === 'otsu') vline(R0.otsu.threshold, '#1f2b24', 'Otsu T = ' + R0.otsu.threshold);
  if (TH.method === 'manual') vline(TH.manual[ch], '#1f2b24', 'Manual T = ' + TH.manual[ch]);
  if (TH.method === 'kmeans') {
    const hs = R0.km.history, i = kmAnim ? kmAnim.i : hs.length - 1, cs = hs[i];
    cs.forEach((cv, j) => {
      g.fillStyle = j ? '#2f6b4f' : '#7a6f5f';
      g.beginPath(); g.moveTo(X(cv), padT + ph - 2); g.lineTo(X(cv) - 6, padT + ph + 9); g.lineTo(X(cv) + 6, padT + ph + 9); g.closePath(); g.fill();
    });
    if (!kmAnim) vline(R0.km.threshold, '#1f2b24', 'k-means T = ' + R0.km.threshold);
    $('#kmIter').textContent = kmAnim ? `Iteration ${i} · centroids ${cs.join(' / ')}` :
      `Converged after ${R0.km.convergedAt} iterations · centroids ${R0.km.centroids.join(' / ')}`;
  } else $('#kmIter').textContent = '';
  const lg = [];
  lg.push(`<span><i style="background:${CH_COLOR[ch]}"></i>${TH.method === 'original' ? 'histogram' : 'kept (≥ T)'}</span>`);
  if (TH.method !== 'original') lg.push('<span><i style="background:#c4bdae"></i>set to black (&lt; T)</span>');
  if (TH.method === 'otsu') lg.push('<span><i style="background:#e6a33a"></i>between-class variance</span>');
  if (TH.method === 'kmeans') lg.push('<span><i style="background:#2f6b4f"></i>centroids</span>');
  $('#legend').innerHTML = lg.join('');
}
function drawStats() {
  const ch = TH.channel, R0 = RES[ch], hist = HIST[ch];
  const cell = (k, v) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`;
  if (TH.method === 'original') { $('#stats').innerHTML = cell('Image', '1094×1080') + cell('Channel', ch); return; }
  const T = thresholdFor(ch);
  let keep = 0; for (let v = T; v < 256; v++) keep += hist[v];
  const parts = [cell('Threshold', T), cell('Kept · full image', (100 * keep / R0.N).toFixed(2) + '<small>%</small>')];
  if (TH.method === 'kmeans') parts.push(cell('Cluster sizes', R0.km.counts.map(n => n.toLocaleString('en-US')).join(' / ')));
  if (TH.method === 'otsu') parts.push(cell('Otsu · red / green', `${RES.red.otsu.threshold} / ${RES.green.otsu.threshold}`));
  $('#stats').innerHTML = parts.join('');
}
addEventListener('resize', () => { if (openPanel && openPanel.id === 'p-threshold') drawHist(); });
document.querySelectorAll('#dannSeg button').forEach(b => b.addEventListener('click', () => {
  setSeg('dannSeg', b.dataset.v);
  const svg = $('#dannSvg'); svg.classList.toggle('show-neg', b.dataset.v === 'neg'); svg.classList.toggle('show-conf', b.dataset.v === 'conf');
}));

/* ================= line-fit demo ================= */
const LN = { z: 2, kept: true, rej: true, line: true };
$('#zT').addEventListener('input', e => { LN.z = +e.target.value; renderLine(); });
['showKept', 'showRej', 'showLine'].forEach((id, i) => $('#' + id).addEventListener('change', e => { LN[['kept', 'rej', 'line'][i]] = e.target.checked; renderLine(); }));
function renderLine() {
  $('#zV').textContent = LN.z.toFixed(1);
  $('#lineCode').innerHTML = CODE.line;
  const r = Vision.lineFit(DIFF.data, DIFF.width, DIFF.height, LN.z);
  const c = $('#lineCv'), g = c.getContext('2d');
  g.putImageData(DIFF, 0, 0);
  if (LN.rej) { g.fillStyle = '#e6a33a'; for (const [x, y] of r.rejected) g.fillRect(x - 2, y - 2, 5, 5); }
  if (LN.kept) { g.fillStyle = '#e0534a'; for (const [x, y] of r.kept) g.fillRect(x - 1, y - 1, 3, 3); }
  if (LN.line && isFinite(r.slope)) { g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, r.intercept); g.lineTo(DIFF.width, r.slope * DIFF.width + r.intercept); g.stroke(); }
  const cell = (k, v) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`;
  $('#lineStats').innerHTML = cell('Slope', isFinite(r.slope) ? r.slope.toFixed(5) : '—') + cell('Intercept', isFinite(r.intercept) ? r.intercept.toFixed(2) : '—') +
    cell('Kept columns', r.kept.length) + cell('Rejected', r.rejected.length) + cell('Peak intensity μ ± σ', `${r.meanI.toFixed(1)} <small>± ${r.sd.toFixed(1)}</small>`);
}

/* ---------- start ---------- */
layout();
requestAnimationFrame(frame);
Promise.all([loadAll(), fetch('img/car_hist.json').then(r => r.json()).then(h => { HIST = h; })]).then(() => {
  CAR = pixelsOf(IMG.car); DIFF = pixelsOf(IMG.diffuse);
  LINE0 = Vision.lineFit(DIFF.data, DIFF.width, DIFF.height, 2);
  computeAll();
  paint(buildArt());
  const ex = EXHIBITS.find(e => e.id === location.hash.slice(1));
  if (ex) { player.x = ex.x; player.dir = 'down'; if (ex.panel) openPanelFor(ex); }
  ready = true;
  requestAnimationFrame(() => white(false, 700));
});
addEventListener('pageshow', e => { if (e.persisted) { busy = false; player.alpha = 1; player.lift = 0; doorOpen = 0; white(false, 400); } });
})();
