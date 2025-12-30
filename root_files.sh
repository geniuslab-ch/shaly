# ================================
# .gitignore
# ================================
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.tsbuildinfo

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
logs/
*.log

# Database
*.sqlite
*.db

# Docker
.docker/

# Temporary files
tmp/
temp/
*.tmp

# Coverage
coverage/
.nyc_output/

# ================================
# .env.example
# ================================
# LinkedIn API Credentials
# Get these from https://www.linkedin.com/developers/apps
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/linkedin_scheduler

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=change-this-to-a-random-secret-in-production

# Backend URL
BACKEND_URL=http://localhost:3000
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server
PORT=3000
NODE_ENV=development

# ================================
# docker-compose.yml
# ================================
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: linkedin_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: linkedin_scheduler
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: linkedin_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  backend:
    build: ./backend
    container_name: linkedin_backend
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/linkedin_scheduler
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: ${JWT_SECRET:-dev-secret-change-in-production}
      LINKEDIN_CLIENT_ID: ${LINKEDIN_CLIENT_ID}
      LINKEDIN_CLIENT_SECRET: ${LINKEDIN_CLIENT_SECRET}
      LINKEDIN_REDIRECT_URI: ${LINKEDIN_REDIRECT_URI:-http://localhost:3000/auth/linkedin/callback}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:5173}
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    container_name: linkedin_frontend
    restart: unless-stopped
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:3000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
  redis_data:

# ================================
# init.sql
# ================================
-- Suppression des tables si elles existent
DROP TABLE IF EXISTS scheduled_posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table des utilisateurs
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  linkedin_id VARCHAR(255) UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des posts programmés
CREATE TABLE scheduled_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_for TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  linkedin_post_id VARCHAR(255),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_users_linkedin_id ON users(linkedin_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);
CREATE INDEX idx_scheduled_posts_user_status ON scheduled_posts(user_id, status);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at sur users
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insérer un utilisateur de test (optionnel, à supprimer en production)
-- INSERT INTO users (linkedin_id, access_token, token_expires_at, email, name)
-- VALUES ('test123', 'dummy_token', NOW() + INTERVAL '1 day', 'test@example.com', 'Test User');

-- Afficher les tables créées
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

# ================================
# README.md
# ================================
# 🚀 LinkedIn Scheduler

Automatisez la publication de vos posts LinkedIn avec une vraie intégration API officielle.

![LinkedIn Scheduler](https://img.shields.io/badge/LinkedIn-API%20v2-0077B5?style=for-the-badge&logo=linkedin)
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
# Cloner le projet
git clone <votre-repo>
cd linkedin-scheduler

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

Made with ❤️ by [Votre Nom]