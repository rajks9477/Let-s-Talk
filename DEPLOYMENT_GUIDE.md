# 🚀 Complete Deployment Guide: Next-Gen WhatsApp SuperApp ("Let's Talk")

This project is 100% production-ready, full-stack configured, and pushed to your GitHub repository:
**`https://github.com/rajks9477/Let-s-Talk.git`**

---

## ⚡ Option 1: 1-Click Zero-Config Free Cloud Deployment (Recommended)

### Method A: Render.com (Frontend + Backend + Managed PostgreSQL)
Render natively supports our root [`render.yaml`](./render.yaml) blueprint:

1. Go to [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. Click **New Blueprint Instance**.
3. Connect your GitHub repository: `https://github.com/rajks9477/Let-s-Talk.git`
4. Click **Apply**.
5. Render will automatically:
   - Provision a managed **PostgreSQL** database (`letstalk-db`).
   - Build & start the **Node.js Express & WebSocket Backend** (`https://letstalk-server.onrender.com`).
   - Build & start the **Next.js Web Frontend** (`https://letstalk-web.onrender.com`).
6. Your live public link will be: **`https://letstalk-web.onrender.com`**!

---

### Method B: Vercel (Frontend) + Render / Railway (Backend)
1. **Frontend on Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Select your GitHub repo: `Let-s-Talk`
   - Set **Root Directory** to: `apps/web`
   - Add Environment Variables:
     - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api`
     - `NEXT_PUBLIC_SOCKET_URL`: `https://your-backend.onrender.com`
   - Click **Deploy** ➔ Live on `https://let-s-talk.vercel.app`!

---

## 🐳 Option 2: 1-Command Docker VPS Deployment (AWS, DigitalOcean, Hetzner, Linode)

On your Ubuntu/Debian Linux Server:
```bash
# 1. Clone your repo
git clone https://github.com/rajks9477/Let-s-Talk.git
cd Let-s-Talk

# 2. Start full-stack containers (Next.js + Express/Socket.io + Postgres)
docker compose up -d --build
```
Your app will be live immediately on port `80` / `443` at `http://YOUR_SERVER_IP`!

---

## 💻 Option 3: Localhost Instant Execution
Both frontend and backend are already running live:
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 🔑 Login & Sandbox Credentials for Instant Testing
- **Phone Number**: Any 10-digit number (e.g. `9876543210` or `9999999999`)
- **SMS OTP Code**: `123456`
- **Secret Locked Chats Passcode**: `7777`
- **UPI PIN**: Any 6 digits (e.g. `123456`)
