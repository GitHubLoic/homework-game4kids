// Le Professeur Bulle : poulpe inventeur qui accompagne l'enfant tout le long du jeu
// Humeurs (attribut data-mood) : idle, happy, oops, think — animées en CSS

function profSVG(mood = 'idle') {
  return `<svg class="prof" data-mood="${mood}" viewBox="-72 44 144 166" aria-hidden="true">
    <ellipse class="p-shadow" cx="0" cy="204" rx="46" ry="6"/>
    <g class="p-body">
      <g class="p-legs" fill="none" stroke="#9b62c9" stroke-width="13" stroke-linecap="round">
        <path class="p-leg" d="M-30 138 Q-52 170 -40 198"/>
        <path class="p-leg" d="M-16 142 Q-24 178 -12 200"/>
        <path class="p-leg" d="M0 144 Q4 178 -2 202"/>
        <path class="p-leg" d="M16 142 Q26 176 14 200"/>
        <path class="p-leg" d="M30 138 Q50 168 40 198"/>
      </g>
      <g class="p-arm">
        <path d="M36 128 Q60 120 62 96" fill="none" stroke="#9b62c9" stroke-width="13" stroke-linecap="round"/>
        <g transform="rotate(14 58 80)">
          <rect x="54" y="62" width="9" height="34" rx="2" fill="#ffd23f"/>
          <rect x="54" y="62" width="9" height="6" rx="2" fill="#ff8fab"/>
          <polygon points="54,96 63,96 58.5,106" fill="#f3dcb4"/>
        </g>
      </g>
      <ellipse cx="0" cy="104" rx="44" ry="46" fill="#b07cd8"/>
      <circle cx="-22" cy="74" r="5" fill="#9b62c9"/><circle cx="-4" cy="66" r="4" fill="#9b62c9"/><circle cx="16" cy="72" r="6" fill="#9b62c9"/>
      <g class="p-brows" fill="none" stroke="#7a3fa8" stroke-width="3.5" stroke-linecap="round">
        <path class="b-l" d="M-26 82 Q-16 77 -6 82"/><path class="b-r" d="M6 82 Q16 77 26 82"/>
      </g>
      <rect x="-44" y="98" width="88" height="8" fill="#2b2340"/>
      <circle cx="-16" cy="102" r="14" fill="#d6f3ff" stroke="#ffd23f" stroke-width="4"/>
      <circle cx="16" cy="102" r="14" fill="#d6f3ff" stroke="#ffd23f" stroke-width="4"/>
      <g class="p-eyes">
        <g class="p-pupils"><circle cx="-14" cy="103" r="6" fill="#2b2340"/><circle cx="18" cy="103" r="6" fill="#2b2340"/><circle cx="-12" cy="100" r="2" fill="#fff"/><circle cx="20" cy="100" r="2" fill="#fff"/></g>
        <g class="p-joy" fill="none" stroke="#2b2340" stroke-width="3.5" stroke-linecap="round"><path d="M-23 105 Q-16 96 -9 105"/><path d="M9 105 Q16 96 23 105"/></g>
      </g>
      <circle cx="-28" cy="124" r="5" fill="#ff9fb2"/><circle cx="28" cy="124" r="5" fill="#ff9fb2"/>
      <path class="m m-idle" d="M-10 126 Q0 136 10 126" fill="#2b2340"/>
      <path class="m m-happy" d="M-14 124 Q0 144 14 124 Z" fill="#2b2340"/>
      <path class="m m-oops" d="M-8 131 Q0 125 8 131" fill="none" stroke="#2b2340" stroke-width="3" stroke-linecap="round"/>
      <ellipse class="m m-think" cx="6" cy="129" rx="4" ry="3.5" fill="#2b2340"/>
    </g>
    <g class="p-idea"><circle cx="-44" cy="62" r="11" fill="#fff3a8" stroke="#ffd23f" stroke-width="3"/><rect x="-48" y="72" width="8" height="6" rx="1.5" fill="#9aa7b4"/></g>
    <g class="p-sparks" fill="#ffd23f"><path d="M-58 70 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z"/><path d="M56 132 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z"/></g>
  </svg>`;
}

// Change l'humeur d'un Pr. Bulle ; revient au repos après `ms` (0 = reste)
function profMood(root, mood, ms = 1800) {
  const svg = root && root.querySelector('.prof');
  if (!svg) return;
  clearTimeout(svg._t);
  svg.dataset.mood = mood;
  svg.classList.remove('jump'); void svg.getBoundingClientRect(); svg.classList.add('jump');
  if (ms) svg._t = setTimeout(() => { svg.dataset.mood = 'idle'; }, ms);
}

// Pr. Bulle avec sa bulle de dialogue (accueil, carte, trésor)
function profSays(text, mood = 'idle', cls = '') {
  return `<div class="prof-talk ${cls}"><span class="prof-wrap">${profSVG(mood)}</span><div class="bubble"><span class="bubble-text">${text}</span></div></div>`;
}
