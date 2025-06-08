#!/bin/bash
echo "🚀 Pulling latest code..."
git pull origin main

echo "🔧 Rebuilding Docker container..."
docker compose build

echo "⬆️ Restarting app..."
docker compose up -d

echo "📦 Applying Drizzle migrations..."
docker compose exec app npm run db:migrate

echo "✅ Done!"
