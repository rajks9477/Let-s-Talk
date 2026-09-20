# DATABASE ARCHITECTURE & SCHEMA REFERENCE

## Project: Let's Talk - Next-Generation Unified Communication Super App

---

## 1. Relational Entity Overview (45+ Entities)

The database is built on PostgreSQL with Prisma ORM and is organized into 12 core domains:

```
+-----------------------------------------------------------------------------------+
| 1. AUTH & IDENTITY       | User, Profile, PhoneVerification, Passkey, Session,    |
|                          | TwoFactorAuth, Device                                  |
| 2. SOCIAL & PRIVACY      | Contact, BlockedUser, PrivacySetting, SecurityEvent    |
| 3. CONVERSATIONS         | Chat, ChatMember, Message, Reaction, Edit, Deletion,   |
|                          | ReadReceipt, PinnedMessage, StarredMessage, ChatLock   |
| 4. MEDIA & ATTACHMENTS   | Attachment                                             |
| 5. GROUPS & COMMUNITIES  | Group, GroupMember, Community, CommunityMember         |
| 6. INTERACTIVE WIDGETS   | Poll, PollOption, PollVote, Event, EventParticipant    |
| 7. STORIES & BROADCASTS  | Status, StatusViewer, StatusReaction, Channel, Follower|
| 8. WEBRTC CALLING        | Call, CallParticipant, CallEvent                       |
| 9. PAYMENTS & LEDGER     | Payment, Transaction                                   |
| 10. BUSINESS CRM         | BusinessProfile, Catalog, Product, QuickReply, Label   |
| 11. AI CONVERSATIONS     | AIConversation, AIMessage                              |
| 12. AUDIT & MODERATION   | Notification, Backup, Report, ModerationAction, Log    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Key Foreign Keys & Cascading Policies

- `User` -> `Profile`, `Session`, `Device`, `PrivacySetting`: `ON DELETE CASCADE` ensures total account data scrubbing upon user deletion.
- `Chat` -> `Message`, `ChatMember`, `ChatLockSetting`: `ON DELETE CASCADE` cleans up all related message nodes and membership records.
- `Message` -> `MessageReaction`, `MessageEdit`, `MessageReadReceipt`, `Attachment`, `Poll`, `Event`: `ON DELETE CASCADE` keeps message sub-entities synchronized.
- `Message` -> `Message.replyToId`: `ON DELETE SET NULL` prevents dangling references if an older quoted message is removed.

---

## 3. High-Performance Indexing Strategy

1. `Message(chatId, createdAt DESC)`: Instant cursor-based pagination and recent chat history lookups.
2. `ChatMember(userId, isArchived, isPinned)`: Fast retrieval of the user's active inbox conversations.
3. `Status(userId, expiresAt)`: Sub-millisecond filtering of unexpired 24-hour status stories.
4. `PhoneVerification(phoneNumber, expiresAt)`: Fast OTP verification lookups.
5. `CallParticipant(userId, status)`: Fast incoming call routing queries.
