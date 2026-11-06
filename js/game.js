'use strict';

// ================= Sauvegarde =================
const STORE_KEY = 'ilesMagiques.v1';
const DEFAULTS = {
  name: 'Coleen', nameSay: 'Coline', level: 'CE1', mode: 'mix', sound: true, voice: true, prof: 'bulle', profVoices: {}, worlds: {},
  boat: { hull: '#e63946', sail: '#ffffff', pattern: 'rayures' },
  dailyWords: DAILY_WORDS, wordStats: {},
};

function load() {
  const base = JSON.parse(JSON.stringify(DEFAULTS));
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return Object.assign(base, saved, { boat: Object.assign(base.boat, saved.boat) });
    }
  } catch (e) { /* stockage indisponible : on garde les valeurs par défaut */ }
  return base;
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* ignoré */ }
}
const S = load();

// ================= Outils =================
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const h = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;
const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

const app = document.getElementById('app');

// ================= Sons (synthétisés, aucun fichier) =================
const SFX = (() => {
  let ctx;
  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(f, d, type = 'sine', v = 0.15, t0 = 0, slide) {
    if (!S.sound) return;
    const x = getCtx();
    if (!x) return;
    const t = x.currentTime + t0;
    const o = x.createOscillator();
    const g = x.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(x.destination);
    o.start(t);
    o.stop(t + d + 0.05);
  }
  return {
    click: () => tone(660, 0.06, 'triangle', 0.08),
    pop: () => tone(520, 0.12, 'sine', 0.2, 0, 1040),
    good: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.16, i * 0.09)),
    bad: () => { tone(220, 0.18, 'square', 0.05, 0, 160); tone(165, 0.25, 'square', 0.05, 0.15, 110); },
    door: () => { tone(160, 0.5, 'sawtooth', 0.04, 0, 80); tone(400, 0.5, 'sine', 0.08, 0.1, 1200); },
    star: (i) => tone(784 * Math.pow(1.26, i), 0.22, 'triangle', 0.16),
    whoosh: () => { tone(300, 0.6, 'sine', 0.07, 0, 900); tone(200, 0.6, 'triangle', 0.04, 0.05, 600); },
    step: (i) => tone(i % 2 ? 300 : 260, 0.05, 'triangle', 0.05),
    unlock: () => { tone(900, 0.08, 'square', 0.05); tone(1300, 0.15, 'triangle', 0.1, 0.08); },
    magic: () => { for (let i = 0; i < 8; i++) tone(1200 + i * 160, 0.1, 'sine', 0.06, i * 0.05); },
    win: () => [523, 659, 784, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i === 6 ? 0.6 : 0.22, 'triangle', 0.18, i * 0.14)),
  };
})();

// ================= Voix (synthèse vocale du navigateur) =================
function canSpeak() {
  return S.voice && 'speechSynthesis' in window;
}

