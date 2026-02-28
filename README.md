# HR-Pulse Frontend 🚀

> **Interface web moderne pour la plateforme d'analyse RH intelligente** — powered by **Next.js 15**, **TypeScript**, et **Azure AI**.

---

## 🌟 Aperçu

**HR-Pulse Frontend** est une application web performante conçue avec **Next.js 15 (App Router)**. Elle offre une interface élégante et intuitive pour interagir avec l'écosystème HR-Pulse, permettant de transformer la gestion des talents grâce à l'intelligence artificielle.

### Fonctionnalités clés :
- 🔍 **Visualisation d'offres d'emploi** : Explorez et filtrez les offres analysées par le système.
- 🧠 **Extraction de compétences (NER)** : Visualisez les entités extraites par Azure AI Language.
- 💰 **Prédicteur Salarial** : Estimez les fourchettes de rémunération via nos modèles de Machine Learning.
- 🔐 **Gestion d'accès sécurisée** : Authentification complète (Register/Login) avec JWT.
- 🎨 **Design Soft Neumorphic** : Une interface moderne, fluide et responsive.

---

## 🛠 Stack Technique

| Technologie | Rôle |
|---|---|
| **Next.js 15** | Framework React (App Router) |
| **TypeScript** | Typage statique pour une robustesse accrue |
| **Tailwind CSS 4** | Styling moderne et utilitaire |
| **Azure AI** | Services cognitifs pour le traitement du langage |
| **Docker** | Conteneurisation pour un déploiement simplifié |

---

## 📁 Structure du Projet

```bash
frontend/
├── app/                  # Routes et composants de l'application
│   ├── dashboard/        # Vue principale (jobs, skills, prediction)
│   ├── login/           # Interface de connexion
│   ├── signup/          # Interface d'inscription
│   ├── globals.css      # Design system global
│   └── layout.tsx       # Structure racine
├── public/               # Ressources statiques (images, svg)
├── Dockerfile            # Configuration Docker (Optimisé Multi-stage)
├── next.config.ts        # Configuration Next.js (Standalone enabled)
└── package.json          # Dépendances et scripts
```

---

## 🚀 Installation & Lancement

### Localement
1. **Cloner le repo**
   ```bash
   git clone https://github.com/votre-org/HR-Pulse-frontend.git
   cd HR-Pulse-frontend/frontend
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer l'environnement**
   Créez un fichier `.env.local` :
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Accédez à : `http://localhost:3000`

### Via Docker
```bash
# Build de l'image
docker build -t hr-pulse-frontend .

# Lancement du conteneur
docker run -p 3000:3000 hr-pulse-frontend
```

---

## 🐳 Optimisation Docker (Production)
Le projet utilise un **Dockerfile multi-stage** qui :
1. Isole les dépendances (`deps`).
2. Compile l'application (`builder`).
3. Génère une image de production ultra-légère (`runner`) utilisant le mode `standalone` de Next.js.

---

## 🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une Pull Request.

---

## ⚖️ Licence
Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---
Built with ❤️ by the HR-Pulse Team.
