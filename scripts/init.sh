#!/bin/bash

# Frontend AI Template - Initialization Script
# This script helps you set up a new project from this template

set -e

echo "🚀 Frontend AI Template - Project Setup"
echo "========================================"
echo ""

# Get project name
read -p "Enter your project name: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Project name is required"
  exit 1
fi

# Convert to lowercase with dashes
SLUG=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

echo ""
echo "📝 Updating project configuration..."

# Update package.json
sed -i.bak "s/\"name\": \"frontend-ai-template\"/\"name\": \"$SLUG\"/" package.json
rm -f package.json.bak

# Update README title
sed -i.bak "s/# Frontend + AI Engineering Template/# $PROJECT_NAME/" README.md
rm -f README.md.bak

# Update layout.tsx metadata
sed -i.bak "s/title: \"AI Chat Template\"/title: \"$PROJECT_NAME\"/" app/layout.tsx
rm -f app/layout.tsx.bak

echo "✅ Updated package.json, README.md, and layout.tsx"

# Setup environment
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local from .env.example"
  echo ""
  echo "⚠️  Please add your API keys to .env.local:"
  echo "   - GOOGLE_GENERATIVE_AI_API_KEY (recommended - free tier)"
  echo "   - OPENAI_API_KEY (optional)"
else
  echo "ℹ️  .env.local already exists, skipping"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Initialize git if not already initialized
if [ ! -d .git ]; then
  echo ""
  echo "🔧 Initializing git repository..."
  git init
  git add .
  git commit -m "feat: initial project setup from frontend-ai-template"
  echo "✅ Git repository initialized with initial commit"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your API keys to .env.local"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Open http://localhost:3000"
echo ""
