// Contenu pédagogique et univers du jeu « Les Îles Magiques »

// Options pour personnaliser le bateau
const BOAT_OPTIONS = {
  hull: ['#e63946', '#3a86ff', '#ffb703', '#2ec4b6', '#a06cd5', '#ff70a6'],
  sail: ['#ffffff', '#ffd6e8', '#fff3b0', '#caf0f8', '#d8f3dc', '#e7c6ff'],
  pattern: [['rayures', 'Rayures'], ['pois', 'Pois'], ['coeur', 'Cœur'], ['etoile', 'Étoile'], ['uni', 'Uni']],
};

const STEPS_PER_WORLD = 6;

const WORLDS = [
  {
    id: 'tropical', name: 'Les Îles Tropicales', emoji: '🏝️',
    reward: '🐚', rewardName: 'le coquillage magique',
    c1: '#0077b6', c2: '#48cae4', accent: '#ffd166',
    decor: ['🏝️', '🐠', '🌴', '🐚', '🐬', '🌺'],
    steps: ['La lagune turquoise', 'L’île aux perroquets', 'La plage des tortues', 'La baie des dauphins', 'L’île du volcan', 'Le récif de corail'],
  },
  {
    id: 'pirates', name: 'La Mer des Pirates', emoji: '🏴‍☠️',
    reward: '💰', rewardName: 'le trésor des pirates',
    c1: '#1d3557', c2: '#457b9d', accent: '#ffcb47',
    decor: ['🏴‍☠️', '⚓', '🗺️', '🦜', '💰', '🧭'],
    steps: ['Le port des pirates', 'L’île du crâne', 'La crique des sirènes', 'Le bateau fantôme', 'La tempête', 'L’île au trésor perdu'],
  },
  {
    id: 'ice', name: 'Les Îles de Glace', emoji: '🧊',
    reward: '💎', rewardName: 'le diamant des glaces',
    c1: '#3d7ea6', c2: '#bde0fe', accent: '#ffd166',
    decor: ['🧊', '❄️', '🐧', '⛄', '🐻‍❄️', '🏔️'],
    steps: ['La banquise', 'L’île des pingouins', 'Les icebergs géants', 'La baie des phoques', 'Les aurores boréales', 'Le château de glace'],
  },
  {
    id: 'candy', name: 'L’Archipel des Bonbons', emoji: '🍭',
    reward: '🧁', rewardName: 'le gâteau arc-en-ciel',
    c1: '#c2185b', c2: '#ffb3d9', accent: '#fff176',
    decor: ['🍭', '🍬', '🧁', '🍩', '🍫', '🍓'],
    steps: ['La mer de sirop', 'L’île en biscuit', 'Le lagon de chocolat', 'Les îles sucettes', 'La montagne de glace', 'L’île gâteau'],
  },
  {
    id: 'stars', name: 'La Mer des Étoiles', emoji: '🌙',
    reward: '🌟', rewardName: 'l’étoile filante',
    c1: '#0b0d2b', c2: '#4a3a9a', accent: '#ffd23f',
    decor: ['🌙', '⭐', '✨', '🌠', '🪐', '🦉'],
    steps: ['Le coucher de soleil', 'La mer de nuit', 'Les îles lucioles', 'La lune sur l’eau', 'La pluie d’étoiles', 'L’île de la lune'],
  },
];

// --- Lecture : phrases construites « sujet + action » ---
const SUBJECTS = [
  { sg: 'le chat', pl: 'chats', e: '🐱' },
  { sg: 'le chien', pl: 'chiens', e: '🐶' },
  { sg: 'la souris', pl: 'souris', e: '🐭' },
  { sg: 'le lapin', pl: 'lapins', e: '🐰' },
  { sg: 'la vache', pl: 'vaches', e: '🐮' },
  { sg: 'le cochon', pl: 'cochons', e: '🐷' },
  { sg: 'le singe', pl: 'singes', e: '🐵' },
  { sg: 'la grenouille', pl: 'grenouilles', e: '🐸' },
  { sg: 'le lion', pl: 'lions', e: '🦁' },
  { sg: 'l’ours', pl: 'ours', e: '🐻' },
  { sg: 'le poussin', pl: 'poussins', e: '🐥' },
  { sg: 'le panda', pl: 'pandas', e: '🐼' },
  { sg: 'le renard', pl: 'renards', e: '🦊' },
  { sg: 'la tortue', pl: 'tortues', e: '🐢' },
  { sg: 'le pingouin', pl: 'pingouins', e: '🐧' },
];

