# Comparative Law — Fiche de révision interactive (LDROI1310)

Application React (Vite) de révision du cours de droit comparé (C. Laske, UCLouvain).
Couvre les 9 chapitres (0–8), 18 fiches auteurs, un tableau comparatif, des schémas de liens,
un glossaire, un QCM (37 questions) et 10 questions ouvertes avec plan de réponse.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée (par défaut http://localhost:5173).

## Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build
```

## Déployer sur Vercel via GitHub

1. Crée un nouveau dépôt sur GitHub (ex. `comparative-law-revision`).
2. Pousse ce dossier :

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ton-pseudo>/comparative-law-revision.git
   git push -u origin main
   ```

3. Sur https://vercel.com → **Add New… → Project → Import** ton dépôt GitHub.
4. Vercel détecte automatiquement Vite. Garde les réglages par défaut :
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. Clique **Deploy**. À chaque `git push`, Vercel redéploie automatiquement.

## Structure

```
.
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx
    └── ComparativeLawRevision.jsx
```
