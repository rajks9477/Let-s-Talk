const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // If body is FormData, delete Content-Type to allow browser multipart boundary header
  if (options.body instanceof FormData) {
    delete (headers as any)['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Network request failed');
  }

  return data;
}

export const api = {
  // Auth
  requestOtp: (phoneNumber: string, countryCode: string = '+91') =>
    fetcher('/auth/request-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, countryCode }) }),
  verifyOtp: (phoneNumber: string, countryCode: string = '+91', code: string) =>
    fetcher('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phoneNumber, countryCode, code }) }),
  onboard: (profileData: any) =>
    fetcher('/auth/onboard', { method: 'POST', body: JSON.stringify(profileData) }),
  getMe: () => fetcher('/auth/me'),

  // Chats & Messages
  getChats: () => fetcher('/chats'),
  getOrCreateDirectChat: (targetUserId: string) =>
    fetcher('/chats/direct', { method: 'POST', body: JSON.stringify({ targetUserId }) }),
  getMessages: (chatId: string, limit: number = 50) => fetcher(`/messages/chat/${chatId}?limit=${limit}`),
  sendMessage: (payload: any) =>
    fetcher('/messages/send', { method: 'POST', body: JSON.stringify(payload) }),
  editMessage: (messageId: string, content: string) =>
    fetcher(`/messages/${messageId}/edit`, { method: 'PATCH', body: JSON.stringify({ content }) }),
  deleteMessage: (messageId: string, forEveryone: boolean) =>
    fetcher(`/messages/${messageId}`, { method: 'DELETE', body: JSON.stringify({ forEveryone }) }),
  toggleReaction: (messageId: string, emoji: string) =>
    fetcher(`/messages/${messageId}/react`, { method: 'POST', body: JSON.stringify({ emoji }) }),

  // Media
  uploadMedia: (formData: FormData) =>
    fetcher('/media/upload', { method: 'POST', body: formData }),

  // Status Stories
  createStatus: (payload: any) =>
    fetcher('/status', { method: 'POST', body: JSON.stringify(payload) }),
  getStatusFeed: () => fetcher('/status/feed'),
  viewStatus: (statusId: string) =>
    fetcher(`/status/${statusId}/view`, { method: 'POST' }),

  // Channels
  discoverChannels: () => fetcher('/channels/discover'),
  createChannel: (payload: any) =>
    fetcher('/channels', { method: 'POST', body: JSON.stringify(payload) }),
  createChannelPost: (channelId: string, payload: any) =>
    fetcher(`/channels/${channelId}/posts`, { method: 'POST', body: JSON.stringify(payload) }),

  // Polls & Events
  createPoll: (payload: any) =>
    fetcher('/polls', { method: 'POST', body: JSON.stringify(payload) }),
  votePoll: (pollId: string, optionId: string) =>
    fetcher(`/polls/${pollId}/vote`, { method: 'POST', body: JSON.stringify({ optionId }) }),
  createEvent: (payload: any) =>
    fetcher('/events', { method: 'POST', body: JSON.stringify(payload) }),
  rsvpEvent: (eventId: string, rsvp: string) =>
    fetcher(`/events/${eventId}/rsvp`, { method: 'POST', body: JSON.stringify({ rsvp }) }),

  // Calling
  initiateCall: (recipientId: string, type: 'VOICE' | 'VIDEO') =>
    fetcher('/calls/initiate', { method: 'POST', body: JSON.stringify({ recipientId, type }) }),
  updateCallStatus: (callId: string, status: string, durationSec?: number) =>
    fetcher(`/calls/${callId}/status`, { method: 'PATCH', body: JSON.stringify({ status, durationSec }) }),
  getCallHistory: () => fetcher('/calls/history'),

  // Payments / UPI
  verifyVPA: (vpa: string) =>
    fetcher('/payments/vpa/verify', { method: 'POST', body: JSON.stringify({ vpa }) }),
  transferUPI: (payload: any) =>
    fetcher('/payments/transfer', { method: 'POST', body: JSON.stringify(payload) }),
  getPaymentHistory: () => fetcher('/payments/history'),

  // AI Assistant
  aiChat: (message: string, conversationId?: string) =>
    fetcher('/ai/chat', { method: 'POST', body: JSON.stringify({ message, conversationId }) }),
  aiSummarize: (text: string) =>
    fetcher('/ai/summarize', { method: 'POST', body: JSON.stringify({ text }) }),
  aiTranslate: (text: string, targetLanguage: string) =>
    fetcher('/ai/translate', { method: 'POST', body: JSON.stringify({ text, targetLanguage }) }),
  aiRewrite: (text: string, tone: string) =>
    fetcher('/ai/rewrite', { method: 'POST', body: JSON.stringify({ text, tone }) }),

  // Business
  getBusinessProfile: (userId?: string) =>
    fetcher(`/business/profile${userId ? `/${userId}` : ''}`),
  addBusinessProduct: (catalogId: string, payload: any) =>
    fetcher('/business/products', { method: 'POST', body: JSON.stringify({ catalogId, ...payload }) }),

  // Privacy & Backups
  lockChat: (chatId: string, isLocked: boolean) =>
    fetcher('/privacy/lock-chat', { method: 'POST', body: JSON.stringify({ chatId, isLocked }) }),
  setSecretCode: (secretCode: string) =>
    fetcher('/privacy/secret-code', { method: 'POST', body: JSON.stringify({ secretCode }) }),
  updatePrivacySettings: (settings: any) =>
    fetcher('/privacy/settings', { method: 'PATCH', body: JSON.stringify(settings) }),
  exportBackup: () => fetcher('/backups/export'),

  // Admin
  getAdminMetrics: () => fetcher('/admin/metrics'),
  getAdminReports: () => fetcher('/admin/reports'),
  banUser: (targetUserId: string, reason: string) =>
    fetcher('/admin/ban-user', { method: 'POST', body: JSON.stringify({ targetUserId, reason }) }),
};
