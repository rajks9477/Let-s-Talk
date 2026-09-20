# FEATURE TECHNICAL TRACEABILITY MATRIX

## Project: Let's Talk - Next-Generation Unified Communication Super App

This document provides complete end-to-end traceability for all major modules from the UI layer down to the database and testing mechanisms.

---

### 1. Authentication & Onboarding (Features 1 - 20)
- **UI Component**: `apps/web/src/components/auth/AuthModal.tsx`
- **Frontend Service**: `apps/web/src/lib/api.ts -> authApi.login()`
- **API Endpoint**: `POST /api/auth/request-otp`, `POST /api/auth/verify-otp`, `POST /api/auth/onboard`
- **Backend Handler**: `apps/server/src/modules/auth/auth.controller.ts`
- **Backend Service**: `apps/server/src/modules/auth/auth.service.ts`
- **Database Model**: `User`, `Profile`, `PhoneVerification`, `Session`, `Passkey`
- **Realtime Event**: `presence:online`
- **Security Controls**: Rate limiting (5 attempts/min), Bcrypt OTP hash, JWT signing, CSRF protection.
- **Tests**: `apps/server/tests/auth.test.ts`

---

### 2. One-to-One & Group Messaging (Features 21 - 58, 206 - 242)
- **UI Component**: `apps/web/src/components/chat/ChatArea.tsx`, `apps/web/src/components/chat/MessageBubble.tsx`, `apps/web/src/components/chat/ChatComposer.tsx`
- **Frontend Service**: `apps/web/src/hooks/useChat.ts`, `apps/web/src/stores/chatStore.ts`
- **API Endpoint**: `GET /api/chats/:id/messages`, `POST /api/messages/send`, `PATCH /api/messages/:id/edit`, `DELETE /api/messages/:id`
- **Realtime Gateway**: `apps/server/src/realtime/socket.gateway.ts` (`message:send`, `message:new`, `message:edit`, `message:delete`, `message:reaction`, `typing:start`, `typing:stop`)
- **Backend Service**: `apps/server/src/modules/messages/messages.service.ts`
- **Database Model**: `Chat`, `ChatMember`, `Message`, `MessageReaction`, `MessageEdit`, `MessageDeletion`, `MessageReadReceipt`, `PinnedMessage`, `StarredMessage`
- **Security Controls**: Membership authorization guard, XSS HTML sanitization, Attachment quota checks.
- **Tests**: `apps/server/tests/messages.test.ts`

---

### 3. Media Studio, Voice & Round Video Messages (Features 59 - 120)
- **UI Component**: `apps/web/src/components/media/MediaStudioModal.tsx`, `apps/web/src/components/chat/VoiceRecorder.tsx`, `apps/web/src/components/chat/RoundVideoRecorder.tsx`
- **Frontend Engine**: Web Audio API `AudioContext` & Analyzer for waveforms, HTML5 Canvas for drawing/crop/filters, `MediaRecorder` for audio/video.
- **API Endpoint**: `POST /api/media/upload`, `GET /api/media/:id`
- **Backend Service**: `apps/server/src/modules/media/media.service.ts`
- **Storage Layer**: Local filesystem fallback / S3 presigned adapter (`apps/server/src/services/storage.service.ts`)
- **Database Model**: `Attachment`, `Media`, `Document`, `VoiceMessage`, `VideoMessage`
- **Security Controls**: Magic byte MIME validation, 100MB file size limit, Malware scan abstraction.
- **Tests**: `apps/server/tests/media.test.ts`

---

### 4. WebRTC Voice & Video Calling (Features 168 - 205)
- **UI Component**: `apps/web/src/components/calls/CallModal.tsx`, `apps/web/src/components/calls/IncomingCallBanner.tsx`, `apps/web/src/components/calls/CallsTab.tsx`
- **Frontend Engine**: `apps/web/src/hooks/useWebRTC.ts` (`RTCPeerConnection`, `navigator.mediaDevices.getUserMedia`, `getDisplayMedia`)
- **Realtime Gateway**: `apps/server/src/realtime/socket.gateway.ts` (`call:initiate`, `call:offer`, `call:answer`, `call:ice`, `call:end`, `call:reject`)
- **Backend Service**: `apps/server/src/modules/calls/calls.service.ts`
- **Database Model**: `Call`, `CallParticipant`, `CallEvent`, `CallLink`
- **Security Controls**: Authenticated signaling session, STUN/TURN credential issuance.
- **Tests**: `apps/server/tests/calls.test.ts`

---