function speak(text, { queue = false, rate = 0.9 } = {}) {
  if (!canSpeak()) return;
  try {
    if (!queue) speechSynthesis.cancel();
    let clean = text.replace(/[^\p{L}\p{N}\s.,!?'’:-]/gu, '').trim();
    if (S.name && S.nameSay) clean = clean.replace(new RegExp(`(^|[^\\p{L}])${S.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'giu'), `$1${S.nameSay}`);
    if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'fr-FR';
    const { voice } = curProf();
    u.rate = rate * voice.rate;
    u.pitch = voice.pitch;
    const v = voiceFor(S.prof);
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) { /* pas de voix disponible */ }
}

// Voix françaises triées de la plus naturelle à la moins naturelle
const FUNNY_VOICES = /Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Jacques|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Zarvox|Trinoids|Whisper|Organ|Superstar|Jester|Junior|Ralph|Kathy|Fred/i;
function voiceScore(v) {
  let n = 0;
  if (/natural|neural|premium|online/i.test(v.name)) n += 50;
  if (/enhanced|amélioré/i.test(v.name)) n += 35;
  if (/google/i.test(v.name)) n += 30;
  if (/Audrey|Thomas|Marie|Denise|Henri|Vivienne|Eloise|Céline/i.test(v.name)) n += 15;
  if (v.lang.toLowerCase() === 'fr-fr') n += 20;
  if (FUNNY_VOICES.test(v.name)) n -= 60;
  return n;
}
function frenchVoices() {
  if (!('speechSynthesis' in window)) return [];
  return speechSynthesis.getVoices()
    .filter((v) => v.lang && v.lang.toLowerCase().startsWith('fr'))
    .sort((a, b) => voiceScore(b) - voiceScore(a));
}
// Voix d'un professeur : celle choisie par le parent, sinon la première de ses préférences
function voiceFor(id) {
  const voices = frenchVoices();
  const prefer = (PROFS[id] || PROFS.bulle).voice.prefer;
  const rank = (v) => {
    const i = prefer.findIndex((name) => v.name.toLowerCase().includes(name.toLowerCase()));
    return voiceScore(v) + (i < 0 ? 0 : 1000 - i * 100);
  };
  return voices.find((v) => v.name === S.profVoices[id])
    || voices.slice().sort((a, b) => rank(b) - rank(a))[0] || null;
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();

// ================= Confettis =================
const Confetti = (() => {
  const cv = document.getElementById('confetti');
  const ctx = cv.getContext('2d');
  const colors = ['#ff5d8f', '#ffd23f', '#3bceac', '#5aa9e6', '#a06cd5', '#ff8c42'];
  let parts = [];
  let running = false;
  function resize() {
    const r = window.devicePixelRatio || 1;
    cv.width = innerWidth * r;
    cv.height = innerHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  addEventListener('resize', resize);
  resize();
  function add(p) {
    parts.push(Object.assign({ r: 4 + Math.random() * 5, c: pick(colors), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 1, sq: Math.random() < 0.5 }, p));
    if (!running) { running = true; requestAnimationFrame(loop); }
  }
  function burst(x = innerWidth / 2, y = innerHeight / 2, n = 80) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 3 + Math.random() * 9;
      add({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6 });
    }
  }
  function rain(n = 160) {
    for (let i = 0; i < n; i++) {
      add({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.6, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3 });
    }
  }
  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.22; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.006;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      if (p.sq) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      else { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.4, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    if (parts.length) requestAnimationFrame(loop);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  return { burst, rain };
})();

// ================= Thème du monde =================
function setTheme(w) {
  const st = document.body.style;
  st.setProperty('--bg1', w ? w.c1 : '#5b3cc4');
  st.setProperty('--bg2', w ? w.c2 : '#ff7eb3');
  st.setProperty('--accent', w ? w.accent : '#ffd23f');
  const items = w ? w.decor : ['⛵', '🏝️', '🐠', '⭐', '🐚', '🧭', '🌊'];
  document.getElementById('decor').innerHTML = Array.from({ length: 14 }, (_, i) =>
    `<span style="left:${rand(0, 94)}%;top:${rand(0, 90)}%;--s:${rand(28, 64)}px;--t:${rand(5, 11)}s;animation-delay:-${rand(0, 8)}s">${items[i % items.length]}</span>`
  ).join('');
}

// ================= Générateurs d'exercices =================
function makeSentence(level) {
  const n = level === 'CE1' ? pick([1, 1, 2, 3]) : 1;
  const s = pick(SUBJECTS);
  const a = pick(ACTIONS);
  const text = n === 1 ? `${cap(s.sg)} ${a.sg}.` : `${cap(NUM_WORDS[n])} ${s.pl} ${a.pl}.`;
  const distractors = [
    { s: pick(SUBJECTS.filter((x) => x !== s)), a, n },
    { s, a: pick(ACTIONS.filter((x) => x !== a)), n },
  ];
  if (level === 'CE1') distractors.push({ s, a, n: pick([1, 2, 3].filter((x) => x !== n)) });
  return { text, correct: { s, a, n }, distractors };
}

function sceneHTML(o, cls = '') {
  return `<div class="scene ${cls}"><span class="who">${o.s.e.repeat(o.n)}</span><span class="what">${o.a.e}</span></div>`;
}

// Choix proches du bon nombre (inversion dizaines/unités, ±1, ±10...)
function numberOptions(n, count, min = 10, max = 99) {
  const d = Math.floor(n / 10);
  const u = n % 10;
  const cands = [];
  if (u !== d && u > 0) cands.push(u * 10 + d);
  cands.push(...shuffle([n + 10, n - 10, n + 1, n - 1, n + 2, n - 2]));
  const opts = [n];
  for (const x of cands) {
    if (opts.length >= count) break;
    if (x >= min && x <= max && !opts.includes(x)) opts.push(x);
  }
  while (opts.length < count) {
    const x = rand(min, max);
    if (!opts.includes(x)) opts.push(x);
  }
  return shuffle(opts);
}

function blocksHTML(n, cls = '') {
  const d = Math.floor(n / 10);
  const u = n % 10;
  const tens = Array.from({ length: d }, () => `<span class="ten">${'<i></i>'.repeat(10)}</span>`).join('');
  return `<div class="blocks ${cls}" style="--t:${d}"><div class="tens">${tens}</div><div class="units">${'<i class="unit"></i>'.repeat(u)}</div></div>`;
}

function duText(n) {
  const d = Math.floor(n / 10);
  const u = n % 10;
  return `${plural(d, 'dizaine')} et ${plural(u, 'unité')}`;
}

// ================= Le bateau =================
const boatEl = () => document.getElementById('boat');

function placeBoat(x, bottom, dur = 0, scale = 1) {
  const el = boatEl();
  el.style.transition = dur
    ? `left ${dur}s ease-in-out, bottom ${dur}s ease-in-out, transform ${dur}s ease-in-out, opacity .4s`
    : 'opacity .4s';
  el.style.left = `${x}px`;
  el.style.bottom = `${bottom}px`;
  el.style.setProperty('--scale', scale);
}

function boatHome() {
  return { x: innerWidth / 2 - boatEl().offsetWidth / 2, b: Math.max(6, innerHeight * 0.015) };
}

async function sailTo(x, b, scale = 1) {
  const el = boatEl();
  const r = el.getBoundingClientRect();
  const dist = Math.hypot(x - r.left, b - (innerHeight - r.bottom));
  const dur = Math.min(1.6, Math.max(0.45, dist / 480));
  el.style.setProperty('--tilt', `${x > r.left + 4 ? 7 : x < r.left - 4 ? -7 : 0}deg`);
  el.classList.add('sailing');
  placeBoat(x, b, dur, scale);
  await sleep(dur * 1000);
  el.classList.remove('sailing');
}

// Navigue vers une île (frac < 1 : s'arrête en chemin)
async function sailToIsland(isle, frac = 1) {
  const el = boatEl();
  const r = isle.getBoundingClientRect();
  const bw = el.offsetWidth;
  const tx = r.left + r.width / 2 - bw / 2;
  const tb = innerHeight - r.bottom - el.offsetHeight * 0.22;
  const cur = el.getBoundingClientRect();
  const cx = cur.left;
  const cb = innerHeight - cur.bottom;
  await sailTo(cx + (tx - cx) * frac, cb + (tb - cb) * frac, 1 - 0.25 * frac);
}

async function sailHome() {
  const p = boatHome();
  await sailTo(p.x, p.b, 1);
}

function boatMood(mood) {
  const el = boatEl();
  if (!el) return;
  el.classList.remove('happy', 'oops');
  void el.offsetWidth;
  el.classList.add(mood);
  setTimeout(() => el.classList.remove(mood), 1300);
}

// Îles cliquables : une seule est la bonne
function islandsRow(count) {
  const land = LANDS[RUN.zone.land];
  return h(`<div class="islands n${count}" style="--g1:${land.g1};--g2:${land.g2};--top:${land.top}"></div>`);
}

function islandEl(html, i) {
  return h(`<button class="island" style="--i:${i}" aria-label="Île ${i + 1}">
    <span class="isle-sign"><span class="isle-card">${html}</span><span class="isle-post"></span></span>
    <span class="isle-land"><span class="isle-top l">${pick(RUN.zone.tops)}</span><span class="isle-top r">${pick(RUN.zone.tops)}</span></span>
  </button>`);
}

function buildIslands(container, items, api, onWin) {
  const row = islandsRow(items.length);
  let done = false;
  let busy = false;
  items.forEach((it, i) => {
    const isle = islandEl(it.html, i);
    isle.addEventListener('click', async () => {
      if (done || busy || isle.classList.contains('rocky')) return;
      busy = true;
      if (it.correct) {
        done = true;
        row.classList.add('resolved');
        isle.classList.add('chosen');
        await sailToIsland(isle, 1);
        isle.classList.add('won');
        SFX.unlock();
        if (onWin) onWin();
        await sleep(400);
        api.success();
      } else {
        await sailToIsland(isle, 0.55);
        restart(boatEl(), 'bonk');
        isle.classList.add('rocky');
        api.fail();
        await sleep(450);
        await sailHome();
        busy = false;
      }
    });
    row.append(isle);
  });
  container.append(row);
}

// ================= Singulier / pluriel =================
// Un groupe découpé en morceaux : { t: texte, clue: indice ?, glue: collé au morceau précédent }
const SG_DETS = { m: ['un', 'le'], f: ['une', 'la'] };
const PL_DETS = ['des', 'les', 'des', 'les', 'deux', 'trois'];

function pluralPieces(word) {
  const end = word.endsWith('x') ? 'x' : 's';
  return [{ t: word.slice(0, -1) }, { t: end, clue: true, glue: true, kind: 'fin' }];
}

function makeGroup(plural, withVerb) {
  // un nom (« une banane », « des vaches »)
  if (!withVerb) {
    if (Math.random() < 0.6) {
      const n = pick(NOUNS.filter((x) => x.sg !== x.pl));
      return plural
        ? { plural, pieces: [{ t: pick(PL_DETS), clue: true, kind: 'det' }, ...pluralPieces(n.pl)] }
        : { plural, pieces: [{ t: pick(SG_DETS[n.g]), clue: true, kind: 'det' }, { t: n.sg }] };
    }
    const s = pick(SUBJECTS.filter((x) => !x.sg.includes('’') && !x.sg.endsWith(x.pl)));
    const [det, noun] = s.sg.split(' ');
    return plural
      ? { plural, pieces: [{ t: pick(PL_DETS), clue: true, kind: 'det' }, ...pluralPieces(s.pl)] }
      : { plural, pieces: [{ t: det, clue: true, kind: 'det' }, { t: noun }] };
  }
  // une petite phrase avec un verbe en -er (« Les lapins mangent une carotte. »)
  const s = pick(SUBJECTS.filter((x) => !x.sg.includes('’') && !x.sg.endsWith(x.pl)));
  const a = pick(ACTIONS.filter((x) => x.pl.split(' ')[0] === `${x.sg.split(' ')[0]}nt`));
  const [det, noun] = s.sg.split(' ');
  const verb = a.sg.split(' ')[0];
  const rest = { t: `${a.sg.slice(verb.length + 1)}.` };
  return plural
    ? { plural, pieces: [{ t: cap(pick(['les', 'les', 'deux', 'trois'])), clue: true, kind: 'det' }, ...pluralPieces(s.pl), { t: verb }, { t: 'nt', clue: true, glue: true, kind: 'verbe' }, rest] }
    : { plural, pieces: [{ t: cap(det), clue: true, kind: 'det' }, { t: noun }, { t: verb }, rest] };
}

const groupText = (g) => g.pieces.reduce((acc, p, i) => acc + (i && !p.glue ? ' ' : '') + p.t, '');

// La petite règle qui résume les indices trouvés
function clueRule(g) {
  const det = g.pieces.find((p) => p.kind === 'det').t.toLowerCase();
  if (!g.plural) return `« ${det} » → il n’y en a qu’un. Et pas de s à la fin${g.pieces.length > 2 ? ', ni de « nt » au verbe' : ''} !`;
  const fin = g.pieces.find((p) => p.kind === 'fin').t;
  const verbe = g.pieces.some((p) => p.kind === 'verbe');
  return `Les indices du pluriel : « ${det} » + le « ${fin} » à la fin${verbe ? ' + « nt » au verbe' : ''} !`;
}

// ================= Types d'étapes =================
const ROOM_TYPES = {
  // 📖 Lire une phrase et trouver l'île qui l'illustre
  phrase: {
    subject: 'lecture',
    make: (level) => makeSentence(level),
    instruction: () => 'Lis la phrase, puis navigue vers l’île qui montre la même chose !',
    hint: (q) => ({ show: 'Écoute bien la phrase 👂', say: q.text }),
    render(body, q, api) {
      body.append(h(`<div class="sentence">${q.text}</div>`));
      const items = shuffle([{ ...q.correct, ok: true }, ...q.distractors]).map((o) => ({ correct: !!o.ok, html: sceneHTML(o) }));
      buildIslands(body, items, api);
    },
  },

  // 📖 Lire des mots qui se ressemblent et trouver le bon
  mot: {
    subject: 'lecture',
    make() {
      const w = pick(WORDS);
      return { e: w[0], answer: w[1], options: shuffle(w.slice(1)) };
    },
    instruction: () => 'Regarde l’image. Sur quelle île est écrit le bon mot ?',
    hint: (q) => ({ show: 'Écoute le mot 👂', say: q.answer }),
    render(body, q, api) {
      body.append(h(`<div class="big-emoji">${q.e}</div>`));
      buildIslands(body, q.options.map((o) => ({ correct: o === q.answer, html: `<div class="word" style="--len:${o.length}">${o}</div>` })), api);
    },
  },

  // 📖 Repêcher les mots d'une phrase dans l'ordre
  ordreMots: {
    subject: 'lecture',
    make(level) {
      const q = makeSentence(level);
      q.words = q.text.split(' ');
      return q;
    },
    instruction: () => 'Repêche les mots dans l’ordre pour écrire la phrase de l’image !',
    hint: (q) => ({ show: 'Écoute la phrase 👂 Le premier mot a une majuscule !', say: q.text }),
    render(body, q, api) {
      body.append(h(sceneHTML(q.correct, 'big')));
      const slots = h(`<div class="slots">${q.words.map(() => '<span class="slot"></span>').join('')}</div>`);
      const pool = h('<div class="pool"></div>');
      let order;
      do { order = shuffle(q.words); } while (order.join(' ') === q.words.join(' '));
      let pos = 0;
      order.forEach((w, i) => {
        const b = h(`<button class="tile" style="--i:${i}">${w}</button>`);
        b.addEventListener('click', () => {
          if (pos >= q.words.length) return;
          if (q.words[pos] === w) {
            const slot = slots.children[pos];
            slot.textContent = w;
            slot.classList.add('filled');
            b.classList.add('used');
            b.disabled = true;
            SFX.pop();
            pos++;
            if (pos === q.words.length) {
              slots.classList.add('complete');
              setTimeout(() => api.success(), 450);
            }
          } else {
            restart(b, 'shake');
            api.fail();
          }
        });
        pool.append(b);
      });
      body.append(slots, pool);
    },
  },

  // 📖 CE1 : singulier ou pluriel ? puis trouver les indices qui le montrent
  indices: {
    subject: 'lecture',
    make() {
      const plurals = shuffle([true, false, Math.random() < 0.6]);
      return { phase: 'choix', items: plurals.map((p, i) => makeGroup(p, i === 2 && Math.random() < 0.6)) };
    },
    instruction: () => 'Singulier ou pluriel ? Lis bien, puis choisis l’île !',
    hint: (q) => (q.phase === 'choix'
      ? { show: 'Regarde le petit mot devant et la fin des mots 👀', say: 'Regarde le petit mot devant, et la fin des mots.' }
      : { show: 'Les indices : le petit mot devant (le, la, un, les, des…) et les lettres à la fin (s, x, nt).', say: 'Les indices, ce sont le petit mot devant, et les lettres à la fin : s, x, ou n t.' }),
    render(body, q, api) {
      let idx = 0;
      let busy = false;
      const card = h('<div class="clue-card"><span class="tri-count"></span><div class="sentence clue-text"></div><div class="clue-rule hidden"></div></div>');
      const text = card.querySelector('.clue-text');
      const count = card.querySelector('.tri-count');
      const rule = card.querySelector('.clue-rule');
      const row = islandsRow(2);
      const isles = [false, true].map((plural, i) => {
        const isle = islandEl(`<div class="tri-label">
          <span class="tri-pic">${plural ? '🐟🐟🐟' : '🐟'}</span>
          <b>${plural ? 'Pluriel' : 'Singulier'}</b>
          <small>${plural ? 'plusieurs' : 'un seul'}</small>
        </div>`, i);
        isle.classList.add('tri-isle');
        isle.addEventListener('click', () => choose(plural, isle));
        row.append(isle);
        return isle;
      });

      function showItem() {
        const g = q.items[idx];
        q.phase = 'choix';
        busy = false;
        count.textContent = `${idx + 1} / ${q.items.length}`;
        text.textContent = groupText(g);
        text.classList.remove('pieces');
        rule.classList.add('hidden');
        row.classList.remove('faded');
        isles.forEach((isl) => isl.classList.remove('chosen-ok'));
        restart(text, 'tri-in');
        if (idx > 0) { api.say('Singulier ou pluriel ? Lis bien, puis choisis l’île !'); }
      }

      function choose(plural, isle) {
        if (busy || q.phase !== 'choix') return;
        const g = q.items[idx];
        if (g.plural !== plural) {
          restart(isle, 'shake');
          api.fail(plural ? 'Non, il n’y en a qu’un seul ! Regarde bien 👀' : 'Non, il y en a plusieurs ! Regarde bien 👀');
          return;
        }
        SFX.pop();
        isle.classList.add('chosen-ok');
        row.classList.add('faded');
        startClues(g);
      }

      // 2e temps : toucher les indices dans les mots
      function startClues(g) {
        q.phase = 'indices';
        const total = g.pieces.filter((p) => p.clue).length;
        let found = 0;
        text.classList.add('pieces');
        text.innerHTML = '';
        g.pieces.forEach((p, i) => {
          const b = h(`<button class="piece ${p.glue ? 'glue' : ''}">${esc(p.t)}</button>`);
          if (i && !p.glue) text.append(document.createTextNode(' '));
          b.addEventListener('click', async () => {
            if (busy || b.classList.contains('found')) return;
            if (!p.clue) {
              restart(b, 'shake');
              api.fail('Ce morceau-là ne change pas entre un et plusieurs. Cherche ailleurs !');
              return;
            }
            b.classList.add('found', `k-${p.kind}`);
            SFX.unlock();
            found++;
            if (found < total) {
              api.say(`Oui ! Encore ${total - found} indice${total - found > 1 ? 's' : ''} à trouver 🔍`);
              return;
            }
            busy = true;
            rule.textContent = `✨ ${clueRule(g)}`;
            rule.classList.remove('hidden');
            restart(rule, 'tri-in');
            speak(clueRule(g).replace(/«|»/g, ''));
            await sleep(2600);
            idx++;
            if (idx >= q.items.length) api.success();
            else showItem();
          });
          text.append(b);
        });
        const msg = g.plural
          ? `Oui, c’est le pluriel ! Qu’est-ce qui te le dit ? Touche les ${total} indices.`
          : 'Oui, c’est le singulier ! Qu’est-ce qui te le dit ? Touche l’indice.';
        api.say(msg);
        speak(msg);
      }

      body.append(card, row);
      showItem();
    },
  },

  // 🔢 Nombre -> représentation en dizaines / unités
  dizaines: {
    subject: 'maths',
    make: (level) => {
      const n = level === 'CE1' ? rand(21, 99) : rand(11, 59);
      return { n, options: numberOptions(n, level === 'CE1' ? 4 : 3) };
    },
    instruction: (q) => `Quelle île montre le nombre ${q.n} ?`,
    hint: (q) => ({ show: `Une barre = 10, un cube = 1. ${q.n} c’est ${duText(q.n)}.`, say: `Une barre vaut dix, un cube vaut un. ${q.n}, c'est ${duText(q.n)}.` }),
    render(body, q, api) {
      body.append(h(`<div class="big-number">${q.n}</div>`));
      buildIslands(body, q.options.map((o) => ({ correct: o === q.n, html: blocksHTML(o) })), api);
    },
  },

  // 🔢 Dizaines / unités -> nombre
  blocs: {
    subject: 'maths',
    make: (level) => {
      const n = level === 'CE1' ? rand(21, 99) : rand(11, 59);
      return { n, asText: level === 'CE1' && Math.random() < 0.4, options: numberOptions(n, 3) };
    },
    instruction: (q) => q.asText ? 'Lis bien, puis navigue vers le bon nombre !' : 'Compte les barres de dix et les cubes. Quelle île a le bon nombre ?',
    hint: () => ({ show: 'Les dizaines s’écrivent à gauche, les unités à droite ✋', say: 'Compte d’abord les dizaines, elles s’écrivent à gauche. Puis les unités, à droite.' }),
    render(body, q, api) {
      body.append(q.asText
        ? h(`<div class="sentence">${duText(q.n)}</div>`)
        : h(`<div class="blocks-card">${blocksHTML(q.n, 'large')}</div>`));
      buildIslands(body, q.options.map((o) => ({ correct: o === q.n, html: `<div class="isle-number">${o}</div>` })), api);
    },
  },

  // 🔢 Charger la cale avec des barres de 10 et des cubes
  coffre: {
    subject: 'maths',
    make: (level) => ({ n: level === 'CE1' ? rand(21, 99) : rand(11, 49) }),
    instruction: (q) => `Charge exactement ${q.n} cubes dans la cale, puis lève l’ancre !`,
    hint: (q) => ({ show: `${q.n} = ${duText(q.n)}`, say: `${q.n}, c'est ${duText(q.n)}.` }),
    render(body, q, api) {
      let d = 0;
      let u = 0;
      let solved = false;
      const el = h(`<div class="vault">
        <div class="big-number">🎯 ${q.n}</div>
        <div class="vault-box"><div class="blocks large"><div class="tens"></div><div class="units"></div></div></div>
        <div class="du">
          <div class="du-col d"><span>dizaines</span><b class="dcount">0</b></div>
          <div class="du-col u"><span>unités</span><b class="ucount">0</b></div>
        </div>
        <div class="vault-btns">
          <button class="btn add-ten"><span class="blocks mini"><span class="ten">${'<i></i>'.repeat(10)}</span></span> + 10</button>
          <button class="btn add-unit"><span class="blocks mini"><i class="unit"></i></span> + 1</button>
        </div>
        <div class="vault-btns">
          <button class="btn ghost reset">↺ Vider</button>
          <button class="btn go check">Lever l’ancre ⚓</button>
        </div>
        <p class="vault-tip">Touche un bloc dans la cale pour l’enlever.</p>
      </div>`);
      const box = el.querySelector('.vault-box');
      const tensEl = el.querySelector('.vault-box .tens');
      const unitsEl = el.querySelector('.vault-box .units');
      function draw(anim) {
        tensEl.innerHTML = Array.from({ length: d }, () => `<span class="ten">${'<i></i>'.repeat(10)}</span>`).join('');
        unitsEl.innerHTML = '<i class="unit"></i>'.repeat(u);
        el.querySelector('.dcount').textContent = d;
        el.querySelector('.ucount').textContent = u;
        if (anim === 'ten' && tensEl.lastElementChild) tensEl.lastElementChild.classList.add('drop');
        if (anim === 'unit' && unitsEl.lastElementChild) unitsEl.lastElementChild.classList.add('drop');
        if (anim === 'merge' && tensEl.lastElementChild) tensEl.lastElementChild.classList.add('flash');
      }
      tensEl.addEventListener('click', (e) => { if (!solved && e.target.closest('.ten')) { d--; SFX.click(); draw(); } });
      unitsEl.addEventListener('click', (e) => { if (!solved && e.target.closest('.unit')) { u--; SFX.click(); draw(); } });
      el.querySelector('.add-ten').addEventListener('click', () => {
        if (solved) return;
        if (d >= 9) { api.say('La cale est pleine de dizaines !'); return; }
        d++; SFX.pop(); draw('ten');
      });
      el.querySelector('.add-unit').addEventListener('click', () => {
        if (solved) return;
        if (u === 9) {
          if (d >= 9) { api.say('La cale est pleine !'); return; }
          u = 0; d++; SFX.magic(); draw('merge');
          api.say('✨ 10 unités = 1 dizaine ! Elles se sont collées !');
          speak('Dix unités, ça fait une dizaine !');
          return;
        }
        u++; SFX.pop(); draw('unit');
      });
      el.querySelector('.reset').addEventListener('click', () => { if (!solved) { d = 0; u = 0; SFX.click(); draw(); } });
      el.querySelector('.check').addEventListener('click', () => {
        if (solved) return;
        const got = d * 10 + u;
        if (got === q.n) {
          solved = true;
          box.classList.add('open');
          SFX.unlock();
          setTimeout(() => api.success(), 500);
        } else {
          restart(box, 'shake');
          api.fail(`Tu as chargé ${got}. Il en faut ${q.n} ! ${got < q.n ? 'Ajoute' : 'Enlève'} des cubes.`);
        }
      });
      body.append(el);
    },
  },

  // 🔢 Calcul mental
  calcul: {
    subject: 'maths',
    make(level) {
      let a;
      let b;
      let op = '+';
      const k = Math.random();
      if (level === 'CP') {
        if (k < 0.45) { a = rand(1, 9); b = rand(1, 9); }
        else if (k < 0.65) { a = 10; b = rand(1, 9); if (Math.random() < 0.5) [a, b] = [b, a]; }
        else if (k < 0.8) { a = b = rand(1, 10); }
        else { op = '-'; a = rand(5, 12); b = rand(1, Math.min(5, a - 1)); }
      } else if (k < 0.25) { a = rand(2, 8) * 10 + rand(0, 5); b = rand(1, 9 - (a % 10)); }
      else if (k < 0.42) { a = rand(1, 5) * 10; b = rand(1, 4) * 10; }
      else if (k < 0.57) { a = rand(11, 89); b = 10; }
      else if (k < 0.72) { a = rand(6, 9); b = rand(5, 9); }
      else if (k < 0.86) { op = '-'; a = rand(20, 99); b = 10; }
      else { op = '-'; a = rand(2, 9) * 10 + rand(5, 9); b = rand(1, a % 10); }
      const ans = op === '+' ? a + b : a - b;
      const near = shuffle([ans + 1, ans - 1, ans + 2, ans - 2]);
      if (ans >= 20) near.unshift(pick([ans + 10, ans - 10]));
      const options = [ans];
      for (const x of near) if (options.length < (level === 'CE1' ? 4 : 3) && x >= 0 && !options.includes(x)) options.push(x);
      return { a, b, op, ans, options: shuffle(options), small: a <= 10 && b <= 10 };
    },
    instruction: (q) => `Combien font ${q.a} ${q.op === '+' ? 'plus' : 'moins'} ${q.b} ? Navigue vers la bonne île !`,
    hint(q) {
      if (q.small) {
        const dots = q.op === '+'
          ? `${'<span>🔵</span>'.repeat(q.a)} + ${'<span>🟠</span>'.repeat(q.b)}`
          : `${'<span>🔵</span>'.repeat(q.a - q.b)}${'<span class="cross">🔵</span>'.repeat(q.b)}`;
        return { show: 'Compte les ronds avec ton doigt ☝️', say: 'Compte les ronds avec ton doigt.', html: `<div class="dots">${dots}</div>` };
      }
      return { show: 'Commence par les dizaines, puis les unités 💪', say: 'Commence par les dizaines, puis les unités.' };
    },
    render(body, q, api) {
      const op = h(`<div class="big-number">${q.a} ${q.op === '+' ? '+' : '−'} ${q.b} = <span class="qmark">?</span></div>`);
      body.append(op);
      buildIslands(body, q.options.map((o) => ({ correct: o === q.ans, html: `<div class="isle-number">${o}</div>` })), api, () => {
        op.querySelector('.qmark').outerHTML = `<span class="ans">${q.ans}</span>`;
      });
    },
  },

  // 📚 Mot du jour : écouter le mot et trouver l'île où il est écrit
  ecouteMot: {
    subject: 'lecture',
    make() {
      const word = pickDailyWord();
      const listen = canSpeak();
      return { word, listen, options: shuffle([word, ...wordTraps(word, listen, 2)]) };
    },
    instruction: (q) => q.listen
      ? 'Mot du jour ! Écoute bien le mot, puis navigue vers l’île où il est écrit.'
      : 'Mot du jour ! Trouve l’île où est écrit le même mot.',
    hint: (q) => ({ show: `Le mot commence par « ${q.word[0]} » 👀`, say: q.word }),
    track: (q, firstTry) => recordWord(q.word, firstTry),
    render(body, q, api) {
      if (q.listen) {
        const btn = h('<button class="listen-btn" title="Réécouter le mot">🔊<small>Écoute</small></button>');
        btn.addEventListener('click', () => { restart(btn, 'bump'); speak(q.word, { rate: 0.75 }); });
        body.append(btn);
        setTimeout(() => speak(q.word, { queue: true, rate: 0.75 }), 500);
      } else {
        body.append(h(`<div class="sentence daily-word">${q.word}</div>`));
      }
      buildIslands(body, q.options.map((o) => ({ correct: o === q.word, html: `<div class="word" style="--len:${Math.max(o.length, 4)}">${o}</div>` })), api);
    },
  },

  // 📚 Mot du jour : compléter une phrase à trou
  phraseTrou: {
    subject: 'lecture',
    make() {
      const withSentences = dailyWords().filter((w) => WORD_BANK[w]);
      const word = pickDailyWord(withSentences.length ? withSentences : null);
      const bank = WORD_BANK[word];
      if (!bank) return ROOM_TYPES.ecouteMot.make();
      const [text, pic] = pick(bank.sentences);
      const atStart = text.startsWith('___');
      const fmt = (w) => (atStart ? cap(w) : w);
      return { word, text, pic, fmt, options: shuffle([word, ...shuffle(bank.near).slice(0, 2)]) };
    },
    instruction: (q) => q.text
      ? 'Mot du jour ! Quel mot manque dans la phrase ? Navigue vers la bonne île.'
      : ROOM_TYPES.ecouteMot.instruction(q),
    hint: (q) => (q.text
      ? { show: 'Écoute la phrase entière 👂', say: q.text.replace('___', q.word) }
      : ROOM_TYPES.ecouteMot.hint(q)),
    track: (q, firstTry) => recordWord(q.word, firstTry),
    render(body, q, api) {
      if (!q.text) { ROOM_TYPES.ecouteMot.render(body, q, api); return; }
      body.append(h(`<div class="big-emoji small">${q.pic}</div>`));
      const sentence = h(`<div class="sentence">${q.text.replace('___', '<span class="blank">?</span>')}</div>`);
      body.append(sentence);
      buildIslands(body, q.options.map((o) => ({ correct: o === q.word, html: `<div class="word" style="--len:${Math.max(o.length, 4)}">${q.fmt(o)}</div>` })), api, () => {
        const b = sentence.querySelector('.blank');
        b.textContent = q.fmt(q.word);
        b.classList.add('filled');
      });
    },
  },

  // 🔢 Ranger des nombres : allumer les lanternes
  ordre: {
    subject: 'maths',
    make(level) {
      const ce1 = level === 'CE1';
      const set = new Set();
      if (ce1) {
        const a = rand(1, 9);
        let b = rand(1, 9);
        while (b === a) b = rand(1, 9);
        set.add(a * 10 + b);
        set.add(b * 10 + a);
      }
      while (set.size < (ce1 ? 5 : 4)) set.add(ce1 ? rand(10, 99) : rand(1, 40));
      const nums = [...set];
      const desc = ce1 && Math.random() < 0.4;
      return { nums: shuffle(nums), desc, target: [...nums].sort((x, y) => (desc ? y - x : x - y)) };
    },
    instruction: (q) => q.desc
      ? 'Allume les lanternes : touche les bouées du plus GRAND au plus petit !'
      : 'Allume les lanternes : touche les bouées du plus petit au plus grand !',
    hint: (q) => ({
      show: `Cherche le plus ${q.desc ? 'grand' : 'petit'} nombre qui reste. Regarde d’abord les dizaines 👀`,
      say: `Cherche le plus ${q.desc ? 'grand' : 'petit'} nombre qui reste. Regarde d'abord les dizaines.`,
    }),
    render(body, q, api) {
      const row = h(`<div class="torches">${q.target.map(() => '<div class="torch"><span class="flame">🏮</span><span class="tval">?</span></div>').join('')}</div>`);
      const label = h(`<div class="order-hint">${q.desc ? 'plus grand ➜ plus petit' : 'plus petit ➜ plus grand'}</div>`);
      const pool = h(`<div class="stones">${q.nums.map((n, i) => `<button class="stone" style="--i:${i}"><span>${n}</span></button>`).join('')}</div>`);
      let pos = 0;
      pool.querySelectorAll('.stone').forEach((b) => b.addEventListener('click', () => {
        if (pos >= q.target.length) return;
        const n = Number(b.textContent);
        if (n === q.target[pos]) {
          const t = row.children[pos];
          t.classList.add('lit');
          t.querySelector('.tval').textContent = n;
          b.classList.add('gone');
          SFX.pop();
          pos++;
          if (pos === q.target.length) setTimeout(() => api.success(), 450);
        } else {
          b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-12px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }], { duration: 400 });
          api.fail();
        }
      }));
      body.append(row, label, pool);
    },
  },
};

const READING_TYPES = ['phrase', 'mot', 'ordreMots'];
const DAILY_TYPES = ['ecouteMot', 'phraseTrou'];

// ================= Mots du jour =================
function dailyWords() {
  const list = String(S.dailyWords || '').toLowerCase().split(/[\s,;]+/).map((w) => w.trim()).filter(Boolean);
  return [...new Set(list)];
}

// Les mots ratés reviennent plus souvent, ceux déjà bien sus un peu moins
function pickDailyWord(pool) {
  const words = pool || dailyWords();
  if (!words.length) return 'le';
  const weights = words.map((w) => {
    const st = S.wordStats[w] || { ok: 0, ko: 0 };
    return Math.max(0.3, 1 + st.ko * 1.5 - Math.min(st.ok, 4) * 0.2);
  });
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < words.length; i++) {
    r -= weights[i];
    if (r <= 0) return words[i];
  }
  return words[words.length - 1];
}

