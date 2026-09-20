// In-Memory / Redis presence & typing manager
interface UserPresence {
  userId: string;
  socketId: string;
  status: 'online' | 'offline';
  lastActive: Date;
  activeChatId?: string;
}

export class PresenceService {
  private static userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private static socketUsers = new Map<string, string>(); // socketId -> userId
  private static userPresences = new Map<string, UserPresence>();
  private static typingUsers = new Map<string, Set<string>>(); // chatId -> Set<userId>

  static userConnected(userId: string, socketId: string) {
    this.socketUsers.set(socketId, userId);
    
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);

    this.userPresences.set(userId, {
      userId,
      socketId,
      status: 'online',
      lastActive: new Date(),
    });
  }

  static userDisconnected(socketId: string): string | null {
    const userId = this.socketUsers.get(socketId);
    if (!userId) return null;

    this.socketUsers.delete(socketId);
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
        const presence = this.userPresences.get(userId);
        if (presence) {
          presence.status = 'offline';
          presence.lastActive = new Date();
        }
        return userId;
      }
    }
    return null;
  }

  static isUserOnline(userId: string): boolean {
    const presence = this.userPresences.get(userId);
    return presence?.status === 'online';
  }

  static getUserSockets(userId: string): string[] {
    const sockets = this.userSockets.get(userId);
    return sockets ? Array.from(sockets) : [];
  }

  static setTyping(chatId: string, userId: string, isTyping: boolean) {
    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new Set());
    }
    const typers = this.typingUsers.get(chatId)!;
    if (isTyping) {
      typers.add(userId);
    } else {
      typers.delete(userId);
    }
  }

  static getTypingUsers(chatId: string): string[] {
    const typers = this.typingUsers.get(chatId);
    return typers ? Array.from(typers) : [];
  }
}
