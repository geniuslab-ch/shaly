# 🚀 Shaly

Automatisez la publication de vos posts LinkedIn avec une vraie intégration API officielle.

![Shaly](https://img.shields.io/badge/LinkedIn-API%20v2-0077B5?style=for-the-badge&logo=linkedin)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## ✨ Fonctionnalités

- 🔐 **Authentification OAuth 2.0** avec LinkedIn
- 📝 **Publication immédiate** sur LinkedIn
- ⏰ **Programmation automatique** de posts
- 📊 **Dashboard** de gestion des posts
- 🔄 **Refresh automatique** des tokens
- 🎨 **Interface moderne** avec React + Tailwind
- 🐳 **Déploiement Docker** en un clic

## 🛠️ Stack Technique

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (base de données)
- Redis + BullMQ (job queue)
- LinkedIn API v2 officielle

### Frontend
- React + TypeScript
- Tailwind CSS
- Vite
- Lucide React (icônes)

## 📋 Prérequis

- Node.js 20+ (https://nodejs.org/)
- Docker Desktop (https://www.docker.com/products/docker-desktop/)
- Compte LinkedIn Developer (https://www.linkedin.com/developers/)

## 🚀 Installation Rapide

### 1. Créer une application LinkedIn

1. Allez sur https://www.linkedin.com/developers/apps
2. Cliquez sur "Create app"
3. Remplissez les informations de votre app
4. Dans l'onglet "Products", ajoutez **"Share on LinkedIn"**
5. Dans "Auth" > "OAuth 2.0 settings" :
   - Ajoutez l'URL de redirection : `http://localhost:3000/auth/linkedin/callback`
6. Copiez votre **Client ID** et **Client Secret**

### 2. Cloner et configurer

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env et ajouter vos credentials LinkedIn
nano .env  # ou code .env
```

**Dans le fichier .env, remplacez :**
```env
LINKEDIN_CLIENT_ID=votre_client_id_ici
LINKEDIN_CLIENT_SECRET=votre_client_secret_ici
```

### 3. Démarrer avec Docker (RECOMMANDÉ)

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps

# Voir les logs
docker-compose logs -f
```

✅ **C'est tout !** Accédez à http://localhost:5173

### 4. OU Installation manuelle (sans Docker)

#### Installer PostgreSQL et Redis

**macOS (avec Homebrew) :**
```bash
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis
```

**Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install postgresql-15 redis-server
sudo systemctl start postgresql redis-server
```

#### Créer la base de données

```bash
# Créer la base
createdb linkedin_scheduler

# Exécuter les migrations
psql linkedin_scheduler < init.sql
```

#### Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend (dans un autre terminal)
cd frontend
npm install
```

#### Démarrer les serveurs

```bash
# Terminal 1 : Backend
cd backend
npm run dev

# Terminal 2 : Frontend
cd frontend
npm run dev
```

## 📱 Utilisation

1. **Se connecter**
   - Ouvrez http://localhost:5173
   - Cliquez sur "Se connecter avec LinkedIn"
   - Autorisez l'application

2. **Publier immédiatement**
   - Cliquez sur "Nouveau Post"
   - Écrivez votre contenu
   - Ne remplissez PAS la date
   - Cliquez sur "Publier maintenant"

3. **Programmer un post**
   - Cliquez sur "Nouveau Post"
   - Écrivez votre contenu
   - Sélectionnez une date/heure future
   - Cliquez sur "Programmer"
   - Le post sera publié automatiquement !

## 🔧 Configuration Avancée

### Variables d'environnement

```env
# LinkedIn (OBLIGATOIRE)
LINKEDIN_CLIENT_ID=your_id
LINKEDIN_CLIENT_SECRET=your_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# Base de données
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/linkedin_scheduler

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (générer avec: openssl rand -base64 32)
JWT_SECRET=your-super-secret-key

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## 📊 Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │ ───> │   Backend    │ ───> │  LinkedIn   │
│   (React)   │      │   (Node.js)  │      │     API     │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  PostgreSQL  │
                     │   (Posts)    │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Redis+BullMQ │
                     │   (Queue)    │
                     └──────────────┘
```

## 🔌 Endpoints API

### Authentification
- `GET /auth/linkedin` - Initier OAuth
- `GET /auth/linkedin/callback` - Callback OAuth
- `GET /api/auth/status` - Vérifier authentification

### Posts
- `POST /api/posts/schedule` - Programmer un post
- `POST /api/posts/publish-now` - Publier immédiatement
- `GET /api/posts` - Liste des posts
- `DELETE /api/posts/:id` - Supprimer un post

## 📈 Limites API LinkedIn

- 150 requêtes/jour par membre
- 100,000 requêtes/jour par application
- Images : max 10 MB
- Vidéos : support limité

## 🐛 Troubleshooting

### Erreur "Client ID invalide"
➡️ Vérifiez que vous avez bien copié le Client ID depuis LinkedIn Developer Portal

### Erreur "Redirect URI mismatch"
➡️ Dans LinkedIn Developer Portal, vérifiez que l'URL de redirection est exactement : `http://localhost:3000/auth/linkedin/callback`

### Posts non publiés automatiquement
➡️ Vérifiez les logs du worker : `docker-compose logs backend`

### Erreur de connexion à la base de données
➡️ Vérifiez que PostgreSQL est démarré : `docker-compose ps`

## 🚀 Déploiement en Production

### Backend (Render / Railway / Fly.io)
1. Pushez votre code sur GitHub
2. Connectez votre repo
3. Configurez les variables d'environnement
4. Ajoutez PostgreSQL et Redis

### Frontend (Vercel / Netlify)
1. Connectez votre repo GitHub
2. Framework Preset : Vite
3. Build Command : `npm run build`
4. Output Directory : `dist`

## 📝 TODO / Améliorations futures

- [ ] Upload d'images
- [ ] Support des vidéos
- [ ] Analytics des posts
- [ ] Templates réutilisables
- [ ] Multi-comptes LinkedIn
- [ ] Export/Import de posts
- [ ] Suggestions IA

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Support

Si vous rencontrez des problèmes, ouvrez une issue sur GitHub.

---

Made with ❤️ for LinkedIn automation
