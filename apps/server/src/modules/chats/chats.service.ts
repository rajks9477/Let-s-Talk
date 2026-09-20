import { prisma } from '../../db/prisma.js';
import { AuthService } from '../auth/auth.service.js';

export class ChatsService {
  // Shared in-memory chats store across all user sessions
  public static inMemoryChats = new Map<string, any>();

  static async getUserChats(userId: string) {
    try {
      const dbChats = await prisma.chat.findMany({
        where: {
          members: {
            some: { userId },
          },
        },
        include: {
          members: {
            include: {
              user: {
                include: { profile: true },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: { sender: { include: { profile: true } }, attachments: true },
          },
          disappearingSetting: true,
          chatLocks: {
            where: { userId },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
      if (dbChats && dbChats.length > 0) return dbChats;
    } catch {
      // Continue to in-memory fallback
    }

    // Retrieve user's in-memory chats
    const userChats: any[] = [];
    for (const chat of this.inMemoryChats.values()) {
      const isMember = chat.members?.some((m: any) => m.userId === userId || m.id === userId);
      if (isMember) {
        userChats.push(chat);
      }
    }

    if (userChats.length > 0) {
      return userChats.sort((a, b) => new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime());
    }

    // Default starter chat if user has no chats yet
    const defaultChat = {
      id: `chat_welcome_${userId}`,
      type: 'DIRECT',
      name: 'Let\'s Talk Official Bot 🤖',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
      members: [
        { userId, role: 'MEMBER' },
        {
          userId: 'user_official_bot',
          role: 'ADMIN',
          user: { profile: { displayName: 'Let\'s Talk Assistant', bio: 'Official SuperApp Bot ✨' } },
        },
      ],
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          content: 'Welcome to Let\'s Talk! Type any friend\'s phone number in the search bar above to start a live chat.',
          type: 'TEXT',
          senderId: 'user_official_bot',
          createdAt: new Date().toISOString(),
        },
      ],
    };
    this.inMemoryChats.set(defaultChat.id, defaultChat);
    return [defaultChat];
  }

  static async getOrCreateDirectChat(userId: string, targetUserId: string, targetPhone?: string) {
    try {
      // Check existing DB chat with both members
      const existing = await prisma.chat.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { members: { some: { userId } } },
            { members: { some: { userId: targetUserId } } },
          ],
        },
        include: {
          members: { include: { user: { include: { profile: true } } } },
          messages: { take: 50, orderBy: { createdAt: 'desc' } },
        },
      });

      if (existing) return existing;

      // Create new chat in DB
      return await prisma.chat.create({
        data: {
          type: 'DIRECT',
          members: {
            create: [
              { userId, role: 'MEMBER' },
              { userId: targetUserId, role: 'MEMBER' },
            ],
          },
        },
        include: {
          members: { include: { user: { include: { profile: true } } } },
        },
      });
    } catch {
      // In-Memory direct chat lookup/creation
      const chatId = [userId, targetUserId].sort().join('_');
      const existingMem = this.inMemoryChats.get(chatId);
      if (existingMem) return existingMem;

      // Resolve target user profile
      const targetUser = AuthService.registeredUsers.get(targetUserId) || 
                         (targetPhone ? AuthService.registeredUsers.get(targetPhone) : null) || {
        id: targetUserId,
        phoneNumber: targetPhone || `+91${targetUserId.replace(/\D/g, '')}`,
        profile: {
          displayName: targetPhone ? `Contact (${targetPhone})` : `User ${targetUserId.slice(-4)}`,
          bio: 'Hey there! I am using Let\'s Talk.',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUserId}`,
        },
      };

      const currentUser = AuthService.registeredUsers.get(userId) || {
        id: userId,
        profile: { displayName: `You (${userId.slice(-4)})` },
      };

      const newChat = {
        id: chatId,
        type: 'DIRECT',
        name: targetUser.profile?.displayName || targetUser.phoneNumber,
        avatarUrl: targetUser.profile?.avatarUrl,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        members: [
          { userId, role: 'MEMBER', user: currentUser },
          { userId: targetUserId, role: 'MEMBER', user: targetUser },
        ],
        messages: [],
      };

      this.inMemoryChats.set(chatId, newChat);
      return newChat;
    }
  }
}
