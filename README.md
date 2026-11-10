# Les Îles Magiques

Jeu éducatif en français pour le CP et le CE1 : lecture, mots du jour, singulier/pluriel, calcul et manipulation des dizaines et centaines, dans cinq univers marins.

## Lancer le jeu

```sh
python3 serve.py
```

Ouvrir `http://localhost:8765`. Aucun gestionnaire de paquets ni compilation n'est nécessaire. L'accueil permet de choisir le prénom, le bateau, le professeur, les activités et le son. La progression est enregistrée dans le navigateur, sur l'appareil utilisé.

## Organisation

- `js/game.js` : activités pédagogiques et navigation.
- `js/artwork.js` : icônes et pictogrammes locaux partagés.
- `js/prof.js` : professeurs, voix et humeurs.
- `js/archipelago.js` : carte des cinq mers.
- `css/adventure.css` : accueil, atelier, carnet d'exercices, aides et récompenses.
- `css/marine.css` : carte illustrée et parcours mobile.
- `assets/marine` : illustrations du jeu.
- `assets/pictures` : pictogrammes Twemoji (CC BY 4.0, attribution et licence incluses).
- `assets/fonts` : Andika et Fredoka (SIL Open Font License, licences incluses).

Les images, les pictogrammes et les polices sont servis localement. La synthèse vocale utilise les voix proposées par le navigateur et le système.
