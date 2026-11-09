// Illustrations locales séparées du texte et des interactions.
const CHART_LABELS = { tropical: 'Tropiques', pirates: 'Pirates', ice: 'Glaces', candy: 'Bonbons', stars: 'Étoiles' };

function islandArt(id) {
  return `<img class="island-art" src="assets/marine/${id}.webp" alt="" width="1448" height="1086" decoding="async" draggable="false">`;
}

function chartScenery() {
  return `<svg class="chart-scenery chart-desktop-route" viewBox="0 0 1200 650" preserveAspectRatio="none" aria-hidden="true"><path class="chart-route" d="M180 210C320 190 380 380 540 290S710 200 910 225 1060 440 890 480 670 580 490 490 300 440 310 410"/></svg>
    <svg class="chart-scenery chart-mobile-route" viewBox="0 0 400 1300" preserveAspectRatio="none" aria-hidden="true"><path class="chart-route" d="M130 175C90 245 330 220 290 365S80 400 120 615 340 660 290 865 90 920 125 1150"/></svg>`;
}

function chartProfessor() {
  return S.prof === 'bulle'
    ? '<img class="chart-professor" src="assets/marine/professor.webp" width="1448" height="1086" alt="Le professeur Bulle te salue" decoding="async">'
    : `<span class="chart-professor chart-professor-svg">${profSVG()}</span>`;
}