const ACTIONS = [
  { sg: 'mange une pomme', pl: 'mangent une pomme', e: '🍎' },
  { sg: 'mange une banane', pl: 'mangent une banane', e: '🍌' },
  { sg: 'mange une carotte', pl: 'mangent une carotte', e: '🥕' },
  { sg: 'mange un gâteau', pl: 'mangent un gâteau', e: '🍰' },
  { sg: 'mange une glace', pl: 'mangent une glace', e: '🍦' },
  { sg: 'joue au ballon', pl: 'jouent au ballon', e: '⚽' },
  { sg: 'lit un livre', pl: 'lisent un livre', e: '📖' },
  { sg: 'dort dans le lit', pl: 'dorment dans le lit', e: '🛏️' },
  { sg: 'boit du lait', pl: 'boivent du lait', e: '🥛' },
  { sg: 'porte un chapeau', pl: 'portent un chapeau', e: '🎩' },
  { sg: 'fait du vélo', pl: 'font du vélo', e: '🚲' },
  { sg: 'regarde la lune', pl: 'regardent la lune', e: '🌙' },
  { sg: 'tient une fleur', pl: 'tiennent une fleur', e: '🌸' },
  { sg: 'joue de la guitare', pl: 'jouent de la guitare', e: '🎸' },
  { sg: 'est dans la voiture', pl: 'sont dans la voiture', e: '🚗' },
  { sg: 'est sous la pluie', pl: 'sont sous la pluie', e: '🌧️' },
];

const NUM_WORDS = { 2: 'deux', 3: 'trois' };

// --- Lecture : image -> mot (avec mots « pièges » qui se ressemblent) ---
// [image, bon mot, piège 1, piège 2]
const WORDS = [
  ['🐟', 'poisson', 'boisson', 'poussin'],
  ['🏠', 'maison', 'raison', 'moisson'],
  ['🐑', 'mouton', 'bouton', 'melon'],
  ['🐱', 'chat', 'chou', 'rat'],
  ['🐭', 'souris', 'sourire', 'soupir'],
  ['🚂', 'train', 'trois', 'trou'],
  ['🌙', 'lune', 'lime', 'plume'],
  ['🪶', 'plume', 'prune', 'lune'],
  ['🦊', 'renard', 'canard', 'regard'],
  ['🦆', 'canard', 'cadeau', 'renard'],
  ['🎁', 'cadeau', 'gâteau', 'bateau'],
  ['🎂', 'gâteau', 'bateau', 'râteau'],
  ['⛵', 'bateau', 'chapeau', 'gâteau'],
  ['🎩', 'chapeau', 'château', 'chameau'],
  ['🏰', 'château', 'chapeau', 'chameau'],
  ['🐪', 'chameau', 'chapeau', 'marteau'],
  ['🔨', 'marteau', 'manteau', 'moineau'],
  ['🧥', 'manteau', 'marteau', 'moineau'],
  ['🍎', 'pomme', 'gomme', 'homme'],
  ['⚽', 'ballon', 'balai', 'salon'],
  ['🐸', 'grenouille', 'citrouille', 'chatouille'],
  ['🎃', 'citrouille', 'grenouille', 'chatouille'],
  ['🦁', 'lion', 'lit', 'lapin'],
  ['🐰', 'lapin', 'sapin', 'lutin'],
  ['🌲', 'sapin', 'lapin', 'savon'],
  ['🧼', 'savon', 'salon', 'sapin'],
  ['🐝', 'abeille', 'oreille', 'bouteille'],
  ['👂', 'oreille', 'abeille', 'orteil'],
  ['🐌', 'escargot', 'haricot', 'escalier'],
  ['🌹', 'rose', 'robe', 'ruse'],
  ['👗', 'robe', 'rose', 'rame'],
  ['🐄', 'vache', 'vase', 'tache'],
  ['🐢', 'tortue', 'tartine', 'voiture'],
  ['🚗', 'voiture', 'tortue', 'vautour'],
  ['☀️', 'soleil', 'sommeil', 'oreille'],
  ['🍓', 'fraise', 'frise', 'braise'],
  ['🐻', 'ours', 'four', 'tour'],
  ['🐵', 'singe', 'linge', 'songe'],
  ['📖', 'livre', 'lièvre', 'litre'],
  ['🦋', 'papillon', 'pavillon', 'paillasson'],
  ['🔑', 'clé', 'blé', 'clou'],
  ['🧀', 'fromage', 'plumage', 'garage'],
  ['🐔', 'poule', 'boule', 'pelle'],
];

