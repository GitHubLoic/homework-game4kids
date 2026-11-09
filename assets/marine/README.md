# Illustrations de la carte maritime

Illustrations créées pour la direction artistique « dessin animé marin » validée pour Les Îles Magiques.

- `tropical`, `pirates`, `ice`, `candy`, `stars` : cinq îles sur fond transparent (1448 × 1086).
- `professor` : professeur Bulle sur fond transparent (1448 × 1086).
- `ocean` : ciel et horizon (1536 × 1024).
- `water` : texture de mer pour prolonger le décor pendant le défilement (1254 × 1254).

Les fichiers WebP conservent la transparence et totalisent environ 2,7 Mo. Les titres, la progression, les messages et les boutons sont rendus en HTML, séparément des illustrations. Le bateau reste le SVG personnalisé par l’enfant ; les autres professeurs conservent leur représentation existante.

`js/archipelago.js` assemble les illustrations ; `css/marine.css` définit la carte large et le parcours vertical sur mobile (jusqu’à 700 px), avec le bouton fixe et la zone réservée au bas de l’écran.