function recordWord(word, firstTry) {
  const st = S.wordStats[word] || { ok: 0, ko: 0 };
  if (firstTry) st.ok++; else st.ko++;
  S.wordStats[word] = st;
  save();
}

// Mots « pièges » qui se ressemblent (sans homophone si on écoute le mot)
function wordTraps(word, listen, count) {
  const homo = HOMOPHONES.find((g) => g.includes(word)) || [];
  const ok = (w) => w !== word && !(listen && homo.includes(w));
  let traps = shuffle(((WORD_BANK[word] || {}).near || []).filter(ok));
  if (traps.length < count) {
    const others = dailyWords().filter((w) => ok(w) && !traps.includes(w));
    const close = others.filter((w) => w[0] === word[0] || Math.abs(w.length - word.length) <= 1);
    traps = traps.concat(shuffle(close), shuffle(others.filter((w) => !close.includes(w))));
  }
  return traps.slice(0, count);
}

function wordMastery(w) {
  const st = S.wordStats[w];
  if (!st) return 'new';
  if (st.ok >= 3 && st.ok > st.ko * 2) return 'good';
  return st.ko > st.ok ? 'hard' : 'learning';
}
const MATHS_TYPES = ['dizaines', 'blocs', 'coffre', 'calcul', 'ordre'];

