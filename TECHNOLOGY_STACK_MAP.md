# TECHNOLOGY STACK MAP & IMPLEMENTATION BLUEPRINT

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. Executive Technology Strategy

| Module / Layer | Technology | Purpose & Selection Justification | Environment | External Dependency | Development / Local Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) + React 18/19 + TypeScript | High performance SSR/CSR, optimized bundling, responsive layouts, API routes & PWA support. | All | None | Full Local Native |
| **Styling & Design System** | Tailwind CSS + Lucide Icons + Custom Modern Tokens | High customizability, dark/light luxury theme, glassmorphism, responsive desktop 3-pane & mobile 5-tab layouts. | All | None | Tailwind JIT |
| **Client State** | Zustand + TanStack Query (React Query) | Clean separation of UI state (Zustand) and server cache/optimistic mutations (React Query). | All | None | In-Memory Stores |
| **Backend Framework** | Node.js + Express (Modular TypeScript Architecture) | High throughput, asynchronous I/O, unified TypeScript interfaces, robust middleware pipeline. | All | None | Node.js TS-Node / ESBuild |
| **Database & ORM** | PostgreSQL + Prisma ORM (45+ Normalized Models) | ACID compliance, strong relational integrity, full-text search, automated migrations, type-safe queries. | All | PostgreSQL Server | SQLite / PG Dual Mode |
| **Cache & Realtime State** | Redis + In-Memory Fallback | Ephemeral presence tracking, typing indicators, rate limiting, pub/sub horizontal scaling. | All | Redis Instance | In-Memory Key-Value Store |
| **Realtime Messaging** | WebSocket via Socket.io | Bidirectional low-latency transport, automatic reconnection, room management, binary support. | All | None | Built-in WebSocket Server |
| **Audio/Video Calling** | WebRTC + STUN/TURN Signaling Gateway | Peer-to-peer ultra-low-latency media streaming, camera toggle, screen sharing, audio device selection. | Production/Dev | STUN/TURN (e.g., Coturn/Twilio) | Public Google STUN / Local P2P |
| **File Storage** | S3-Compatible Storage Abstraction | Secure blob storage, presigned upload URLs, media streaming. | Production | AWS S3 / Cloudflare R2 / MinIO | Local File System Engine |
| **Media Processing** | Sharp (Images) + Web Audio API (Waveforms) | High-performance image transformation, thumbnailing, audio waveform extraction, canvas drawing. | Backend / Client | None | Native Node Buffers / Canvas |
| **Search Engine** | PostgreSQL Full-Text Search (tsvector/tsquery) | Deep search across messages, contacts, media metadata, channels, documents. | Development/Prod | Elasticsearch/OpenSearch (scale) | PG FTS & Indexed Tokenizer |
| **Background Queue** | BullMQ / Redis Job Queue & Native Crons | Asynchronous media conversion, disappearing message cleanup, status expiration (24h), event reminders. | All | Redis Instance | Native Interval Scheduler |
| **AI Assistant** | Configurable Multi-LLM Provider Adapter | In-chat AI queries, message summarization, multi-language translation, tone rewrite, image generation. | Production | Gemini API / OpenAI / Anthropic | Mock AI Provider & Rule Engine |
| **Payments / UPI** | UPI Sandboxed Payment Abstraction Layer | VPA resolution (`user@upi`), QR scan-and-pay, PIN authorization modal, transaction ledger. | Production | NPCI / Razorpay / Stripe | Sandbox Bank Gateway & Ledger |
| **Security & Cryptography** | Web Crypto API + Node `crypto` (AES-GCM / SHA-256) | E2EE key generation simulator, password hashing, session tokens, rate limiting, secure headers. | All | None | Standard WebCrypto / SubtleCrypto |
| **Push Notifications** | Web Push API (VAPID) + FCM/APNs Abstraction | Cross-platform background alert delivery, message preview controls, notification grouping. | Production | Firebase / Apple APNs | Local Web Notification & In-App Toaster |
| **Testing Engine** | Vitest + Supertest + Playwright E2E | Unit testing, REST API validation, WebSocket event testing, end-to-end browser workflows. | Development / CI | None | Vitest Local Runner |

---

## 2. Feature-to-Technology Decision Blueprint

### A. Authentication & Identity
- **Technologies**: Next.js Client Auth Forms, Node.js JWT + Refresh Tokens, Argon2id/Bcrypt hashing, WebAuthn Passkeys abstraction, Twilio/SMS OTP abstraction.
- **Traceability**: `AuthModal.tsx` -> `/api/auth/verify-otp` -> `AuthService.ts` -> `User` & `Session` tables -> JWT emission -> WebSocket auto-handshake.
- **Why**: Zero-trust session management with multi-device capability.

### B. Realtime Messaging & Presence
- **Technologies**: Socket.io Server, Redis Presence Store, PostgreSQL `Message` table, Optimistic UI caching.
- **Traceability**: `ChatComposer.tsx` -> Socket event `message:send` -> `MessageService.create()` -> PostgreSQL commit -> Socket broadcast `message:new` -> Recipient state update.
- **Why**: Under 20ms delivery latency, reliable delivery acknowledgements (`sent`, `delivered`, `read`).

### C. WebRTC Voice & Video Calling
- **Technologies**: Native WebRTC `RTCPeerConnection`, Socket.io Signaling (`call:offer`, `call:answer`, `call:ice`), Web Audio API analyzer.
- **Traceability**: `CallModal.tsx` -> `useWebRTC.ts` -> Signaling Gateway -> Callee Ringing Overlay -> P2P Media Stream.
- **Why**: Zero server media load for 1-on-1 calls, native browser hardware acceleration, crystal clear audio/video.

### D. Ephemeral Media & Stories (Status)
- **Technologies**: HTML5 Canvas, MediaRecorder API, Sharp / Web Audio, 24-Hour Expiration Cron Worker.
- **Traceability**: `StatusCreator.tsx` -> `/api/status/create` -> `Status` table -> 24h cron garbage collection.
- **Why**: Privacy-first transient content delivery matching user expectations.

### E. AI Assistant Engine ("Aura AI")
- **Technologies**: Provider Adapter (`GeminiAdapter`, `OpenAIAdapter`, `MockAdapter`), Server-Sent Events / Streaming.
- **Traceability**: `AIChatDrawer.tsx` -> `/api/ai/query` -> `AIService.process()` -> LLM stream -> Instant UI typewriter response.
- **Why**: Modular design allows switching AI models via environment variables without altering UI or database code.

### F. Sandboxed UPI Payments
- **Technologies**: UPI Protocol Abstraction, Decimal Transaction Ledger, Virtual Payment Address (VPA) Validator.
- **Traceability**: `SendMoneyModal.tsx` -> `/api/payments/transfer` -> `PaymentService.transact()` -> `Transaction` table -> Realtime receipt push.
- **Why**: High-fidelity payment workflow compliant with strict zero-PIN storage standards.
