# API & REALTIME WEBSOCKET SPECIFICATION

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/request-otp`: `{ phoneNumber, countryCode, method }` -> Send OTP simulation
- `POST /api/auth/verify-otp`: `{ phoneNumber, code }` -> Verify code and return JWT tokens
- `POST /api/auth/onboard`: `{ displayName, avatarUrl, bio, username }` -> Complete profile setup
- `GET  /api/auth/me`: Retrieve current authenticated session profile
- `POST /api/auth/logout`: Invalidate current session and clear refresh cookies

### Messaging & Chats (`/api/chats`, `/api/messages`)
- `GET  /api/chats`: List user's active conversations (with unread count, last message, pinned/muted)
- `POST /api/chats/direct`: `{ targetUserId }` -> Create or retrieve direct conversation
- `GET  /api/chats/:id/messages`: `{ cursor, limit }` -> Cursor-based paginated chat history
- `POST /api/messages/send`: `{ chatId, content, type, replyToId, isViewOnce, durationSeconds }`
- `PATCH /api/messages/:id/edit`: `{ newContent }` -> Edit sent message
- `DELETE /api/messages/:id`: `{ forEveryone: boolean }` -> Delete message
- `POST /api/messages/:id/react`: `{ emoji }` -> Toggle message reaction
- `POST /api/messages/:id/star`: Toggle star message
- `POST /api/messages/:id/pin`: Toggle pin message

### Media & Attachments (`/api/media`)
- `POST /api/media/upload`: Multipart upload with thumbnail and waveform processing -> Returns media object
- `GET  /api/media/:id`: Stream media file or fetch signed URL

### Groups & Communities (`/api/groups`, `/api/communities`)
- `POST /api/groups`: `{ name, description, avatarUrl, memberIds }` -> Create group
- `PATCH /api/groups/:id/permissions`: `{ sendMessagesPolicy, editInfoPolicy, adminApproval }`
- `POST /api/groups/:id/members`: Add participant or promote admin
- `POST /api/communities`: `{ name, description, iconUrl, groupIds }`

### WebRTC Calling (`/api/calls`)
- `POST /api/calls/initiate`: `{ recipientId, type: "VOICE" | "VIDEO" }` -> Create call record
- `PATCH /api/calls/:id/status`: `{ status: "CONNECTED" | "ENDED" | "MISSED" | "REJECTED" }`
- `GET  /api/calls/history`: Fetch user's voice and video call logs

### Status Stories (`/api/status`)
- `POST /api/status`: `{ type, content, mediaUrl, bgGradient, caption, privacy }`
- `GET  /api/status/feed`: Fetch unexpired status stories grouped by contact
- `POST /api/status/:id/view`: Log viewer receipt

### Channels (`/api/channels`)
- `GET  /api/channels/discover`: List public channels by category
- `POST /api/channels`: `{ name, description, avatarUrl, category }`
- `POST /api/channels/:id/follow`: Follow / Unfollow channel
- `POST /api/channels/:id/posts`: Publish broadcast post

### Sandboxed Payments (`/api/payments`)
- `POST /api/payments/vpa/verify`: `{ vpa }` -> Validate UPI handle
- `POST /api/payments/transfer`: `{ receiverVpa, amount, note, pinToken }` -> Execute transaction
- `GET  /api/payments/history`: Transaction statement ledger

### AI Assistant (`/api/ai`)
- `POST /api/ai/chat`: `{ message, conversationId }` -> Conversational AI assistant
- `POST /api/ai/summarize`: `{ text }` -> Message/thread summary
- `POST /api/ai/translate`: `{ text, targetLang }` -> Message translation
- `POST /api/ai/rewrite`: `{ text, tone: "professional" | "friendly" | "concise" }`

### Admin & Moderation (`/api/admin`)
- `GET  /api/admin/metrics`: Active users, storage usage, websocket connections, telemetry
- `GET  /api/admin/reports`: List pending user/group abuse reports
- `POST /api/admin/ban-user`: `{ userId, reason }` -> Suspend account

---

## 2. Realtime WebSocket Events (Socket.io)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `presence:update` | Client <-> Server | `{ status: "online" \| "offline" }` | Real-time presence broadcast |
| `typing:start` | Client -> Server | `{ chatId }` | User started typing |
| `typing:stop` | Client -> Server | `{ chatId }` | User stopped typing |
| `message:send` | Client -> Server | Message payload | Send new message |
| `message:new` | Server -> Client | Message entity | Incoming message push |
| `message:delivered`| Server -> Client | `{ messageId, userId }` | Delivered receipt |
| `message:read` | Server -> Client | `{ messageId, userId }` | Read receipt |
| `message:edited` | Server -> Client | `{ messageId, newContent }` | Message edited notification |
| `message:deleted`| Server -> Client | `{ messageId, forEveryone }` | Message deleted notification |
| `message:reaction`| Server -> Client | `{ messageId, userId, emoji }` | Reaction update |
| `call:incoming` | Server -> Client | `{ callId, caller, type }` | Ringing incoming call modal |
| `call:offer` | Client <-> Server | `{ callId, sdpOffer }` | WebRTC SDP Offer |
| `call:answer` | Client <-> Server | `{ callId, sdpAnswer }` | WebRTC SDP Answer |
| `call:ice` | Client <-> Server | `{ callId, candidate }` | WebRTC ICE Candidate exchange |
| `call:end` | Client <-> Server | `{ callId, reason }` | Terminate active call |
| `poll:updated` | Server -> Client | Poll entity with live votes | Real-time poll vote updates |
