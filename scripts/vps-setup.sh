#!/bin/bash

# VPS Deployment Script for Next.js
# Run this on your Ubuntu VPS

# Configuration
APP_DIR="/var/www/hengmakara"
REPO_URL="https://github.com/makarouy/hengmakara.com.git"
DOMAIN_OR_IP="157.10.72.125"

# Colors
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}      Starting VPS Auto-Deployment Script           ${NC}"
echo -e "${GREEN}====================================================${NC}"

# 1. Update System
echo -e "${GREEN}[1/8] Updating system packages...${NC}"
# Prevent interactive prompts
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Node.js (v20)
echo -e "${GREEN}[2/8] Installing Node.js & Dependencies...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs build-essential git nginx
else
    echo "Node.js already installed."
    sudo apt-get install -y git nginx
fi

# 3. Install PM2
echo -e "${GREEN}[3/8] Installing Process Manager (PM2)...${NC}"
sudo npm install -g pm2

# 4. Setup Directory & Clone
echo -e "${GREEN}[4/8] Setting up application directory...${NC}"
if [ -d "$APP_DIR" ]; then
    echo "Directory $APP_DIR exists. Pulling latest changes..."
    cd $APP_DIR
    sudo git pull origin main
else
    echo "Cloning repository..."
    sudo git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# 5. Install Dependencies & Build
echo -e "${GREEN}[5/8] Installing project dependencies...${NC}"
sudo npm install

echo -e "${GREEN}[5/8] Building Next.js application...${NC}"
sudo npm run build

# 6. Configure PM2
echo -e "${GREEN}[6/8] Configuring PM2 Process Manager...${NC}"
pm2 stop hengmakara &> /dev/null || true
pm2 delete hengmakara &> /dev/null || true
# Start Next.js on port 3000
pm2 start npm --name "hengmakara" -- start
pm2 save
# Generate startup script (running blindly might fail if user strict, but usually works on standard ubuntu)
# Note: The user may need to run the command output by 'pm2 startup' manually if this fails.

# 7. Configure Nginx
echo -e "${GREEN}[7/8] Configuring Nginx Web Server...${NC}"
# Remove default site if exists
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Create Nginx Config
sudo bash -c "cat > /etc/nginx/sites-available/hengmakara" <<EOF
server {
    listen 80;
    server_name $DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
if [ ! -f "/etc/nginx/sites-enabled/hengmakara" ]; then
    sudo ln -s /etc/nginx/sites-available/hengmakara /etc/nginx/sites-enabled/
fi

# Test and Restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# 8. Firewall
echo -e "${GREEN}[8/8] Configuring Firewall (UFW)...${NC}"
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
# Only enable if not already active to avoid locking out, though allow OpenSSH handles it.
# sudo ufw --force enable 

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}   Deployment Complete!                             ${NC}"
echo -e "${GREEN}   Visit http://$DOMAIN_OR_IP                       ${NC}"
echo -e "${GREEN}====================================================${NC}"
