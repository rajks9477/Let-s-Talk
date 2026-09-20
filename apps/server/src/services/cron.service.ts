import { prisma } from '../db/prisma.js';

export class CronService {
  private static intervalTimer: NodeJS.Timeout | null = null;

  static startBackgroundJobs() {
    console.log('🕒 Starting background jobs (Status 24h expiration, Disappearing messages cleanup)...');
    
    // Run every 60 seconds
    this.intervalTimer = setInterval(async () => {
      await this.expireOldStatuses();
      await this.purgeDisappearingMessages();
    }, 60 * 1000);
  }

  static stopBackgroundJobs() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  private static async expireOldStatuses() {
    try {
      const now = new Date();
      const deleted = await prisma.status.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });
      if (deleted.count > 0) {
        console.log(`🧹 Expired & purged ${deleted.count} status stories.`);
      }
    } catch (err) {
      // Ignore if DB in offline/mock mode
    }
  }

  private static async purgeDisappearingMessages() {
    try {
      const now = new Date();
      const deleted = await prisma.message.deleteMany({
        where: {
          isDisappearing: true,
          expiresAt: {
            lt: now,
          },
          keptMessage: null, // Do not delete kept messages
        },
      });
      if (deleted.count > 0) {
        console.log(`🧹 Purged ${deleted.count} expired disappearing messages.`);
      }
    } catch (err) {
      // Ignore if DB in offline/mock mode
    }
  }
}
