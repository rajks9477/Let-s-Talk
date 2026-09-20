# PRODUCTION DEPLOYMENT & DEVOPS GUIDE

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. Production Docker Orchestration

The application includes an optimized multi-container setup via Docker Compose:

```bash
# Build and launch all services in detached mode
docker-compose up --build -d

# Check service health and logs
docker-compose ps
docker-compose logs -f
```

The stack provisions:
- `letstalk_postgres`: Production PostgreSQL database with persistent volume.
- `letstalk_redis`: High-speed cache and pub/sub cluster for real-time presence.
- `letstalk_backend`: Node.js Express server + WebSocket Gateway (Port 5000).
- `letstalk_frontend`: Next.js 14 standalone optimized client (Port 3000).

---

## 2. Environment Readiness Checklist
- [x] Configure production `DATABASE_URL` with SSL connection pooling.
- [x] Generate strong 64-character `JWT_SECRET` and `DATA_ENCRYPTION_KEY`.
- [x] Set up AWS S3 or Cloudflare R2 bucket credentials for media storage.
- [x] Configure Coturn or Twilio TURN credentials for WebRTC NAT traversal.
- [x] Configure LLM Provider API keys (`GEMINI_API_KEY` or `OPENAI_API_KEY`).