const BRAVO = ['Bravo {name} !', 'Super !', 'Génial !', 'Trop fort !', 'Waouh !', 'Magnifique !', 'Bien joué {name} !', 'Incroyable !'];

const OOPS = ['Oups ! Des rochers ! Essaie une autre île 😉', 'Presque ! Regarde bien 👀', 'Pas grave, réessaie !', 'Hmm… pas cette île-là !'];

// --- Répliques du professeur ({prof} : son nom, {catch} : sa phrase fétiche) ---
const PROF = {
  hello: ['Bonjour{name} ! Je suis {prof}. Je t’accompagne pendant tout le voyage !'],
  map: ['Choisis une mer{name}, je viens avec toi !', 'Prêt pour l’aventure{name} ? Moi, oui !', 'Quelle mer allons-nous explorer aujourd’hui ?'],
  start: ['C’est parti{name} ! Je suis là si tu as besoin.', 'En avant, moussaillon ! Je te donnerai un coup de tentacule.'],
  cheer: ['Tu vas y arriver, je le sais !', 'Prends ton temps, on n’est pas pressés.', 'Touche 💡 et je te donne un indice !', 'Se tromper, c’est comme ça qu’on apprend !'],
  bravo: ['Continue comme ça !', 'Quel cerveau !', 'Tu es un vrai savant !', '{catch}', '{catch}'],
  treasure: ['Tu as réussi tout le voyage ! Quelle aventure ! {catch}'],
};
const profLine = (key) => pick(PROF[key]).replace('{name}', S.name ? ` ${S.name}` : '')
  .replace('{prof}', curProf().intro).replace('{catch}', curProf().catch);

// --- Mots du jour : mots-outils à lire tous les jours ---
// Liste par défaut (modifiable par le parent sur l'écran d'accueil)
const DAILY_WORDS = 'le un de être il avoir et à son se dans je elle ce ne qui du en faire dire au pour';

// Pour chaque mot : des mots « pièges » qui se ressemblent (aucun ne convient dans les phrases)
// et des phrases à trou ([phrase avec ___, image])
const WORD_BANK = {
  le: { near: ['la', 'les', 'de'], sentences: [['Je vois ___ chat.', '🐱'], ['___ chien court vite.', '🐶']] },
  un: { near: ['une', 'on', 'nu'], sentences: [['Il y a ___ ballon.', '⚽'], ['Papa mange ___ gâteau.', '🍰']] },
  de: { near: ['le', 'des', 'du'], sentences: [['Je joue ___ la guitare.', '🎸'], ['Le jus ___ pomme est bon.', '🍎']] },
  être: { near: ['tête', 'entre', 'était'], sentences: [['Je veux ___ une princesse.', '👸'], ['Il faut ___ sage.', '😇']] },
  il: { near: ['elle', 'le', 'ils'], sentences: [['___ mange une pomme.', '👦🍎'], ['___ fait du vélo.', '👦🚲']] },
  avoir: { near: ['avion', 'avril', 'soir'], sentences: [['Je voudrais ___ un chat.', '🐱'], ['Tu vas ___ un cadeau.', '🎁']] },
  et: { near: ['est', 'en', 'te'], sentences: [['Je mange une pomme ___ une banane.', '🍎🍌'], ['Papa ___ maman dansent.', '👨👩']] },
  à: { near: ['a', 'la', 'au'], sentences: [['Je vais ___ l’école.', '🏫'], ['Il joue ___ la balle.', '⚾']] },
  son: { near: ['sont', 'sa', 'sans'], sentences: [['Léo prend ___ vélo.', '🚲'], ['Le chien mange ___ os.', '🦴']] },
  se: { near: ['ce', 'ses', 'je'], sentences: [['Le chat ___ lave.', '🐱🛁'], ['Il ___ cache sous le lit.', '🛏️']] },
  dans: { near: ['dent', 'danse', 'dame'], sentences: [['Le poisson est ___ l’eau.', '🐟'], ['Je dors ___ mon lit.', '🛏️']] },
  je: { near: ['jeu', 'le', 'ne'], sentences: [['___ mange une glace.', '🍦'], ['___ lis un livre.', '📖']] },
  elle: { near: ['il', 'belle', 'elles'], sentences: [['___ saute à la corde.', '👧'], ['___ lit un livre.', '👧📖']] },
  ce: { near: ['se', 'ne', 'que'], sentences: [['Regarde ___ bateau !', '⛵'], ['Je veux ___ gâteau !', '🎂']] },
  ne: { near: ['en', 'le', 'me'], sentences: [['Je ___ dors pas.', '😴'], ['Il ___ pleut pas.', '☀️']] },
  qui: { near: ['que', 'quoi', 'lui'], sentences: [['C’est Léo ___ chante.', '🎤'], ['Le chat ___ dort est gris.', '😺']] },
  du: { near: ['de', 'des', 'dur'], sentences: [['Je bois ___ lait.', '🥛'], ['Il mange ___ pain.', '🍞']] },
  en: { near: ['ne', 'an', 'un'], sentences: [['Je vais ___ vacances.', '🏖️'], ['Il part ___ bateau.', '⛵']] },
  faire: { near: ['fera', 'frère', 'lire'], sentences: [['Je veux ___ du vélo.', '🚲'], ['Il va ___ un gâteau.', '🎂']] },
  dire: { near: ['dira', 'rire', 'dure'], sentences: [['Il faut ___ merci.', '🙏'], ['Je vais ___ bonjour.', '👋']] },
  au: { near: ['eau', 'un', 'ou'], sentences: [['Je vais ___ parc.', '🌳'], ['Il joue ___ ballon.', '⚽']] },
  pour: { near: ['pou', 'jour', 'pur'], sentences: [['C’est un cadeau ___ toi.', '🎁'], ['Je mange ___ grandir.', '💪']] },
};

