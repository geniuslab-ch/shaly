#!/bin/bash

# Script de démarrage pour LinkedIn Scheduler
# Démarre le backend et le frontend dans des processus séparés

set -e

echo "🚀 Démarrage de LinkedIn Scheduler..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Vérifier que PostgreSQL est démarré
if ! brew services list | grep postgresql@15 | grep started > /dev/null; then
    log_info "Démarrage de PostgreSQL..."
    brew services start postgresql@15
    sleep 3
fi

# Vérifier que Redis est démarré
if ! brew services list | grep redis | grep started > /dev/null; then
    log_info "Démarrage de Redis..."
    brew services start redis
    sleep 2
fi

log_success "Services démarrés (PostgreSQL + Redis)"

# Créer des fichiers de log
mkdir -p logs

# Démarrer le backend en arrière-plan
log_info "Démarrage du backend sur http://localhost:3000..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
cd ..

# Attendre que le backend soit prêt
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
log_success "🎉 Application démarrée avec succès!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "💚 Health:   http://localhost:3000/health"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "Pour arrêter l'application, exécutez: ./stop.sh"
echo ""