// Tire des types en évitant les répétitions trop rapprochées
function drawer(types) {
  let bag = [];
  return () => {
    if (!bag.length) bag = shuffle(types);
    return bag.pop();
  };
}

const PLURAL_TYPES = ['indices'];

function buildSequence(mode, count) {
  const r = drawer(S.level === 'CE1' ? READING_TYPES.concat(PLURAL_TYPES) : READING_TYPES);
  const m = drawer(MATHS_TYPES);
  const seq = Array.from({ length: count }, (_, i) => {
    if (mode === 'lecture') return r();
    if (mode === 'maths') return m();
    return i % 2 === 0 ? r() : m();
  });
  // les mots du jour reviennent à chaque voyage
  if (!dailyWords().length) return seq;
  if (mode === 'maths') seq[2] = pick(DAILY_TYPES);
  else if (mode === 'lecture') { seq[0] = 'ecouteMot'; seq[2] = 'phraseTrou'; seq[4] = pick(DAILY_TYPES); }
  else { seq[0] = 'ecouteMot'; seq[4] = 'phraseTrou'; }
  // CE1 : le singulier / pluriel revient souvent
  if (S.level === 'CE1' && mode !== 'maths') {
    if (mode === 'lecture') seq[1] = pick(PLURAL_TYPES);
    else if (!PLURAL_TYPES.includes(seq[2]) && Math.random() < 0.6) seq[2] = pick(PLURAL_TYPES);
  }
  return seq;
}

