// Les professeurs qui accompagnent l'enfant tout le long du jeu (choisi sur l'accueil)
// Humeurs (attribut data-mood) : idle, happy, oops, think — animées en CSS
// Chaque dessin partage les mêmes classes : .p-body, .p-arm, .p-brows, .p-pupils, .p-joy, .m-*

// voice.prefer : noms de voix du système essayés dans l'ordre ; rate/pitch donnent le caractère
const PROFS = {
  carapace: {
    name: 'Pr. Carapace', intro: 'la Professeure Carapace', desc: 'Tortue sage et douce',
    catch: 'Doucement mais sûrement, bravo !',
    voice: { prefer: ['Audrey', 'Aurélie', 'Marie', 'Amélie', 'Grandma'], rate: 0.9, pitch: 0.92 },
    art: `
      <ellipse cx="-24" cy="198" rx="13" ry="8" fill="#7cc98a"/><ellipse cx="24" cy="198" rx="13" ry="8" fill="#7cc98a"/>
      <ellipse cx="-50" cy="160" rx="18" ry="9" fill="#7cc98a" transform="rotate(-25 -50 160)"/>
      <g class="p-arm" style="transform-origin:0 50%"><ellipse cx="50" cy="160" rx="18" ry="9" fill="#7cc98a" transform="rotate(25 50 160)"/></g>
      <ellipse cx="0" cy="160" rx="46" ry="38" fill="#3aa776"/><ellipse cx="0" cy="160" rx="34" ry="27" fill="#2e8b60"/>
      <circle cx="0" cy="160" r="10" fill="#3aa776"/><circle cx="-20" cy="150" r="7" fill="#3aa776"/><circle cx="20" cy="150" r="7" fill="#3aa776"/><circle cx="-18" cy="172" r="7" fill="#3aa776"/><circle cx="18" cy="172" r="7" fill="#3aa776"/>
      <circle cx="0" cy="98" r="30" fill="#8fd694"/>
      <circle cx="-20" cy="110" r="5" fill="#ff9fb2"/><circle cx="20" cy="110" r="5" fill="#ff9fb2"/>
      <g class="p-brows" fill="none" stroke="#3d8a4a" stroke-width="3" stroke-linecap="round"><path class="b-l" d="M-19 82 Q-11 78 -3 82"/><path class="b-r" d="M3 82 Q11 78 19 82"/></g>
      <circle cx="-11" cy="95" r="10" fill="#fff" stroke="#2b2340" stroke-width="2.5"/><circle cx="11" cy="95" r="10" fill="#fff" stroke="#2b2340" stroke-width="2.5"/><line x1="-1" y1="95" x2="1" y2="95" stroke="#2b2340" stroke-width="2.5"/>
      <g class="p-eyes">
        <g class="p-pupils"><circle cx="-10" cy="96" r="4" fill="#2b2340"/><circle cx="12" cy="96" r="4" fill="#2b2340"/><circle cx="-8.5" cy="94.5" r="1.3" fill="#fff"/><circle cx="13.5" cy="94.5" r="1.3" fill="#fff"/></g>
        <g class="p-joy" fill="none" stroke="#2b2340" stroke-width="3" stroke-linecap="round"><path d="M-17 98 Q-11 90 -5 98"/><path d="M5 98 Q11 90 17 98"/></g>
      </g>
      <path class="m m-idle" d="M-8 110 Q0 117 8 110" fill="none" stroke="#2b2340" stroke-width="2.5" stroke-linecap="round"/>
      <path class="m m-happy" d="M-10 108 Q0 122 10 108 Z" fill="#2b2340"/>
      <path class="m m-oops" d="M-6 114 Q0 110 6 114" fill="none" stroke="#2b2340" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse class="m m-think" cx="4" cy="113" rx="3" ry="3" fill="#2b2340"/>
      <rect x="-14" y="68" width="28" height="8" fill="#2b2340"/><polygon points="-30,68 0,57 30,68 0,78" fill="#2b2340"/>
      <polyline points="0,67 24,70 26,84" fill="none" stroke="#ffd23f" stroke-width="2.5"/><circle cx="26" cy="86" r="3.5" fill="#ffd23f"/>`,
  },
  hulotte: {
    name: 'Pr. Hulotte', intro: 'la Professeure Hulotte', desc: 'Chouette savante',
    catch: 'Hou hou, quelle intelligence !',
    voice: { prefer: ['Aurélie', 'Marie', 'Audrey', 'Amélie', 'Sandy'], rate: 1.02, pitch: 1.15 },
    art: `
      <polygon points="-34,92 -40,66 -20,84" fill="#7d5536"/><polygon points="34,92 40,66 20,84" fill="#7d5536"/>
      <ellipse cx="-42" cy="150" rx="12" ry="30" fill="#7d5536"/>
      <ellipse cx="0" cy="140" rx="44" ry="60" fill="#a0704a"/><ellipse cx="0" cy="162" rx="28" ry="34" fill="#f3dcb4"/>
      <path d="M-12 156 l4 4 l4 -4 M4 156 l4 4 l4 -4 M-4 172 l4 4 l4 -4" fill="none" stroke="#c9a77a" stroke-width="2"/>
      <g class="p-arm" style="transform-origin:50% 0">
        <ellipse cx="42" cy="150" rx="12" ry="30" fill="#7d5536"/>
        <g transform="rotate(12 47 166)"><rect x="34" y="150" width="26" height="32" rx="3" fill="#0077b6"/><rect x="38" y="153" width="18" height="26" rx="2" fill="#fffdf7"/></g>
      </g>
      <circle cx="-16" cy="110" r="19" fill="#f3dcb4"/><circle cx="16" cy="110" r="19" fill="#f3dcb4"/>
      <g class="p-brows" fill="none" stroke="#5a3a22" stroke-width="3.5" stroke-linecap="round"><path class="b-l" d="M-28 87 Q-18 81 -8 87"/><path class="b-r" d="M8 87 Q18 81 28 87"/></g>
      <circle cx="-16" cy="110" r="11" fill="#fff" stroke="#2b2340" stroke-width="2.5"/><circle cx="16" cy="110" r="11" fill="#fff" stroke="#2b2340" stroke-width="2.5"/><line x1="-5" y1="110" x2="5" y2="110" stroke="#2b2340" stroke-width="2.5"/>
      <g class="p-eyes">
        <g class="p-pupils"><circle cx="-14" cy="111" r="5" fill="#2b2340"/><circle cx="18" cy="111" r="5" fill="#2b2340"/><circle cx="-12" cy="109" r="1.6" fill="#fff"/><circle cx="20" cy="109" r="1.6" fill="#fff"/></g>
        <g class="p-joy" fill="none" stroke="#2b2340" stroke-width="3" stroke-linecap="round"><path d="M-23 113 Q-16 104 -9 113"/><path d="M9 113 Q16 104 23 113"/></g>
      </g>
      <polygon class="m m-idle" points="-6,124 6,124 0,134" fill="#ffb703"/>
      <g class="m m-happy"><ellipse cx="0" cy="129" rx="5" ry="3" fill="#2b2340"/><polygon points="-7,122 7,122 0,128" fill="#ffb703"/><polygon points="-6,130 6,130 0,137" fill="#ffb703"/></g>
      <polygon class="m m-oops" points="-5,126 5,126 0,133" fill="#ffb703"/>
      <polygon class="m m-think" points="-4,124 8,125 3,134" fill="#ffb703"/>
      <polygon points="0,141 -14,134 -14,148" fill="#ff5d5d"/><polygon points="0,141 14,134 14,148" fill="#ff5d5d"/><circle cx="0" cy="141" r="3.5" fill="#d94444"/>
      <path d="M-14 200 l-4 6 M-10 200 v7 M-6 200 l4 6 M6 200 l-4 6 M10 200 v7 M14 200 l4 6" stroke="#ffb703" stroke-width="3" stroke-linecap="round"/>`,
  },
  bulle: {
    name: 'Pr. Bulle', intro: 'le Professeur Bulle', desc: 'Poulpe inventeur',
    catch: 'Bulle-tastique !',
    voice: { prefer: ['Thomas', 'Henri', 'Google'], rate: 1, pitch: 1.1 },
    art: `
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
      <ellipse class="m m-think" cx="6" cy="129" rx="4" ry="3.5" fill="#2b2340"/>`,
  },
  zigzag: {
    name: 'Pr. Zigzag', intro: 'le Professeur Zigzag', desc: 'Savant farfelu',
    catch: 'Eurêka ! Génialissime !',
    voice: { prefer: ['Grandpa', 'Jacques', 'Thomas'], rate: 1.05, pitch: 0.95 },
    art: `
      <path d="M-38 204 L-30 142 Q0 128 30 142 L38 204 Z" fill="#fff" stroke="#c9d6e3" stroke-width="2"/>
      <path d="M-10 136 L0 160 L10 136 Z" fill="#48cae4"/>
      <polygon points="0,140 -10,134 -10,146" fill="#ffd23f"/><polygon points="0,140 10,134 10,146" fill="#ffd23f"/>
      <line x1="0" y1="164" x2="0" y2="200" stroke="#c9d6e3" stroke-width="2"/><circle cx="-6" cy="172" r="2" fill="#c9d6e3"/><circle cx="-6" cy="186" r="2" fill="#c9d6e3"/>
      <rect x="-30" y="168" width="8" height="18" rx="2" fill="#2ecc71"/>
      <g class="p-arm" style="transform-origin:0 100%">
        <path d="M30 150 L50 116" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
        <circle cx="52" cy="112" r="7" fill="#ffd7b5"/><rect x="50" y="96" width="5" height="14" rx="2.5" fill="#ffd7b5"/>
      </g>
      <g fill="#f6f6f6" stroke="#d3d3d3" stroke-width="1.5"><circle cx="-33" cy="92" r="14"/><circle cx="-38" cy="110" r="11"/><circle cx="33" cy="92" r="14"/><circle cx="38" cy="110" r="11"/><circle cx="-20" cy="70" r="13"/><circle cx="0" cy="62" r="14"/><circle cx="20" cy="70" r="13"/></g>
      <circle cx="0" cy="100" r="30" fill="#ffd7b5"/>
      <g class="p-brows" fill="none" stroke="#e2e2e2" stroke-width="5" stroke-linecap="round"><path class="b-l" d="M-21 80 Q-13 75 -5 80"/><path class="b-r" d="M5 80 Q13 75 21 80"/></g>
      <circle cx="-12" cy="96" r="11" fill="#eaf8ff" stroke="#2b2340" stroke-width="3"/><circle cx="12" cy="96" r="11" fill="#eaf8ff" stroke="#2b2340" stroke-width="3"/><line x1="-1" y1="96" x2="1" y2="96" stroke="#2b2340" stroke-width="3"/>
      <g class="p-eyes">
        <g class="p-pupils"><circle cx="-10" cy="94" r="4.5" fill="#2b2340"/><circle cx="14" cy="93" r="4.5" fill="#2b2340"/><circle cx="-8.5" cy="92.5" r="1.4" fill="#fff"/><circle cx="15.5" cy="91.5" r="1.4" fill="#fff"/></g>
        <g class="p-joy" fill="none" stroke="#2b2340" stroke-width="3" stroke-linecap="round"><path d="M-18 98 Q-12 90 -6 98"/><path d="M6 98 Q12 90 18 98"/></g>
      </g>
      <circle cx="0" cy="106" r="4" fill="#f4a988"/>
      <path d="M-12 112 Q-6 108 0 112 Q6 108 12 112 Q8 116 0 114 Q-8 116 -12 112 Z" fill="#f6f6f6" stroke="#d3d3d3" stroke-width="1"/>
      <path class="m m-idle" d="M-8 118 Q0 125 8 118" fill="none" stroke="#2b2340" stroke-width="2.5" stroke-linecap="round"/>
      <path class="m m-happy" d="M-10 117 Q0 130 10 117 Z" fill="#2b2340"/>
      <path class="m m-oops" d="M-6 122 Q0 118 6 122" fill="none" stroke="#2b2340" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse class="m m-think" cx="3" cy="121" rx="3" ry="3" fill="#2b2340"/>`,
  },
};