### 5. Status Stories & Broadcast Channels (Features 284 - 342)
- **UI Component**: `apps/web/src/components/status/StatusViewerModal.tsx`, `apps/web/src/components/status/StatusCreatorModal.tsx`, `apps/web/src/components/channels/ChannelsTab.tsx`
- **Frontend Service**: `apps/web/src/stores/statusStore.ts`, `apps/web/src/stores/channelStore.ts`
- **API Endpoint**: `POST /api/status`, `GET /api/status/feed`, `POST /api/status/:id/view`, `POST /api/channels`, `POST /api/channels/:id/posts`
- **Backend Service**: `apps/server/src/modules/status/status.service.ts`, `apps/server/src/modules/channels/channels.service.ts`
- **Background Worker**: 24h Expiration Cron in `apps/server/src/services/cron.service.ts`
- **Database Model**: `Status`, `StatusViewer`, `StatusReaction`, `Channel`, `ChannelFollower`, `ChannelPost`, `ChannelReaction`
- **Security Controls**: Audience privacy check (`ALL`, `EXCEPT`, `ONLY`), Channel Admin verification.
- **Tests**: `apps/server/tests/status.test.ts`

---

### 6. Interactive Polls & In-Chat Events (Features 243 - 268)
- **UI Component**: `apps/web/src/components/chat/PollBubble.tsx`, `apps/web/src/components/chat/CreatePollModal.tsx`, `apps/web/src/components/chat/EventBubble.tsx`
- **API Endpoint**: `POST /api/polls`, `POST /api/polls/:id/vote`, `POST /api/events`, `POST /api/events/:id/rsvp`
- **Backend Service**: `apps/server/src/modules/polls/polls.service.ts`, `apps/server/src/modules/events/events.service.ts`
- **Database Model**: `Poll`, `PollOption`, `PollVote`, `Event`, `EventParticipant`
- **Realtime Event**: `poll:updated`, `event:updated`
- **Tests**: `apps/server/tests/polls.test.ts`

---

### 7. AI Assistant Engine ("Aura AI") (Features 442 - 455)
- **UI Component**: `apps/web/src/components/ai/AIAssistantDrawer.tsx`, `apps/web/src/components/chat/InChatAIHelper.tsx`
- **API Endpoint**: `POST /api/ai/chat`, `POST /api/ai/summarize`, `POST /api/ai/translate`, `POST /api/ai/rewrite`, `POST /api/ai/generate-image`
- **Backend Service**: `apps/server/src/modules/ai/ai.service.ts`
- **AI Providers**: Configurable Gemini / OpenAI / Local Mock Adapter
- **Database Model**: `AIConversation`, `AIMessage`
- **Security Controls**: Rate limiting, strict key isolation, no user data training storage.
- **Tests**: `apps/server/tests/ai.test.ts`

---

### 8. Sandboxed Payments / India UPI (Features 456 - 467)
- **UI Component**: `apps/web/src/components/payments/SendMoneyModal.tsx`, `apps/web/src/components/payments/PaymentsTab.tsx`, `apps/web/src/components/payments/UPIPinModal.tsx`
- **API Endpoint**: `POST /api/payments/vpa/verify`, `POST /api/payments/transfer`, `GET /api/payments/history`
- **Backend Service**: `apps/server/src/modules/payments/payments.service.ts`
- **Database Model**: `Payment`, `Transaction`
- **Security Controls**: Zero-PIN storage guarantee, double-entry transactional safety, sandbox ledger.
- **Tests**: `apps/server/tests/payments.test.ts`

---

### 9. Business Suite & Catalog (Features 468 - 503)
- **UI Component**: `apps/web/src/components/business/BusinessProfileModal.tsx`, `apps/web/src/components/business/ProductCatalogModal.tsx`, `apps/web/src/components/business/QuickRepliesSettings.tsx`
- **API Endpoint**: `GET /api/business/:userId`, `POST /api/business/catalog/product`, `GET /api/business/quick-replies`
- **Backend Service**: `apps/server/src/modules/business/business.service.ts`
- **Database Model**: `BusinessProfile`, `Catalog`, `Product`, `Order`, `QuickReply`, `Label`
- **Security Controls**: Owner authorization on catalog mutations, price & inventory validation.
- **Tests**: `apps/server/tests/business.test.ts`

---

### 10. Privacy, Chat Lock & Backups (Features 385 - 429)
- **UI Component**: `apps/web/src/components/privacy/ChatLockModal.tsx`, `apps/web/src/components/privacy/SecretCodeModal.tsx`, `apps/web/src/components/settings/BackupModal.tsx`
- **API Endpoint**: `POST /api/privacy/lock-chat`, `POST /api/privacy/secret-code`, `POST /api/backups/export`, `POST /api/backups/restore`
- **Backend Service**: `apps/server/src/modules/privacy/privacy.service.ts`, `apps/server/src/modules/backups/backups.service.ts`
- **Database Model**: `PrivacySetting`, `ChatLockSetting`, `Backup`, `SecurityEvent`
- **Security Controls**: Encrypted backup archives, hidden locked chat filter, biometric/passcode challenge simulation.
- **Tests**: `apps/server/tests/privacy.test.ts`