// ================= Écran d'accueil =================
function renderHome() {
  setTheme(null);
  const seg = (key, opts) => `<div class="seg" data-key="${key}">${opts.map(([v, label]) =>
    `<button data-v="${v}" class="${S[key] === v ? 'sel' : ''}">${label}</button>`).join('')}</div>`;
  app.innerHTML = `<section class="home">
    <div class="home-icons">⛵🏝️🧭</div>
    <h1 class="title">Les Îles<br><span>Magiques</span></h1>
    <p class="subtitle">Navigue d’île en île pour trouver les trésors !</p>
    ${profSays(esc(profLine('hello')), 'happy')}
    <div class="card setup">
      <label class="field"><span>Ton prénom</span><input id="name" maxlength="14" autocomplete="off" value="${esc(S.name)}"></label>
      <div class="field"><span>🗣️ Ça se prononce <small>(écris-le comme ça se dit)</small></span>
        <div class="voice-pick"><input id="name-say" maxlength="20" autocomplete="off" value="${esc(S.nameSay)}" placeholder="${esc(S.name)}"><button class="seg-btn test-name" type="button">▶️ Écouter</button></div>
      </div>
      <div class="field"><span>Ton bateau</span>
        <div class="boat-maker">
          <div class="boat-preview"><div class="mini-sea"></div>${boatSVG(S.boat)}</div>
          <div class="boat-opts">
            <div class="opt-row" data-k="pattern"><em>Voile</em>${BOAT_OPTIONS.pattern.map(([v, l]) =>
              `<button class="chip ${S.boat.pattern === v ? 'sel' : ''}" data-v="${v}">${l}</button>`).join('')}</div>
            ${[['hull', 'Coque'], ['sail', 'Tissu']].map(([k, l]) => `<div class="opt-row" data-k="${k}"><em>${l}</em>${BOAT_OPTIONS[k].map((c) =>
              `<button class="swatch ${S.boat[k] === c ? 'sel' : ''}" data-v="${c}" style="background:${c}" aria-label="${l}"></button>`).join('')}</div>`).join('')}
          </div>
        </div>
      </div>
      <div class="field"><span>Ta classe</span>${seg('level', [['CP', 'CP'], ['CE1', 'CE1']])}</div>
      <label class="field"><span>📚 Mots du jour à travailler <small>(séparés par des espaces)</small></span>
        <textarea id="daily" rows="3" spellcheck="false">${esc(dailyWords().join(' '))}</textarea>
      </label>
      <div class="field"><span>Les épreuves</span>${seg('mode', [['mix', '🎲 Les deux'], ['lecture', '📖 Lecture'], ['maths', '🔢 Maths']])}</div>
      <div class="field"><span>Ton professeur</span>
        <div class="prof-pick">${Object.entries(PROFS).map(([id, p]) => `<button class="prof-card ${S.prof === id ? 'sel' : ''}" data-id="${id}">
          <span class="prof-mini">${profSVG('idle', id)}</span><b>${p.name}</b><small>${p.desc}</small></button>`).join('')}</div>
        <div class="voice-pick"><select id="voice-name" aria-label="Voix du professeur"></select><button class="seg-btn test-voice" type="button">▶️ Écouter</button></div>
      </div>
      <div class="field"><span>Le son</span>${seg('sound', [[true, '🔔 Bruitages'], [false, '🔕 Sans bruitages']])}${seg('voice', [[true, '🗣️ Voix qui lit les consignes'], [false, '🤫 Sans voix']])}</div>
    </div>
    <button class="btn big pulse go-btn">Larguer les amarres ! ⛵</button>
  </section>`;

  app.querySelector('#name').addEventListener('input', (e) => { S.name = e.target.value.trim(); S.nameSay = ''; save();
    const say = app.querySelector('#name-say'); say.value = ''; say.placeholder = S.name;
  });
  app.querySelector('#name-say').addEventListener('input', (e) => { S.nameSay = e.target.value.trim(); save(); });
  app.querySelector('.test-name').addEventListener('click', () => speak(`Bravo ${S.name} !`));
  app.querySelector('#daily').addEventListener('input', (e) => { S.dailyWords = e.target.value; save(); });
  app.querySelectorAll('.opt-row').forEach((row) => row.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    S.boat[row.dataset.k] = b.dataset.v; save(); SFX.pop();
    row.querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b));
    const prev = app.querySelector('.boat-preview');
    prev.innerHTML = `<div class="mini-sea"></div>${boatSVG(S.boat)}`;
    restart(prev, 'happy');
  })));
  app.querySelectorAll('.seg').forEach((g) => g.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    const key = g.dataset.key;
    const raw = b.dataset.v;
    S[key] = raw === 'true' ? true : raw === 'false' ? false : raw;
    save(); SFX.click();
    g.querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b));
  })));
  app.querySelector('.go-btn').addEventListener('click', () => { SFX.good(); renderMap(); });

  const voiceSel = app.querySelector('#voice-name');
  const helloProf = () => speak(`Bonjour ${S.name || ''} ! Je suis ${curProf().intro}.`);
  const fillVoices = () => {
    const voices = frenchVoices();
    const cur = voiceFor(S.prof);
    voiceSel.innerHTML = voices.length
      ? voices.map((v) => `<option value="${esc(v.name)}" ${v === cur ? 'selected' : ''}>${esc(v.name.replace(/ \(français.*\)$/, ''))}${v.lang.toLowerCase() === 'fr-ca' ? ' 🇨🇦' : ''}</option>`).join('')
      : '<option>Aucune voix française trouvée</option>';
  };
  fillVoices();
  if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', fillVoices);
  voiceSel.addEventListener('change', () => {
    S.profVoices[S.prof] = voiceSel.value; save();
    helloProf();
  });
  app.querySelector('.test-voice').addEventListener('click', () => {
    if (!S.voice) { S.voice = true; save(); renderHome(); }
    helloProf();
  });
  app.querySelectorAll('.prof-card').forEach((c) => c.addEventListener('click', () => {
    S.prof = c.dataset.id; save(); SFX.pop();
    app.querySelectorAll('.prof-card').forEach((x) => x.classList.toggle('sel', x === c));
    profMood(c, 'happy');
    app.querySelector('.home > .prof-talk').outerHTML = profSays(esc(profLine('hello')), 'happy');
    fillVoices();
    helloProf();
  }));
}

