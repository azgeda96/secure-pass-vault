#!/bin/bash

# ===========================================
# Vault Access - Script de Démarrage
# ===========================================

set -e

echo "🔐 Vault Access - Démarrage du stack Docker"
echo "============================================"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose."
    exit 1
fi

# Créer les répertoires nécessaires
echo "📁 Création des répertoires..."
mkdir -p docker/db docker/kong

# Vérifier les fichiers requis
if [ ! -f "docker/db/init.sql" ]; then
    echo "❌ Fichier docker/db/init.sql manquant"
    exit 1
fi

if [ ! -f "docker/kong/kong.yml" ]; then
    echo "❌ Fichier docker/kong/kong.yml manquant"
    exit 1
fi

echo "✅ Fichiers de configuration trouvés"
echo ""

# Démarrer les services
echo "🚀 Démarrage des services..."
echo ""

if docker compose version &> /dev/null; then
    docker compose -f docker-compose.prod.yml up -d --build
else
    docker-compose -f docker-compose.prod.yml up -d --build
fi

echo ""
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier l'état des services
echo ""
echo "📊 État des services:"
echo ""

if docker compose version &> /dev/null; then
    docker compose -f docker-compose.prod.yml ps
else
    docker-compose -f docker-compose.prod.yml ps
fi

echo ""
echo "============================================"
echo "✅ Vault Access est prêt !"
echo ""
echo "🌐 URLs disponibles:"
echo "   - Frontend:  http://localhost:3000"
echo "   - API:       http://localhost:8000"
echo ""
echo "📝 Commandes utiles:"
echo "   - Voir les logs:    docker-compose -f docker-compose.prod.yml logs -f"
echo "   - Arrêter:          docker-compose -f docker-compose.prod.yml down"
echo "   - Redémarrer:       docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "⚠️  En production, changez les mots de passe dans docker-compose.prod.yml"
echo "============================================"
