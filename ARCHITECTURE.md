# ARCHITECTURE & SYSTEM DESIGN SPECIFICATION

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. Architectural Overview

"Let's Talk" is engineered as a high-throughput, event-driven, modular communication super-app. It unifies one-to-one messaging, group collaboration, WebRTC audio/video calling, 24h ephemeral status stories, broadcast channels, sandboxed UPI payments, an extensible AI assistant, and a full moderation console.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|  Next.js 14+ / React / Tailwind CSS / Zustand / TanStack Query / WebRTC / Canvas   |
+----------------------------------------+------------------------------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                HTTPS / REST API                   WebSocket / Socket.io
                       |                                   |
+----------------------v-----------------------------------v------------------------+
|                                BACKEND APPLICATION GATEWAY                        |
|                                                                                   |
|  +---------------------+   +---------------------+   +--------------------------+ |
|  | Auth & User Module  |   | Chat & Msg Engine   |   | WebRTC Signaling Gateway | |
|  +---------------------+   +---------------------+   +--------------------------+ |
|  | Media & Files (S3)  |   | Channels & Status   |   | Background Cron Jobs     | |
|  +---------------------+   +---------------------+   +--------------------------+ |
|  | Payments (UPI)      |   | AI Assistant Engine |   | Admin & Moderation       | |
|  +---------------------+   +---------------------+   +--------------------------+ |
+----------------------------------------+------------------------------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
+----------------------v-------+                   +-------v------------------------+
|      PRISMA ORM LAYER        |                   |      REDIS / IN-MEMORY CACHE   |
|   PostgreSQL (45+ Models)    |                   |  Presence, Typing, Pub/Sub     |
+------------------------------+                   +--------------------------------+
```

---

## 2. Key Subsystems

### A. Realtime & WebSocket Gateway
- **Transport**: Socket.io over WebSockets with automatic reconnection, heartbeat/ping-pong, and multi-room broadcasting.
- **Presence & Typing**: Transient presence state (`online`, `offline`, `lastSeen`) cached in Redis / fast in-memory map without generating constant DB write amplification.
- **Delivery Flow**: Sent -> Delivered (when recipient client acks socket receipt) -> Read (when active chat viewport observer confirms message is visible).

### B. WebRTC Calling Engine (Voice & Video)
- **Protocol**: Standard Peer-to-Peer WebRTC via `RTCPeerConnection`.
- **Signaling**: WebSocket signaling channel exchanging `call:offer`, `call:answer`, and `call:ice` candidates.
- **Media Features**: Audio stream mute/unmute, Camera toggle/flip, Screen sharing with display audio, Audio output device selection (Bluetooth/Speaker/Headset), Call links, and ringtone notifications.

### C. Ephemeral Media & Status Stories
- **Lifecycle**: Status stories automatically marked expired after 24 hours via database timestamp filtering and background cleanup worker.
- **Privacy Engine**: Selective sharing via `ALL`, `EXCEPT_CONTACTS`, or `ONLY_SHARE_WITH` access control lists.
- **Viewer Receipts**: Real-time viewer logging with timestamp and optional quick reaction emoji.

### D. Sandboxed Payments (India UPI)
- **Security**: Strict zero-PIN storage policy. Simulated PIN authorization modal operates with client-side zero-trust ephemeral tokens.
- **Ledger**: Double-entry transaction model recording sender, receiver, VPA (`user@upi`), currency, amount, note, and status (`PENDING`, `COMPLETED`, `FAILED`).

### E. AI Assistant Engine ("Aura AI")
- **Pluggable Architecture**: Provider pattern (`GeminiProvider`, `OpenAIProvider`, `AnthropicProvider`, `MockLocalProvider`).
- **Features**: Standalone AI companion chat, in-chat `@AI` tagging, automatic message summarization, 20+ language translation, tone rephrasing, and generative image prompt creation.

### F. Security & Privacy Suite
- **Chat Lock & Secret Code**: Encrypted folder for private chats; hidden chats revealed solely by typing a custom Secret Code into the search bar.
- **Disappearing Messages**: Configurable per-chat/group timers (24 hours, 7 days, 90 days) with "Keep Message" override protection.
- **E2EE Architecture**: Cryptographic key exchange simulation (WebCrypto AES-GCM 256-bit keys) with tamper-evident message signatures.