// ================= Carte des mers =================
function totalStars() {
  return Object.values(S.worlds).reduce((t, w) => t + (w.best || 0), 0);
}
function isUnlocked(i) {
  return i === 0 || !!(S.worlds[WORLDS[i - 1].id] || {}).done;
}

function renderMap() {
  setTheme(null);
  const max = STEPS_PER_WORLD * 3;
  const nextIdx = WORLDS.findIndex((w, i) => isUnlocked(i) && !(S.worlds[w.id] || {}).done);
  app.innerHTML = `<section class="map">
    <header class="map-head">
      <button class="icon-btn" id="btn-home" title="Réglages">⚙️</button>
      <div class="hello"><span class="hello-av">${boatSVG(S.boat)}</span> Ahoy ${esc(S.name || 'moussaillon')} !</div>
      <div class="star-count">⭐ ${totalStars()}</div>
    </header>
    ${dailyWords().length ? `<div class="words-board">
      <b>📚 Mes mots du jour</b>
      <div class="word-chips">${dailyWords().map((w) => `<span class="wchip ${wordMastery(w)}">${esc(w)}</span>`).join('')}</div>
      <small><span class="wchip good">bien su</span> <span class="wchip learning">en cours</span> <span class="wchip hard">à revoir</span></small>
    </div>` : ''}
    ${profSays(esc(profLine('map')))}
    <h2>Choisis ta mer</h2>
    <div class="worlds">${WORLDS.map((w, i) => {
      const prog = S.worlds[w.id] || {};
      const open = isUnlocked(i);
      return `<button class="world-card ${open ? '' : 'locked'} ${i === nextIdx ? 'next' : ''}" data-i="${i}" style="--c1:${w.c1};--c2:${w.c2};--i:${i}">
        <span class="w-emoji">${w.emoji}</span>
        <span class="w-name">${w.name}</span>
        <span class="w-stars">${open ? (prog.done ? `⭐ ${prog.best} / ${max}` : 'À explorer !') : 'Termine la mer d’avant'}</span>
        <span class="w-reward">${open ? (prog.done ? w.reward : '❔') : '🔒'}</span>
      </button>`;
    }).join('')}</div>
  </section>`;
  app.querySelector('#btn-home').addEventListener('click', () => { SFX.click(); renderHome(); });
  app.querySelectorAll('.world-card').forEach((c) => c.addEventListener('click', () => {
    const i = Number(c.dataset.i);
    if (!isUnlocked(i)) {
      restart(c, 'shake'); SFX.bad();
      profMood(app, 'oops');
      speak('Cette mer est encore fermée. Termine la mer d’avant pour l’ouvrir !');
      return;
    }
    SFX.good();
    startWorld(WORLDS[i]);
  }));
}