const curProf = () => PROFS[S.prof] || PROFS.bulle;

function profSVG(mood = 'idle', id = S.prof) {
  const p = PROFS[id] || PROFS.bulle;
  return `<svg class="prof" data-mood="${mood}" viewBox="-72 44 144 166" aria-hidden="true">
    <ellipse class="p-shadow" cx="0" cy="204" rx="46" ry="6"/>
    <g class="p-body">${p.art}</g>
    <g class="p-idea"><circle cx="-50" cy="58" r="11" fill="#fff3a8" stroke="#ffd23f" stroke-width="3"/><rect x="-54" y="68" width="8" height="6" rx="1.5" fill="#9aa7b4"/></g>
    <g class="p-sparks" fill="#ffd23f"><path d="M-58 70 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z"/><path d="M56 132 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z"/></g>
  </svg>`;
}

// Change l'humeur d'un professeur ; revient au repos après `ms` (0 = reste)
function profMood(root, mood, ms = 1800) {
  const svg = root && root.querySelector('.prof');
  if (!svg) return;
  clearTimeout(svg._t);
  svg.dataset.mood = mood;
  svg.classList.remove('jump'); void svg.getBoundingClientRect(); svg.classList.add('jump');
  if (ms) svg._t = setTimeout(() => { svg.dataset.mood = 'idle'; }, ms);
}

// Le professeur avec sa bulle de dialogue (accueil, carte, trésor)
function profSays(text, mood = 'idle', cls = '') {
  return `<div class="prof-talk ${cls}"><span class="prof-wrap">${profSVG(mood)}</span><div class="bubble"><span class="bubble-text">${text}</span></div></div>`;
}