// Mots qui se prononcent pareil : jamais proposés ensemble quand on écoute le mot
const HOMOPHONES = [['se', 'ce', 'ses', 'ces'], ['et', 'est'], ['à', 'a'], ['son', 'sont'], ['au', 'eau', 'aux'], ['du', 'dû'], ['il', 'ils'], ['elle', 'elles'], ['en', 'an']];

// --- Singulier / pluriel (CE1) ---
// g : genre (pour un/une, le/la) ; pl : pluriel (avec les pluriels en -x) ; bad : pluriel « piège » mal écrit
const NOUNS = [
  { sg: 'pomme', pl: 'pommes', g: 'f', e: '🍎' },
  { sg: 'ballon', pl: 'ballons', g: 'm', e: '⚽' },
  { sg: 'fleur', pl: 'fleurs', g: 'f', e: '🌸' },
  { sg: 'étoile', pl: 'étoiles', g: 'f', e: '⭐' },
  { sg: 'voiture', pl: 'voitures', g: 'f', e: '🚗' },
  { sg: 'livre', pl: 'livres', g: 'm', e: '📖' },
  { sg: 'poisson', pl: 'poissons', g: 'm', e: '🐟' },
  { sg: 'papillon', pl: 'papillons', g: 'm', e: '🦋' },
  { sg: 'maison', pl: 'maisons', g: 'f', e: '🏠' },
  { sg: 'banane', pl: 'bananes', g: 'f', e: '🍌' },
  { sg: 'crayon', pl: 'crayons', g: 'm', e: '✏️' },
  { sg: 'chien', pl: 'chiens', g: 'm', e: '🐶' },
  { sg: 'tortue', pl: 'tortues', g: 'f', e: '🐢' },
  { sg: 'bateau', pl: 'bateaux', bad: 'bateaus', g: 'm', e: '⛵' },
  { sg: 'gâteau', pl: 'gâteaux', bad: 'gâteaus', g: 'm', e: '🍰' },
  { sg: 'chapeau', pl: 'chapeaux', bad: 'chapeaus', g: 'm', e: '🎩' },
  { sg: 'cadeau', pl: 'cadeaux', bad: 'cadeaus', g: 'm', e: '🎁' },
  { sg: 'oiseau', pl: 'oiseaux', bad: 'oiseaus', g: 'm', e: '🐦' },
  { sg: 'souris', pl: 'souris', g: 'f', e: '🐭' },
];
