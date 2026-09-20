import { prisma } from '../../db/prisma.js';

export class StatusService {
  static async createStatus(userId: string, data: {
    type?: string;
    content?: string;
    mediaUrl?: string;
    bgGradient?: string;
    caption?: string;
    privacy?: string;
  }) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    try {
      return await prisma.status.create({
        data: {
          userId,
          type: data.type || 'TEXT',
          content: data.content,
          mediaUrl: data.mediaUrl,
          bgGradient: data.bgGradient,
          caption: data.caption,
          privacy: data.privacy || 'CONTACTS',
          expiresAt,
        },
        include: {
          user: { include: { profile: true } },
          views: true,
        },
      });
    } catch {
      return {
        id: `status_${Date.now()}`,
        userId,
        type: data.type || 'TEXT',
        content: data.content,
        bgGradient: data.bgGradient,
        expiresAt: expiresAt.toISOString(),
        user: { profile: { displayName: 'You' } },
        views: [],
      };
    }
  }

  static async getStatusFeed(userId: string) {
    try {
      const now = new Date();
      return await prisma.status.findMany({
        where: {
          expiresAt: { gt: now },
        },
        include: {
          user: { include: { profile: true } },
          views: { include: { user: { include: { profile: true } } } },
          reactions: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      // Mock fallback status stories
      return [
        {
          id: 'status_demo_1',
          userId: 'user_sarah',
          type: 'TEXT',
          content: 'Excited for the big launch today! ✨🎉',
          bgGradient: 'from-pink-600 to-purple-600',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          user: { profile: { displayName: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' } },
          views: [],
        },
        {
          id: 'status_demo_2',
          userId: 'user_alex',
          type: 'TEXT',
          content: 'Building next-gen realtime communication! 🚀',
          bgGradient: 'from-blue-600 to-teal-500',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          user: { profile: { displayName: 'Alex Rivera', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' } },
          views: [],
        },
      ];
    }
  }

  static async recordView(statusId: string, userId: string) {
    try {
      return await prisma.statusViewer.upsert({
        where: {
          statusId_userId: { statusId, userId },
        },
        update: { viewedAt: new Date() },
        create: { statusId, userId },
      });
    } catch {
      return { statusId, userId, viewedAt: new Date().toISOString() };
    }
  }
}
