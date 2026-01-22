# Deployment Guide

This project is a Next.js application that uses local JSON files for data storage (`/data/*.json`). Because of this file-based database, the hosting requirements are slightly different from a standard static site if you want the **Admin Panel** to work properly.

## Option 1: Vercel (Easiest, but Read-Only)
**Best for:** Free hosting, super fast setup.
**Limitation:** The Admin Panel changes will **NOT** be permanent. Vercel is "Serverless", meaning the file system resets frequently. You can update content by editing the JSON files in your code locally and pushing to GitHub, but you cannot use the online Admin Dashboard to save changes permanently.

1. Push your code to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and sign up/login.
3. Click **"Add New Project"** and import your GitHub repository.
4. In the "Environment Variables" section, add:
   - `JWT_SECRET`: (Generate a random string)
   - `ENABLE_PERSISTENCE`: `false`
5. Click **Deploy**.

---

## Option 2: VPS / Node.js Hosting (Recommended for Admin Panel)
**Best for:** Full functionality. Admin Panel saves changes permanently.
**Providers:** DigitalOcean, Linode, Hetzner, Railway, Render (with Disk), or any cPanel host with Node.js support.

### Requirements
- A server running Node.js 18+
- Nginx (for reverse proxy)
- PM2 (process manager)

### Steps (Ubuntu/Linux VPS)

1. **Connect to your server** via SSH.
2. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. **Clone your repository**:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
4. **Install Dependencies**:
   ```bash
   npm install
   ```
5. **Setup Environment Variables**:
   Create a `.env` file:
   ```bash
   nano .env
   ```
   Paste the content (adjusting values):
   ```env
   JWT_SECRET=your-random-secret-key-here
   ENABLE_PERSISTENCE=true
   ```
6. **Build the Application**:
   ```bash
   npm run build
   ```
7. **Start with PM2** (keeps the app running):
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "nextjs-app" -- start
   pm2 save
   pm2 startup
   ```
8. **Configure Nginx** (to point port 80 to 3000):
   (Create a config file in `/etc/nginx/sites-available/default`)

---

## Option 3: Docker (Advanced)
If you prefer containerization, you can create a `Dockerfile`.

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
WARNING: Data in `/data` will be lost when the container restarts unless you mount a **Docker Volume** to `/app/data`.

