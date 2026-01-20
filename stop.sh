#!/bin/bash

# ===========================================
# Vault Access - Script d'Arrêt
# ===========================================

echo "🛑 Vault Access - Arrêt des services..."
echo ""

if docker compose version &> /dev/null; then
    docker compose -f docker-compose.prod.yml down
else
    docker-compose -f docker-compose.prod.yml down
fi

echo ""
echo "✅ Tous les services ont été arrêtés."
echo ""
echo "💾 Les données sont conservées dans le volume vault-db-data"
echo "   Pour supprimer les données: docker volume rm vault-access_vault-db-data"
