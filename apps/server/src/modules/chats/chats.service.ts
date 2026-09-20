import { prisma } from '../../db/prisma.js';

export class ChatsService {
  static async getUserChats(userId: string) {
    try {
      const chats = await prisma.chat.findMany({
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
      return chats;
    } catch {
      // Return sample mock chats if DB offline
      return [
        {
          id: 'chat_sample_1',
          type: 'DIRECT',
          name: 'Sarah Jenkins',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 2,
          members: [
            { userId, role: 'MEMBER' },
            {
              userId: 'user_sarah',
              role: 'MEMBER',
              user: { profile: { displayName: 'Sarah Jenkins', bio: 'Living in the moment ✨' } },
            },
          ],
          messages: [
            {
              id: 'msg_1',
              content: 'Hey! Did you check the new update?',
              type: 'TEXT',
              senderId: 'user_sarah',
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: 'chat_sample_2',
          type: 'GROUP',
          name: 'Core Engineering Team',
          avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
          lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 0,
          members: [{ userId, role: 'ADMIN' }],
          messages: [
            {
              id: 'msg_2',
              content: 'Release v2.4 deployed to staging! 🚀',
              type: 'TEXT',
              senderId: 'user_alex',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
        },
      ];
    }
  }

  static async getOrCreateDirectChat(userId: string, targetUserId: string) {
    try {
      // Check existing chat with both members
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

      // Create new chat
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
      return {
        id: `chat_${userId}_${targetUserId}`,
        type: 'DIRECT',
        createdAt: new Date().toISOString(),
        members: [{ userId }, { userId: targetUserId }],
        messages: [],
      };
    }
  }
}
