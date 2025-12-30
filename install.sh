#!/bin/bash

# Script d'installation automatique pour LinkedIn Scheduler
# Ce script installe toutes les dépendances et démarre l'application

set -e  # Arrêter en cas d'erreur

echo "🚀 Installation de LinkedIn Scheduler..."
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si Homebrew est installé
if ! command -v brew &> /dev/null; then
    log_error "Homebrew n'est pas installé."
    log_info "Veuillez installer Homebrew d'abord avec:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
fi

log_success "Homebrew est installé"

# Installer PostgreSQL si nécessaire
if ! command -v psql &> /dev/null; then
    log_info "Installation de PostgreSQL..."
    brew install postgresql@15
    log_success "PostgreSQL installé"
else
    log_success "PostgreSQL déjà installé"
fi

# Installer Redis si nécessaire
if ! command -v redis-server &> /dev/null; then
    log_info "Installation de Redis..."
    brew install redis
    log_success "Redis installé"
else
    log_success "Redis déjà installé"
fi

# Démarrer PostgreSQL
log_info "Démarrage de PostgreSQL..."
brew services start postgresql@15
sleep 3
log_success "PostgreSQL démarré"

# Démarrer Redis
log_info "Démarrage de Redis..."
brew services start redis
sleep 2
log_success "Redis démarré"

# Créer la base de données si elle n'existe pas
log_info "Configuration de la base de données..."
if psql -lqt | cut -d \| -f 1 | grep -qw linkedin_scheduler; then
    log_info "Base de données linkedin_scheduler existe déjà"
else
    createdb linkedin_scheduler
    log_success "Base de données linkedin_scheduler créée"
fi

# Initialiser le schéma
log_info "Initialisation du schéma de la base de données..."
psql linkedin_scheduler < init.sql
log_success "Schéma initialisé"

# Installer les dépendances du backend
log_info "Installation des dépendances du backend..."
cd backend
npm install
log_success "Dépendances backend installées"
cd ..

# Installer les dépendances du frontend
log_info "Installation des dépendances du frontend..."
cd frontend
npm install
log_success "Dépendances frontend installées"
cd ..

echo ""
log_success "🎉 Installation terminée avec succès!"
echo ""
echo "Pour démarrer l'application, exécutez:"
echo ""
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Ou utilisez le script de démarrage:"
echo ""
echo "  ./start.sh"
echo ""
