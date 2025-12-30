#!/bin/bash

# Script de démarrage rapide - Sans Homebrew requis
# Utilise des services cloud pour PostgreSQL et Redis

set -e

echo "🚀 Démarrage rapide de LinkedIn Scheduler..."
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "Installez Node.js depuis: https://nodejs.org/"
    exit 1
fi

log_success "Node.js trouvé: $(node --version)"

# Vérifier le fichier .env
if [ ! -f ".env" ]; then
    log_warning ".env non trouvé, copie depuis .env.example..."
    cp .env.example .env
    log_info "⚠️  N'oubliez pas de configurer vos clés LinkedIn dans .env"
fi

# Installer les dépendances backend si nécessaire
if [ ! -d "backend/node_modules" ]; then
    log_info "Installation des dépendances backend..."
    cd backend && npm install && cd ..
    log_success "Dépendances backend installées"
else
    log_success "Dépendances backend déjà installées"
fi

# Installer les dépendances frontend si nécessaire
if [ ! -d "frontend/node_modules" ]; then
    log_info "Installation des dépendances frontend..."
    cd frontend && npm install && cd ..
    log_success "Dépendances frontend installées"
else
    log_success "Dépendances frontend déjà installées"
fi

# Créer le dossier logs
mkdir -p logs

# Démarrer le backend en arrière-plan
log_info "Démarrage du backend sur http://localhost:3000..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

sleep 5

# Démarrer le frontend en arrière-plan
log_info "Démarrage du frontend sur http://localhost:5173..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
cd ..

sleep 3

echo ""
log_success "🎉 Application démarrée avec succès !"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "💚 Health:   http://localhost:3000/health"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 Pour arrêter: ./stop.sh"
echo "   Ou: kill $BACKEND_PID $FRONTEND_PID"
echo ""
