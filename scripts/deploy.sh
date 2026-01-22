#!/bin/bash

# Simple Deployment/Update Script
# Run this file on the VPS to update the site with latest GitHub code

echo "============================================="
echo "🚀 Starting HengMakara.com Update..."
echo "============================================="

# 1. Go to project directory
cd /var/www/hengmakara || { echo "❌ Project directory not found!"; exit 1; }

# 2. Discard local changes (to ensure clean pull)
# (Optional: remove this if you edit files directly on server)
git checkout .

# 3. Pull latest code
echo "⬇️ Pulling latest code from GitHub..."
git pull origin main

# 4. Install any new dependencies
echo "📦 Installing dependencies..."
npm install

# 5. Build the Next.js app
echo "🏗️ Building application..."
npm run build

# 6. Restart the server
echo "🔄 Restarting server..."
pm2 reload hengmakara || pm2 start npm --name "hengmakara" -- start

echo "============================================="
echo "✅ Update Complete! Site is live."
echo "============================================="
