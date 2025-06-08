#!/bin/bash
echo "🚀 Pulling latest code..."
git pull origin main

echo "🔧 Rebuilding Docker container..."
docker compose build

echo "⬆️ Restarting app..."
docker compose up -d

echo "📦 Applying Drizzle migrations..."
docker-compose exec your-app-name npx drizzle-kit push
# Or if using migrate:
# docker-compose exec your-app-name npx drizzle-kit migrate

echo "✅ Done!"
