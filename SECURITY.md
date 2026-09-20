# SECURITY & PRIVACY CONTROLS

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. Zero-PIN Storage & Financial Safety
- **Strict Prohibition**: Neither the client nor backend database ever persists banking passwords, card numbers, or UPI PINs.
- **PIN Authorization Model**: The UPI authorization modal operates with client-side ephemeral cryptographic challenges that are verified against the mock bank gateway sandbox.

---

## 2. End-to-End Encryption Architecture
- **Protocol Foundations**: Uses the Web Crypto API (`SubtleCrypto`) utilizing AES-256-GCM symmetric encryption for message payloads and media chunks.
- **Key Exchange Simulation**: Ephemeral session keys are established using ECDH (Elliptic-Curve Diffie-Hellman, P-256 / Curve25519) public/private key pairs.
- **Backup Encryption**: Chat export archives are encrypted locally with PBKDF2 key derivation from a user-supplied passphrase before being saved or exported.

---

## 3. Ephemeral Media & Disappearing Lifecycle
- **View-Once Enforcement**: Media marked as `isViewOnce` is served with one-time access tokens and permanently invalidated after initial playback or download.
- **Disappearing Messages Engine**: Background cron tasks run at regular intervals to purge messages whose `expiresAt` timestamp has elapsed, respecting any explicitly `kept` message overrides.

---

## 4. API & Application Hardening
- **Rate Limiting**: Redis-backed token bucket rate limiters protect auth endpoints (5 req/min) and AI endpoints (20 req/min).
- **Input Sanitization & XSS Protection**: All incoming message content and profile fields are sanitized against malicious script tags and HTML injection.
- **Security Headers**: Standard Helmet middleware configuration enforces CSP (Content Security Policy), HSTS, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.
- **Role-Based Authorization (RBAC)**: Fine-grained middleware ensures that administrative commands and group moderation actions are verified against database roles before execution.
