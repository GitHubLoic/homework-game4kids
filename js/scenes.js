// Décors des étapes en mer : un décor par étape, dans l'ordre des étapes de chaque monde.
// sky  : dégradé du ciel [haut, bas]
// sea  : dégradé de la mer [près de l'horizon, devant]
// land : sol des îles (sand, rock, ice, candy, night)
// tops : ce qui pousse sur les îles (tiré au hasard pour chaque île)
// items: [emoji, gauche %, haut %, taille (vmin), animation, rotation?]
//        animations : sway, float, bob, flicker, spin, drift, flutter, fall, rise, twinkle, swim, jump, shoot, breathe

const LANDS = {
  sand: { g1: '#ffe8a3', g2: '#e9c46a', top: '#6cc04a' },
  rock: { g1: '#b5aa98', g2: '#7d7262', top: '#5f8a3e' },
  ice: { g1: '#ffffff', g2: '#bfe3ff', top: '#e8f6ff' },
  candy: { g1: '#ffe0f0', g2: '#ff9ccf', top: '#ff6fb5' },
  night: { g1: '#9a8a66', g2: '#5e523a', top: '#2f6a4a' },
};

const ZONES = {
  tropical: [
    { // La lagune turquoise
      sky: ['#7cc8ff', '#d9f6ff'], sea: ['#48e0d0', '#0096c7'], land: 'sand', tops: ['🌴', '🌴', '🌺', '🥥'],
      items: [['☀️', 84, 2, 12, 'spin'], ['☁️', 10, 4, 10, 'drift'], ['☁️', 55, 7, 7, 'drift'], ['🐠', 6, 62, 5, 'swim'], ['🐟', 90, 76, 5, 'swim'], ['🕊️', 30, 9, 5, 'flutter']],
    },
    { // L'île aux perroquets
      sky: ['#a8e6ff', '#e8fbff'], sea: ['#2ec4b6', '#0b7a8a'], land: 'sand', tops: ['🌴', '🦜', '🌴', '🍌'],
      items: [['🦜', 10, 8, 7, 'flutter'], ['🦜', 78, 12, 6, 'flutter'], ['☀️', 2, 2, 10, 'spin'], ['🐟', 88, 70, 5, 'jump'], ['🐟', 4, 82, 4, 'jump']],
    },
    { // La plage des tortues
      sky: ['#ffd6a5', '#fff1e0'], sea: ['#48cae4', '#0077b6'], land: 'sand', tops: ['🌴', '🐢', '🌾', '🌴'],
      items: [['🐢', 4, 70, 8, 'swim'], ['🐢', 88, 60, 6, 'swim'], ['🌤️', 82, 2, 12, 'bob'], ['🦀', 90, 88, 5, 'swim']],
    },
    { // La baie des dauphins
      sky: ['#bde0fe', '#e7f6ff'], sea: ['#219ebc', '#023047'], land: 'sand', tops: ['🌴', '⛱️', '🌴'],
      items: [['🐬', 6, 55, 9, 'jump'], ['🐬', 86, 66, 8, 'jump'], ['☁️', 30, 5, 9, 'drift'], ['🌞', 86, 2, 10, 'spin']],
    },
    { // L'île du volcan
      sky: ['#ff9a76', '#ffd6a5'], sea: ['#2a9d8f', '#264653'], land: 'rock', tops: ['🌋', '🌴', '🪨'],
      items: [['🌋', 0, 6, 18, 'breathe'], ['💨', 6, 0, 7, 'rise'], ['☁️', 60, 4, 8, 'drift'], ['🔥', 90, 14, 5, 'flicker']],
    },
    { // Le récif de corail
      sky: ['#90e0ef', '#caf0f8'], sea: ['#00b4d8', '#03045e'], land: 'sand', tops: ['🪸', '🌴', '🐚'],
      items: [['🐠', 8, 60, 6, 'swim'], ['🐡', 86, 70, 6, 'swim'], ['🪼', 4, 82, 6, 'float'], ['🫧', 92, 88, 3, 'rise'], ['☀️', 80, 2, 10, 'spin']],
    },
  ],

  pirates: [
    { // Le port des pirates
      sky: ['#ffcb8e', '#ffe8cc'], sea: ['#3a6ea5', '#1d3557'], land: 'rock', tops: ['🏠', '⚓', '🌴'],
      items: [['⛵', 4, 28, 10, 'bob'], ['🏴‍☠️', 86, 6, 8, 'sway'], ['🕊️', 40, 6, 5, 'flutter'], ['🛶', 88, 72, 7, 'bob']],
    },
    { // L'île du crâne
      sky: ['#6c5b7b', '#c06c84'], sea: ['#355c7d', '#1b2a41'], land: 'rock', tops: ['💀', '🪨', '🌴'],
      items: [['🦇', 10, 6, 6, 'flutter'], ['🌙', 84, 2, 10, 'bob'], ['🦈', 4, 66, 8, 'swim'], ['🦇', 70, 12, 5, 'flutter']],
    },
    { // La crique des sirènes
      sky: ['#a2d2ff', '#ffc8dd'], sea: ['#48bfe3', '#5e60ce'], land: 'sand', tops: ['🐚', '🌴', '🪸'],
      items: [['🧜‍♀️', 2, 50, 12, 'bob'], ['🧜‍♀️', 86, 64, 10, 'bob'], ['✨', 30, 8, 4, 'twinkle'], ['✨', 70, 6, 4, 'twinkle'], ['🫧', 50, 90, 3, 'rise']],
    },
    { // Le bateau fantôme
      sky: ['#2b2d42', '#5c677d'], sea: ['#3d5a80', '#0b132b'], land: 'rock', tops: ['👻', '🪨', '🕸️'],
      items: [['👻', 8, 8, 8, 'float'], ['🛳️', 82, 22, 13, 'bob', -10], ['🌫️', 30, 16, 12, 'drift'], ['🌙', 52, 2, 8, 'bob']],
    },
    { // La tempête
      sky: ['#495057', '#adb5bd'], sea: ['#1d3557', '#0b1a2e'], land: 'rock', tops: ['🌴', '🪨', '⚓'],
      items: [['⛈️', 8, 2, 12, 'bob'], ['🌩️', 80, 3, 10, 'flicker'], ['🌧️', 45, 1, 9, 'drift'], ['🌊', 2, 60, 10, 'bob'], ['🌊', 88, 72, 9, 'bob']],
    },
    { // L'île au trésor perdu
      sky: ['#ffb703', '#ffe8a3'], sea: ['#219ebc', '#023047'], land: 'sand', tops: ['🌴', '💰', '🗺️'],
      items: [['🦜', 10, 8, 7, 'flutter'], ['🏴‍☠️', 88, 30, 8, 'sway'], ['🦀', 4, 84, 5, 'swim'], ['☀️', 82, 2, 11, 'spin']],
    },
  ],

  ice: [
    { // La banquise
      sky: ['#cfe9ff', '#f5fbff'], sea: ['#5fa8d3', '#1b4965'], land: 'ice', tops: ['⛄', '🌲', '❄️'],
      items: [['❄️', 10, 0, 4, 'fall'], ['❄️', 40, 0, 3, 'fall'], ['❄️', 72, 0, 5, 'fall'], ['🐻‍❄️', 2, 62, 9, 'bob']],
    },
    { // L'île des pingouins
      sky: ['#bde0fe', '#ffffff'], sea: ['#4ea8de', '#184e77'], land: 'ice', tops: ['🐧', '🐧', '🧊'],
      items: [['🐧', 4, 64, 7, 'bob'], ['🐧', 88, 70, 6, 'bob'], ['🐟', 20, 86, 4, 'jump'], ['☁️', 60, 4, 8, 'drift']],
    },
    { // Les icebergs géants
      sky: ['#a9def9', '#e4f9ff'], sea: ['#3a86ff', '#023e8a'], land: 'ice', tops: ['🧊', '🏔️', '🧊'],
      items: [['🏔️', 0, 8, 16], ['🏔️', 84, 10, 14], ['🐋', 80, 70, 12, 'swim']],
    },
    { // La baie des phoques
      sky: ['#d0f4ff', '#ffffff'], sea: ['#48cae4', '#0077b6'], land: 'ice', tops: ['🦭', '🧊', '⛄'],
      items: [['🦭', 4, 66, 9, 'bob'], ['🐟', 88, 80, 5, 'jump'], ['☁️', 20, 5, 9, 'drift'], ['❄️', 70, 0, 4, 'fall']],
    },
    { // Les aurores boréales
      sky: ['#1b4332', '#3c096c'], sea: ['#240046', '#10002b'], land: 'ice', tops: ['🌲', '⛄', '✨'],
      items: [['✨', 12, 6, 4, 'twinkle'], ['✨', 40, 12, 3, 'twinkle'], ['✨', 66, 4, 4, 'twinkle'], ['🌙', 86, 2, 9, 'bob'], ['⭐', 26, 3, 3, 'twinkle']],
    },
    { // Le château de glace
      sky: ['#e0c3fc', '#8ec5fc'], sea: ['#4361ee', '#3a0ca3'], land: 'ice', tops: ['🏰', '❄️', '💎'],
      items: [['❄️', 20, 0, 4, 'fall'], ['❄️', 60, 0, 5, 'fall'], ['💎', 4, 70, 6, 'twinkle'], ['💎', 90, 64, 5, 'twinkle']],
    },
  ],

  candy: [
    { // La mer de sirop
      sky: ['#ffc2d1', '#ffe5ec'], sea: ['#ff8fab', '#c9184a'], land: 'candy', tops: ['🍭', '🍬', '🧁'],
      items: [['🍬', 10, 8, 6, 'float'], ['☁️', 60, 4, 9, 'drift'], ['🍓', 4, 70, 6, 'jump'], ['🍬', 86, 14, 5, 'float']],
    },
    { // L'île en biscuit
      sky: ['#ffd6a5', '#fff1e6'], sea: ['#f4a261', '#bc6c25'], land: 'candy', tops: ['🍪', '🥨', '🍪'],
      items: [['🍪', 4, 4, 10, 'spin'], ['🧁', 86, 6, 8, 'bob'], ['🍪', 88, 70, 6, 'swim']],
    },
    { // Le lagon de chocolat
      sky: ['#fec5bb', '#fff0eb'], sea: ['#9c6644', '#3e2723'], land: 'candy', tops: ['🍫', '🍩', '🍒'],
      items: [['🍩', 4, 64, 8, 'spin'], ['🍒', 88, 70, 6, 'bob'], ['☁️', 40, 4, 9, 'drift']],
    },
    { // Les îles sucettes
      sky: ['#b8f2e6', '#e8fff8'], sea: ['#5ec8c0', '#1f7a8c'], land: 'candy', tops: ['🍭', '🍭', '🍬'],
      items: [['🦄', 4, 8, 9, 'float'], ['🌈', 68, 1, 16], ['🍬', 90, 70, 5, 'jump']],
    },
    { // La montagne de glace
      sky: ['#cdeeff', '#ffe0f0'], sea: ['#a2d2ff', '#5390d9'], land: 'candy', tops: ['🍦', '🍧', '🍨'],
      items: [['🍦', 2, 4, 14, 'breathe'], ['❄️', 40, 0, 4, 'fall'], ['❄️', 70, 0, 4, 'fall'], ['🍧', 88, 66, 7, 'bob']],
    },
    { // L'île gâteau
      sky: ['#ffd6e8', '#fff1c1'], sea: ['#ff70a6', '#9d4edd'], land: 'candy', tops: ['🎂', '🧁', '🍓'],
      items: [['🎈', 8, 4, 8, 'float'], ['🎈', 84, 8, 8, 'float'], ['🎉', 50, 3, 6, 'twinkle']],
    },
  ],

  stars: [
    { // Le coucher de soleil
      sky: ['#ff7b54', '#ffd56b'], sea: ['#9d4edd', '#310e68'], land: 'sand', tops: ['🌴', '🌴', '🌺'],
      items: [['🌞', 44, 8, 14, 'breathe'], ['🕊️', 14, 6, 5, 'flutter'], ['🕊️', 76, 10, 4, 'flutter']],
    },
    { // La mer de nuit
      sky: ['#0b0d2b', '#2a2c5a'], sea: ['#1b1f4b', '#05061a'], land: 'night', tops: ['🌴', '🏕️', '🌲'],
      items: [['🌙', 84, 2, 11, 'bob'], ['⭐', 20, 4, 3, 'twinkle'], ['⭐', 50, 8, 3, 'twinkle'], ['⭐', 66, 3, 4, 'twinkle']],
    },
    { // Les îles lucioles
      sky: ['#10002b', '#3c096c'], sea: ['#240046', '#10002b'], land: 'night', tops: ['🌳', '🍄', '✨'],
      items: [['✨', 8, 8, 4, 'twinkle'], ['✨', 30, 14, 3, 'twinkle'], ['✨', 60, 6, 4, 'twinkle'], ['✨', 86, 16, 3, 'twinkle'], ['✨', 4, 70, 4, 'twinkle'], ['✨', 90, 80, 3, 'twinkle']],
    },
    { // La lune sur l'eau
      sky: ['#14213d', '#3d5a80'], sea: ['#1d3557', '#0b132b'], land: 'night', tops: ['🌴', '🪨', '🌙'],
      items: [['🌕', 44, 3, 13, 'breathe'], ['✨', 6, 66, 5, 'twinkle'], ['✨', 90, 70, 5, 'twinkle'], ['⭐', 20, 6, 3, 'twinkle']],
    },
    { // La pluie d'étoiles
      sky: ['#0d1b4c', '#26307a'], sea: ['#1b1f4b', '#0b0d2b'], land: 'night', tops: ['🌴', '⭐', '🌠'],
      items: [['⭐', 10, 0, 5, 'fall'], ['⭐', 30, 0, 4, 'fall'], ['⭐', 55, 0, 5, 'fall'], ['⭐', 80, 0, 4, 'fall'], ['🌠', 70, 4, 10, 'shoot'], ['🌙', 2, 2, 12, 'bob']],
    },
    { // L'île de la lune
      sky: ['#2c1250', '#130828'], sea: ['#3c096c', '#10002b'], land: 'night', tops: ['🌙', '🏰', '✨'],
      items: [['🪐', 2, 2, 14, 'spin'], ['🌟', 86, 6, 7, 'twinkle'], ['🛸', 60, 3, 8, 'float']],
    },
  ],
};

const TREASURE_ZONE = {
  sky: ['#ffb703', '#ffe8a3'], sea: ['#00b4d8', '#0077b6'], land: 'sand', tops: ['🌴'],
  items: [['🦜', 10, 8, 7, 'flutter'], ['☀️', 84, 2, 12, 'spin'], ['🐬', 4, 66, 9, 'jump'], ['🐬', 88, 72, 8, 'jump'], ['🌈', 30, 1, 16]],
};
