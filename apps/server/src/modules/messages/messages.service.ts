import { prisma } from '../../db/prisma.js';
import { AuthService } from '../auth/auth.service.js';
import { ChatsService } from '../chats/chats.service.js';

export class MessagesService {
  // Shared in-memory messages store per chatId
  private static inMemoryMessages = new Map<string, any[]>();

  static async getChatMessages(chatId: string, limit: number = 50) {
    try {
      const messages = await prisma.message.findMany({
        where: { chatId },
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { include: { profile: true } },
          replyTo: { include: { sender: { include: { profile: true } } } },
          attachments: true,
          reactions: { include: { user: { include: { profile: true } } } },
          poll: { include: { options: { include: { votes: true } } } },
          event: { include: { participants: true } },
          starredBy: true,
          pinnedIn: true,
          keptMessage: true,
        },
      });
      if (messages && messages.length > 0) return messages;
    } catch {
      // Continue to in-memory fallback
    }

    return this.inMemoryMessages.get(chatId) || [];
  }

  static async sendMessage(userId: string, data: {
    chatId: string;
    content?: string;
    type?: string;
    replyToId?: string;
    isViewOnce?: boolean;
    isDisappearing?: boolean;
    durationSeconds?: number;
    attachments?: any[];
  }) {
    const expiresAt = data.isDisappearing && data.durationSeconds
      ? new Date(Date.now() + data.durationSeconds * 1000)
      : null;

    try {
      const message = await prisma.message.create({
        data: {
          chatId: data.chatId,
          senderId: userId,
          content: data.content,
          type: data.type || 'TEXT',
          replyToId: data.replyToId,
          isViewOnce: !!data.isViewOnce,
          isDisappearing: !!data.isDisappearing,
          expiresAt,
          attachments: data.attachments?.length ? {
            create: data.attachments.map(att => ({
              fileUrl: att.fileUrl,
              thumbnailUrl: att.thumbnailUrl,
              fileName: att.fileName || 'file',
              fileSize: att.fileSize || 0,
              mimeType: att.mimeType || 'application/octet-stream',
              durationSec: att.durationSec,
              waveform: att.waveform ? JSON.stringify(att.waveform) : null,
              isHD: !!att.isHD,
            })),
          } : undefined,
        },
        include: {
          sender: { include: { profile: true } },
          replyTo: { include: { sender: { include: { profile: true } } } },
          attachments: true,
          reactions: true,
          poll: true,
          event: true,
        },
      });

      // Update chat's lastMessageAt timestamp
      await prisma.chat.update({
        where: { id: data.chatId },
        data: { lastMessageAt: new Date() },
      });

      return message;
    } catch {
      // Resolve sender info
      const senderUser = AuthService.registeredUsers.get(userId) || {
        id: userId,
        profile: { displayName: `User (${userId.slice(-4)})` },
      };

      // Mock fallback object
      const fallbackMsg = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        chatId: data.chatId,
        senderId: userId,
        content: data.content || '',
        type: data.type || 'TEXT',
        replyToId: data.replyToId,
        isViewOnce: !!data.isViewOnce,
        createdAt: new Date().toISOString(),
        sender: senderUser,
        attachments: data.attachments || [],
        reactions: [],
      };

      if (!this.inMemoryMessages.has(data.chatId)) {
        this.inMemoryMessages.set(data.chatId, []);
      }
      this.inMemoryMessages.get(data.chatId)!.push(fallbackMsg);

      // Update inMemoryChat lastMessage
      if (ChatsService.inMemoryChats.has(data.chatId)) {
        const c = ChatsService.inMemoryChats.get(data.chatId);
        c.lastMessageAt = fallbackMsg.createdAt;
        c.messages = [fallbackMsg];
      }

      return fallbackMsg;
    }
  }

  static async editMessage(messageId: string, userId: string, newContent: string) {
    try {
      const msg = await prisma.message.findUnique({ where: { id: messageId } });
      if (!msg || msg.senderId !== userId) {
        throw new Error('Unauthorized to edit this message');
      }

      const updated = await prisma.message.update({
        where: { id: messageId },
        data: {
          content: newContent,
          isEdited: true,
          edits: {
            create: { prevContent: msg.content || '' },
          },
        },
        include: { sender: { include: { profile: true } }, attachments: true },
      });
      return updated;
    } catch {
      return { id: messageId, content: newContent, isEdited: true };
    }
  }

  static async deleteMessage(messageId: string, userId: string, forEveryone: boolean) {
    try {
      if (forEveryone) {
        const msg = await prisma.message.findUnique({ where: { id: messageId } });
        if (!msg || msg.senderId !== userId) {
          throw new Error('Unauthorized to delete for everyone');
        }
        return await prisma.message.update({
          where: { id: messageId },
          data: { isDeletedForAll: true, content: 'This message was deleted' },
        });
      } else {
        // Delete for me
        return await prisma.message.update({
          where: { id: messageId },
          data: {
            deletedForUsers: JSON.stringify([userId]),
          },
        });
      }
    } catch {
      return { id: messageId, isDeletedForAll: forEveryone };
    }
  }

  static async toggleReaction(messageId: string, userId: string, emoji: string) {
    try {
      const existing = await prisma.messageReaction.findUnique({
        where: {
          messageId_userId_emoji: { messageId, userId, emoji },
        },
      });

      if (existing) {
        await prisma.messageReaction.delete({ where: { id: existing.id } });
        return { action: 'REMOVED', emoji, messageId, userId };
      } else {
        const reaction = await prisma.messageReaction.create({
          data: { messageId, userId, emoji },
        });
        return { action: 'ADDED', reaction };
      }
    } catch {
      return { action: 'TOGGLED', emoji, messageId, userId };
    }
  }
}
