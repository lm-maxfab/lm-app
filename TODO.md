# To do

## 1-2105-prenoms
- OK - Positionner les illustrations
- OK - Ajouter le footer
- OK - Ajouter les dernières chroniques
- OK - Remonter le bouton "Next" si on est sur l'appli

## Master
- Descendre le début de page si présence du header
- OK - Détection générique de l'environnement app/web
- Détection de la présence du header et adaptation en fct de si longform ou snippet
- OK - Détection du display courant, accès via une classe de .lm-app-root et via le contexte
- Stratégie d'appel des ressources dev/prod, via config.js, context et CSS variables
- Ajouter les headers et footers en dev
- Build / Start
  - Import de preload.js
  - Supprimer les ressources doublonnées lors du build (ou décider lors du build)
  - Prerender

## Components
- Fix multiline FancyHoverableText on iOS Safari
- Ranger le module Spreadsheets, séparer le composant StrToHtml de son parser, pour pouvoir utiliser seulement le parser
- Text component
- Déplacer les modules en dehors du projet lm-app, les appeler via un alias ?

## Documentation / Orga
- Faire un README, l'ajouter dans Notion
- Faire une To-Do publique

## Utilitaires / Support
- Mettre en place un serveur de données perso pour dev purposes
