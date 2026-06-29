# Images

Les visuels du site sont générés par IA (Higgsfield · Nano Banana) et servis
depuis le CDN Higgsfield. Le conteneur de build n'autorise pas le téléchargement
de ce CDN (politique réseau), donc les `<img>` pointent directement vers les URLs
CDN — elles s'affichent normalement dans n'importe quel navigateur.

## Rendre le site 100 % auto-hébergé (optionnel)

Téléchargez les 4 images, placez-les ici sous ces noms, puis remplacez les URLs
CDN par les chemins locaux dans `index.html` :

| Fichier      | Rôle                         |
|--------------|------------------------------|
| `hero.png`   | Image héro (4K, 16:9)        |
| `work-1.png` | Travaux — Maison Alba        |
| `work-2.png` | Travaux — Sérac              |
| `work-3.png` | Travaux — Studio Objet       |
