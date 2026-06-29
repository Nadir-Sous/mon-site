# MÉRIDIEN — Studio de Création

Site vitrine d'un studio de création fictif, dans une esthétique **luxe minimal**.
Construit à la main (HTML / CSS / JS, zéro dépendance) avec des visuels générés
par IA via **Higgsfield**.

## ✦ Aperçu

Une page unique, multi-fichiers, pensée comme un objet éditorial :

- **Préchargeur** animé + transition d'entrée
- **Curseur personnalisé** (anneau magnétique + point), avec état « Voir » sur les projets
- **Héro** plein écran, image IA + parallaxe + titre révélé ligne par ligne
- **Bandeau défilant** (marquee) des savoir-faire
- **Manifeste** révélé mot à mot au scroll
- **Compteurs** animés
- **Savoir-faire** : liste interactive qui se déplie au survol
- **Travaux** : grille éditoriale (visuels IA)
- **Approche** en 4 temps, **citation** client, **contact** typographique géant
- **Menu plein écran** responsive, barre de progression, retour haut de page
- Accessibilité : `prefers-reduced-motion`, navigation clavier, attributs ARIA

## ✦ Structure

```
.
├── index.html          # Structure et contenu
├── css/styles.css      # Design system + animations
├── js/main.js          # Interactions (vanilla JS)
└── assets/img/         # Visuels (voir assets/img/README.md)
```

## ✦ Lancer en local

Aucune build. Ouvrez `index.html`, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## ✦ Stack

HTML5 · CSS moderne (`clamp()`, grid, `mix-blend-mode`, `clip-path`) ·
JavaScript natif (`IntersectionObserver`, `requestAnimationFrame`).
Typographies : *Cormorant Garamond* & *Inter* (Google Fonts).

Visuels : **Higgsfield** (modèle Nano Banana).