// ================= Le voyage dans une mer =================
let RUN = null;

const currentZone = () => document.querySelector('#zone-wrap .zone.current');
const stillHere = (run) => RUN === run && !!document.getElementById('stage');

function buildZone(z) {
  const items = z.items.map(([e, x, y, size, anim, rot]) =>
    `<span class="deco ${anim ? `a-${anim}` : ''}" style="left:${x}%;top:${y}%;font-size:${size}vmin;--r:${rot || 0}deg;animation-delay:-${(Math.random() * 4).toFixed(1)}s">${e}</span>`
  ).join('');
  return h(`<div class="zone" style="--sky1:${z.sky[0]};--sky2:${z.sky[1]};--sea1:${z.sea[0]};--sea2:${z.sea[1]}">
    <div class="sky"></div>
    <div class="sea"><div class="waves w1"></div><div class="waves w2"></div><div class="waves w3"></div></div>
    <div class="decos">${items}</div>
  </div>`);
}

async function slideToZone(z) {
  const wrap = document.getElementById('zone-wrap');
  const old = currentZone();
  const next = buildZone(z);
  next.classList.add('incoming');
  wrap.append(next);
  void next.offsetWidth;
  wrap.classList.add('sailing');
  SFX.whoosh();
  old.classList.remove('current');
  old.classList.add('outgoing');
  next.classList.remove('incoming');
  next.classList.add('current');
  await sleep(1400);
  old.remove();
  wrap.classList.remove('sailing');
}

async function showStepBanner() {
  const last = RUN.index >= RUN.steps.length;
  const el = h(`<div class="room-banner">
    <small>${last ? '🎁 Dernière étape' : `Étape ${RUN.index + 1} sur ${RUN.steps.length}`}</small>
    <b>${last ? 'L’île au trésor' : RUN.steps[RUN.index].name}</b>
  </div>`);
  document.body.append(el);
  SFX.magic();
  await sleep(1700);
  el.remove();
}

function startWorld(w) {
  const run = {
    w,
    steps: buildSequence(S.mode, STEPS_PER_WORLD).map((type, i) => ({ type, name: w.steps[i] })),
    index: 0, stars: 0, streak: 0, busy: true, zone: ZONES[w.id][0],
  };
  RUN = run;
  setTheme(w);
  document.getElementById('decor').innerHTML = '';
  app.innerHTML = `<section class="voyage-screen">
    <div id="zone-wrap"></div>
    <header class="topbar">
      <button class="icon-btn" id="btn-map" title="Carte">🗺️</button>
      <div class="track" id="track"></div>
      <div id="streak"></div>
      <div class="star-count" id="run-stars">⭐ 0</div>
      <button class="icon-btn" id="btn-sound" title="Son"></button>
    </header>
    <main class="stage away" id="stage"></main>
    <div class="boat" id="boat"><span class="wake"></span>${boatSVG(S.boat)}</div>
  </section>`;
  const first = buildZone(run.zone);
  first.classList.add('current');
  document.getElementById('zone-wrap').append(first);

  const n = run.steps.length;
  document.getElementById('track').innerHTML =
    '<div class="track-line"><div class="track-fill"></div></div>' +
    run.steps.map((_, i) => `<div class="node" style="left:${(i / n) * 100}%">${i + 1}</div>`).join('') +
    `<div class="node chest-node" style="left:100%">🏝️</div><div class="track-avatar" style="left:0%">${boatSVG(S.boat)}</div>`;
  updateTrack(false);

  const soundBtn = document.getElementById('btn-sound');
  const paintSound = () => { soundBtn.textContent = S.sound || S.voice ? '🔊' : '🔇'; };
  paintSound();
  soundBtn.addEventListener('click', () => {
    const on = !(S.sound || S.voice);
    S.sound = on; S.voice = on; save(); paintSound();
    if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
    SFX.click();
  });
  document.getElementById('btn-map').addEventListener('click', confirmQuit);

  // le bateau arrive par le bas de l'écran
  const home = boatHome();
  placeBoat(home.x, -boatEl().offsetHeight);
  (async () => {
    await sleep(200);
    if (!stillHere(run)) return;
    await Promise.all([sailTo(home.x, home.b), showStepBanner()]);
    if (!stillHere(run)) return;
    run.busy = false;
    enterStep();
  })();
}

addEventListener('resize', () => {
  if (!RUN || RUN.busy || !boatEl()) return;
  const p = boatHome();
  placeBoat(p.x, p.b);
});

function updateTrack(move = true) {
  const n = RUN.steps.length;
  const track = document.getElementById('track');
  track.querySelectorAll('.node:not(.chest-node)').forEach((node, i) => {
    node.classList.toggle('done', i < RUN.index);
    node.classList.toggle('current', i === RUN.index);
    node.textContent = i < RUN.index ? '✓' : i + 1;
  });
  track.querySelector('.track-fill').style.width = `${(RUN.index / n) * 100}%`;
  const av = track.querySelector('.track-avatar');
  av.style.left = `${(RUN.index / n) * 100}%`;
  if (move) restart(av, 'sailing');
}

function updateRunStars() {
  const el = document.getElementById('run-stars');
  el.textContent = `⭐ ${RUN.stars}`;
  restart(el, 'bump');
}

function renderStreak() {
  const el = document.getElementById('streak');
  el.innerHTML = RUN.streak >= 2 ? `<div class="streak" title="${RUN.streak} étapes d’affilée sans erreur">🔥 ${RUN.streak}</div>` : '';
}

function confirmQuit() {
  SFX.click();
  const ov = h(`<div class="overlay"><div class="confirm-card">
    <h3>Retourner à la carte ?<br><small>Tu devras recommencer cette mer.</small></h3>
    <div class="row"><button class="btn go stay">Je continue ! 💪</button><button class="btn ghost leave">Oui, quitter</button></div>
  </div></div>`);
  ov.querySelector('.stay').addEventListener('click', () => ov.remove());
  ov.querySelector('.leave').addEventListener('click', () => {
    ov.remove();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    RUN = null;
    renderMap();
  });
  document.body.append(ov);
}

