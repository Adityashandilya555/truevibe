#!/bin/bash

# Build and Preview Script for TrueVibe PWA
# This script builds the application and starts a preview server

echo "🔨 Building TrueVibe PWA..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "🚀 Starting preview server..."
  npm run preview
else
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi
