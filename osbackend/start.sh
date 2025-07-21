#!/bin/bash

# OSBackend Startup Script

echo "🚀 Starting OSBackend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please configure your environment variables in .env before proceeding."
    echo "💡 At minimum, set your STRIPE_SECRET_KEY and DEFAULT_FROM_EMAIL"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server..."
if [ "$1" == "dev" ]; then
    npm run dev
else
    npm start
fi