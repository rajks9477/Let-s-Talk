export interface UserProfile {
  id: string;
  phoneNumber: string;
  role: string;
  profile?: {
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    themePreference?: string;
  };
}

export interface Attachment {
  id?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  waveform?: number[];
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  durationSec?: number;
  isHD?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: { userId: string }[];
}

export interface Poll {
  id: string;
  question: string;
  isMultipleChoice: boolean;
  options: PollOption[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime?: string;
  participants: { userId: string; rsvp: 'GOING' | 'NOT_GOING' | 'MAYBE' }[];
}

export interface MessageReaction {
  id?: string;
  userId: string;
  emoji: string;
  user?: { profile?: { displayName: string } };
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content?: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'VOICE' | 'ROUND_VIDEO' | 'DOCUMENT' | 'POLL' | 'EVENT' | 'LOCATION' | 'CONTACT' | 'STICKER' | 'SYSTEM';
  replyToId?: string;
  replyTo?: Message;
  isForwarded?: boolean;
  isViewOnce?: boolean;
  isViewed?: boolean;
  isDisappearing?: boolean;
  expiresAt?: string;
  isEdited?: boolean;
  isDeletedForAll?: boolean;
  createdAt: string;
  sender?: {
    id: string;
    phoneNumber?: string;
    profile?: { displayName: string; avatarUrl?: string };
  };
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  poll?: Poll;
  event?: Event;
  isStarred?: boolean;
  isPinned?: boolean;
}

export interface ChatMember {
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  isMuted?: boolean;
  isArchived?: boolean;
  isPinned?: boolean;
  unreadCount?: number;
  user?: {
    phoneNumber?: string;
    profile?: { displayName: string; avatarUrl?: string; bio?: string };
  };
}

export interface Chat {
  id: string;
  type: 'DIRECT' | 'GROUP' | 'COMMUNITY' | 'CHANNEL';
  name?: string;
  description?: string;
  avatarUrl?: string;
  lastMessageAt: string;
  unreadCount?: number;
  members: ChatMember[];
  messages?: Message[];
  isLocked?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  isMuted?: boolean;
  wallpaperUrl?: string;
}

export interface StatusStory {
  id: string;
  userId: string;
  type: 'TEXT' | 'PHOTO' | 'VIDEO' | 'VOICE';
  content?: string;
  mediaUrl?: string;
  bgGradient?: string;
  caption?: string;
  createdAt: string;
  expiresAt: string;
  user: {
    profile?: { displayName: string; avatarUrl?: string };
  };
  views?: { userId: string; viewedAt: string }[];
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  category: string;
  isVerified?: boolean;
  _count?: { followers: number; posts: number };
}

export interface CallSession {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  recipientId?: string;
  type: 'VOICE' | 'VIDEO';
  status: 'IDLE' | 'RINGING' | 'CONNECTED' | 'ENDED';
  isMuted: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}
