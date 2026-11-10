// Les professeurs qui accompagnent l'enfant tout le long du jeu (choisi sur l'accueil)
// Humeurs (attribut data-mood) : idle, happy, oops, think — animées en CSS
// Les illustrations partagent les mêmes contours et les mêmes états visuels.

// voice.prefer : noms de voix du système essayés dans l'ordre ; rate/pitch donnent le caractère
const PROFS = {
  carapace: {
    name: 'Pr. Carapace', intro: 'la Professeure Carapace', desc: 'Tortue sage et douce',
    catch: 'Doucement mais sûrement, bravo !',
    voice: { prefer: ['Audrey', 'Aurélie', 'Marie', 'Amélie', 'Grandma'], rate: 0.9, pitch: 0.92 },
  },
  hulotte: {
    name: 'Pr. Hulotte', intro: 'la Professeure Hulotte', desc: 'Chouette savante',
    catch: 'Hou hou, quelle intelligence !',
    voice: { prefer: ['Aurélie', 'Marie', 'Audrey', 'Amélie', 'Sandy'], rate: 1.02, pitch: 1.15 },
  },
  bulle: {
    name: 'Pr. Bulle', intro: 'le Professeur Bulle', desc: 'Poulpe inventeur',
    catch: 'Bulle-tastique !',
    voice: { prefer: ['Thomas', 'Henri', 'Google'], rate: 1, pitch: 1.1 },
  },
  zigzag: {
    name: 'Pr. Zigzag', intro: 'le Professeur Zigzag', desc: 'Savant farfelu',
    catch: 'Eurêka ! Génialissime !',
    voice: { prefer: ['Grandpa', 'Jacques', 'Thomas'], rate: 1.05, pitch: 0.95 },
  },
};

const curProf = () => PROFS[S.prof] || PROFS.bulle;

function profSVG(mood = 'idle', id = S.prof) {
  const key = PROFS[id] ? id : 'bulle';
  const image = key === 'bulle' ? 'professor' : `prof-${key}`;
  return `<span class="prof illustrated-prof" data-mood="${mood}" data-prof="${key}" aria-hidden="true"><img src="assets/marine/${image}.webp" alt="" width="1448" height="1086" draggable="false"><span class="prof-spark">${nauticalIcon('star')}</span></span>`;
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
