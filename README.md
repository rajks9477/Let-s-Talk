# 💬 Let's Talk — Next-Generation Unified Communication Super App

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-emerald.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Realtime-red.svg)](https://webrtc.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black.svg)](https://socket.io/)

**Let's Talk** is an original, full-stack, production-grade communication and social platform inspired by modern messaging architectures (WhatsApp, Telegram, Signal). It provides real-time chat, WebRTC voice/video calls, 24h ephemeral status stories, public broadcast channels, interactive polls, in-chat events, sandboxed UPI payments, an AI assistant, and a full moderation console.

---

## 🌟 Key Capabilities

1. **One-to-One & Group Messaging**: Text formatting, emoji/stickers/GIFs, message editing, deletion (for me/everyone), star/pin, quoted replies, reactions, and live typing/presence.
2. **Media Studio & Audio Engine**: Canvas-based image editor (crop, rotate, draw, text, stickers), voice recording with real audio waveforms (1x/1.5x/2x playback), round instant video messages, and document attachments.
3. **WebRTC Voice & Video Calling**: Low-latency 1-on-1 and group calling, incoming call ringers, camera toggles, screen sharing with audio, and device selectors.
4. **Status Stories (24h)**: Ephemeral stories (text, photo, video, voice) with custom backgrounds, privacy controls (All / Except / Only), and real-time viewer lists.
5. **Channels & Communities**: Public/private broadcast channels with follower metrics, and nested multi-group communities with announcement feeds.
6. **Privacy & Chat Lock**: Secret Code search unlocking, passcode-protected folders, disappearing messages (24h, 7d, 90d), and granular last-seen/read-receipt controls.
7. **Sandboxed UPI Payments**: Send/request money via Virtual Payment Addresses (`user@upi`), simulated bank PIN keypad, and double-entry transaction ledger.
8. **AI Assistant ("Aura AI")**: In-chat AI companion, message summarization, translation across 20+ languages, and generative writing assistance.
9. **Admin & Moderation**: Centralized telemetry dashboard, user ban/suspension controls, abuse reports queue, and live feature registry inspector.

---

## 🏗️ Architecture & Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Zustand, TanStack Query, Web Audio API, HTML5 Canvas.
- **Backend**: Node.js, Express, TypeScript, Socket.io Gateway, WebRTC Signaling Server, Cron Background Scheduler.
- **Database**: PostgreSQL with Prisma ORM (45+ normalized models).
- **Cache & Realtime**: Redis (with seamless in-memory fallback for local dev).
- **Storage**: S3-compatible driver with local filesystem fallback.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ & npm
- PostgreSQL & Redis (or Docker)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/lets-talk.git
cd "Let's Talk"

# Copy environment template
cp .env.example .env

# Install dependencies for both apps
npm install
cd apps/server && npm install
cd ../web && npm install
cd ../..
```

### 3. Database Migration
```bash
npx prisma generate --schema=prisma/schema.prisma
npx prisma migrate dev --schema=prisma/schema.prisma --name init
```

### 4. Run Locally
```bash
# Run both Backend (Port 5000) and Frontend (Port 3000)
npm run dev
```

Visit **http://localhost:3000** to launch the app!

---

## 🐳 Running with Docker

```bash
docker-compose up --build -d
```

---

## 📖 Documentation Index

- [TECHNOLOGY_STACK_MAP.md](TECHNOLOGY_STACK_MAP.md) — Technical justifications and service mappings
- [FEATURE_REGISTRY.md](FEATURE_REGISTRY.md) — 610+ Feature status audit registry
- [ARCHITECTURE.md](ARCHITECTURE.md) — Detailed system design and diagrams
- [FEATURE_TECH_TRACEABILITY.md](FEATURE_TECH_TRACEABILITY.md) — Layer-by-layer traceability matrix
- [DATABASE.md](DATABASE.md) — Schema definitions and relational data models
- [API.md](API.md) — Complete REST & WebSocket API specification
- [SECURITY.md](SECURITY.md) — Cryptography, privacy, and security controls
- [SETUP.md](SETUP.md) — Local development and environment setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment instructions