function enterStep() {
  const { w } = RUN;
  const step = RUN.steps[RUN.index];
  const T = ROOM_TYPES[step.type];
  const q = T.make(S.level);
  step.mistakes = 0;
  step.solved = false;

  const el = h(`<div class="room">
    <div class="guide">
      <span class="guide-face prof-face">${profSVG()}</span>
      <div class="bubble">
        <span class="bubble-text"></span>
        <button class="round-btn say" title="Écouter la consigne">🔊</button>
        <button class="round-btn hint hidden" title="Un indice">💡</button>
      </div>
    </div>
    <div class="hint-box hidden"></div>
    <div class="room-body"></div>
  </div>`);
  const stage = document.getElementById('stage');
  stage.replaceChildren(el);
  stage.classList.remove('away');
  scrollTo(0, 0);

  const bubble = el.querySelector('.bubble');
  const bubbleText = el.querySelector('.bubble-text');
  const hintBtn = el.querySelector('.hint');
  const hintBox = el.querySelector('.hint-box');
  const say = (t) => { bubbleText.textContent = t; restart(bubble, 'bump'); };
  const instr = T.instruction(q);
  say(RUN.index === 0 && !RUN.greeted ? `${profLine('start')} ${instr}` : instr);
  RUN.greeted = true;
  setTimeout(() => speak(instr), 300);

  el.querySelector('.say').addEventListener('click', () => speak(bubbleText.textContent));
  hintBtn.addEventListener('click', () => {
    const hi = T.hint(q);
    profMood(el, 'think', 4000);
    say(hi.show);
    speak(hi.say || hi.show);
    if (hi.html) { hintBox.innerHTML = hi.html; hintBox.classList.remove('hidden'); restart(hintBox, 'bump'); }
  });

  const api = {
    say,
    fail(msg) {
      if (step.solved) return;
      step.mistakes++;
      RUN.streak = 0;
      renderStreak();
      SFX.bad();
      boatMood('oops');
      profMood(el, 'oops');
      say(step.mistakes >= 2 && !msg ? profLine('cheer') : msg || pick(OOPS));
      hintBtn.classList.remove('hidden');
    },
    success() {
      if (step.solved) return;
      step.solved = true;
      const stars = step.mistakes === 0 ? 3 : step.mistakes === 1 ? 2 : 1;
      RUN.stars += stars;
      if (step.mistakes === 0) RUN.streak++;
      if (T.track) T.track(q, step.mistakes === 0);
      renderStreak();
      updateRunStars();
      SFX.good();
      boatMood('happy');
      profMood(el, 'happy', 0);
      Confetti.burst(innerWidth / 2, innerHeight * 0.45, 90);
      setTimeout(() => showBravo(stars), 700);
    },
  };
  T.render(el.querySelector('.room-body'), q, api);
}

function showBravo(stars) {
  const isLast = RUN.index === RUN.steps.length - 1;
  const msg = pick(BRAVO).replace(' {name}', S.name ? ` ${S.name}` : '');
  const sub = stars === 3 ? 'Parfait, du premier coup !' : stars === 2 ? 'Bien joué !' : 'Tu as réussi, bravo !';
  const ov = h(`<div class="overlay"><div class="bravo-card">
    <div class="bravo-av">${boatSVG(S.boat, 'happy')}</div>
    <h2 class="bravo-title">${esc(msg)}</h2>
    <div class="bravo-stars">${[0, 1, 2].map((i) => `<span class="bstar ${i < stars ? '' : 'off'}" style="--d:${0.25 + i * 0.28}s">⭐</span>`).join('')}</div>
    <p class="bravo-sub">${sub} ${esc(profLine('bravo'))}</p>
    <span class="bravo-prof">${profSVG('happy')}</span>
    ${RUN.streak >= 3 ? `<p class="bravo-streak">🔥 ${RUN.streak} étapes d’affilée sans erreur !</p>` : ''}
    <button class="btn big go pulse next">${isLast ? 'Vers l’île au trésor ! 🏝️' : 'On met les voiles ! ⛵'}</button>
  </div></div>`);
  document.body.append(ov);
  for (let i = 0; i < stars; i++) setTimeout(() => SFX.star(i), 300 + i * 280);
  speak(msg);
  ov.querySelector('.next').addEventListener('click', () => {
    ov.remove();
    goToNextStep();
  });
}

async function goToNextStep() {
  const run = RUN;
  if (run.busy) return;
  run.busy = true;
  SFX.click();
  document.getElementById('stage').classList.add('away');
  await sleep(300);
  if (!stillHere(run)) return;
  await sailHome();
  if (!stillHere(run)) return;
  run.index++;
  updateTrack();
  const last = run.index >= run.steps.length;
  run.zone = last ? TREASURE_ZONE : ZONES[run.w.id][run.index];
  boatEl().classList.add('cruising');
  await Promise.all([slideToZone(run.zone), sleep(500).then(showStepBanner)]);
  if (!stillHere(run)) return;
  boatEl().classList.remove('cruising');
  run.busy = false;
  if (last) renderTreasure();
  else enterStep();
}

// ================= L'île au trésor =================
function renderTreasure() {
  const { w } = RUN;
  const max = RUN.steps.length * 3;
  const land = LANDS.sand;
  const el = h(`<div class="treasure">
    <h2>L’île au trésor !</h2>
    <p class="tap-msg">Touche le coffre pour l’ouvrir 👇</p>
    <div class="treasure-isle" style="--g1:${land.g1};--g2:${land.g2};--top:${land.top}">
      <span class="ti-palm l">🌴</span><span class="ti-palm r">🌴</span>
      <button class="chest idle" aria-label="Ouvrir le coffre">
        <span class="chest-rays"></span>
        <span class="chest-reward">${w.reward}</span>
        <span class="chest-lid"></span>
        <span class="chest-body"><span class="chest-lock">🔒</span></span>
      </button>
      <span class="ti-land"></span>
    </div>
    <div class="treasure-result hidden"></div>
  </div>`);
  el.querySelector('.tap-msg').insertAdjacentHTML('afterend', profSays('Le trésor est là ! Vas-y, ouvre-le !', 'think', 'treasure-prof'));
  const stage = document.getElementById('stage');
  stage.replaceChildren(el);
  stage.classList.remove('away');
  scrollTo(0, 0);
  speak('Tu es arrivée sur l’île au trésor ! Touche le coffre pour l’ouvrir !');
  RUN.busy = true;
  sleep(400).then(() => sailToIsland(el.querySelector('.treasure-isle'), 0.85));

  const chest = el.querySelector('.chest');
  chest.addEventListener('click', () => {
    if (chest.classList.contains('open')) return;
    chest.classList.remove('idle');
    chest.classList.add('open');
    el.querySelector('.tap-msg').textContent = `Tu as gagné ${w.rewardName} !`;
    el.querySelector('.treasure-prof .bubble-text').textContent = profLine('treasure');
    profMood(el, 'happy', 0);
    SFX.win();
    boatMood('happy');
    setTimeout(() => boatMood('happy'), 1300);
    Confetti.burst(innerWidth / 2, innerHeight * 0.5, 160);
    setTimeout(() => Confetti.rain(180), 400);

    const wIdx = WORLDS.indexOf(w);
    const wasDone = !!(S.worlds[w.id] || {}).done;
    const prev = (S.worlds[w.id] || {}).best || 0;
    S.worlds[w.id] = { done: true, best: Math.max(prev, RUN.stars) };
    save();
    const next = WORLDS[wIdx + 1];
    const unlockedNow = next && !wasDone;

    speak(`Bravo ${S.name || ''} ! Tu as gagné ${w.rewardName} et ${RUN.stars} étoiles !`);
    const res = el.querySelector('.treasure-result');
    res.innerHTML = `
      <div class="card">
        <div class="total">⭐ ${RUN.stars} / ${max}</div>
        ${RUN.stars > prev && wasDone ? '<div>🏅 Nouveau record !</div>' : ''}
        ${unlockedNow ? `<div>🔓 Nouvelle mer ouverte : ${next.emoji} ${next.name} !</div>` : ''}
        ${!next && !wasDone ? '<div>🏆 Tu as exploré toutes les mers ! Capitaine !</div>' : ''}
      </div>
      <div class="row">
        <button class="btn ghost again">↺ Refaire ce voyage</button>
        <button class="btn go big pulse to-map">Carte des mers 🗺️</button>
      </div>`;
    setTimeout(() => res.classList.remove('hidden'), 1300);
    res.querySelector('.again').addEventListener('click', () => { SFX.click(); startWorld(w); });
    res.querySelector('.to-map').addEventListener('click', () => { SFX.good(); RUN = null; renderMap(); });
  });
}

// ================= Démarrage =================
renderHome();
