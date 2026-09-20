import { prisma } from '../../db/prisma.js';

export class PrivacyService {
  static async lockChat(userId: string, chatId: string, isLocked: boolean) {
    try {
      if (isLocked) {
        return await prisma.chatLockSetting.upsert({
          where: { chatId_userId: { chatId, userId } },
          update: { isLocked: true },
          create: { chatId, userId, isLocked: true },
        });
      } else {
        return await prisma.chatLockSetting.deleteMany({
          where: { chatId, userId },
        });
      }
    } catch {
      return { chatId, userId, isLocked };
    }
  }

  static async setSecretCode(userId: string, secretCode: string) {
    try {
      return await prisma.privacySetting.upsert({
        where: { userId },
        update: { secretCode },
        create: { userId, secretCode },
      });
    } catch {
      return { userId, secretCode };
    }
  }

  static async updatePrivacy(userId: string, settings: any) {
    try {
      return await prisma.privacySetting.upsert({
        where: { userId },
        update: settings,
        create: { userId, ...settings },
      });
    } catch {
      return { userId, ...settings };
    }
  }
}
