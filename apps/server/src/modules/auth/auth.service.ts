import jwt from 'jsonwebtoken';
import { prisma } from '../../db/prisma.js';
import { config } from '../../config/index.js';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  // In-memory OTP store for fast sandbox/local development
  private static otpStore = new Map<string, { code: string; expiresAt: Date }>();
  // Shared in-memory user registry across all logged in sessions
  public static registeredUsers = new Map<string, any>();

  static async requestOtp(phoneNumber: string, countryCode: string = '+91') {
    const cleanNum = phoneNumber.replace(/\D/g, '');
    const fullPhone = cleanNum.startsWith('91') && cleanNum.length > 10 ? `+${cleanNum}` : `${countryCode}${cleanNum}`;
    const code = '123456'; // Standard predictable sandbox code (or generated OTP)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    this.otpStore.set(fullPhone, { code, expiresAt });

    console.log(`📲 [SMS/OTP Sandbox] Sent verification code [${code}] to ${fullPhone}`);
    return {
      success: true,
      message: `OTP sent successfully to ${fullPhone}`,
      sandboxCode: code,
    };
  }

  static async verifyOtp(phoneNumber: string, countryCode: string = '+91', code: string) {
    const cleanNum = phoneNumber.replace(/\D/g, '');
    const fullPhone = cleanNum.startsWith('91') && cleanNum.length > 10 ? `+${cleanNum}` : `${countryCode}${cleanNum}`;
    const stored = this.otpStore.get(fullPhone);

    if (!stored || stored.code !== code || stored.expiresAt < new Date()) {
      // Allow fallback default '123456' for instant demo testability
      if (code !== '123456') {
        throw new Error('Invalid or expired OTP verification code');
      }
    }

    // Try finding or creating user in DB
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { phoneNumber: fullPhone },
        include: { profile: true, privacySetting: true },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phoneNumber: fullPhone,
            phoneCountryCode: countryCode,
            isVerified: true,
            profile: {
              create: {
                displayName: `User ${fullPhone.slice(-4)}`,
                bio: 'Hey there! I am using Let\'s Talk.',
                themePreference: 'LIGHT',
              },
            },
            privacySetting: {
              create: {
                lastSeenVisibility: 'EVERYONE',
                readReceiptsEnabled: true,
              },
            },
          },
          include: { profile: true, privacySetting: true },
        });
      }
    } catch (err) {
      // Offline fallback mock user
      user = {
        id: `usr_${fullPhone.replace(/\D/g, '')}`,
        phoneNumber: fullPhone,
        role: 'USER',
        isVerified: true,
        profile: {
          displayName: `User ${fullPhone.slice(-4)}`,
          bio: 'Hey there! I am using Let\'s Talk.',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullPhone}`,
        },
      };
    }

    // Always register in shared memory store
    this.registeredUsers.set(user.id, user);
    this.registeredUsers.set(fullPhone, user);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phoneNumber, role: (user as any).role || 'USER' },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    return {
      token,
      user,
    };
  }

  static async onboard(userId: string, data: { displayName: string; bio?: string; avatarUrl?: string; username?: string }) {
    try {
      const updated = await prisma.profile.update({
        where: { userId },
        data: {
          displayName: data.displayName,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
        },
        include: { user: true },
      });
      if (this.registeredUsers.has(userId)) {
        const u = this.registeredUsers.get(userId);
        if (u.profile) {
          u.profile.displayName = data.displayName;
          u.profile.bio = data.bio || u.profile.bio;
          u.profile.avatarUrl = data.avatarUrl || u.profile.avatarUrl;
        }
      }
      return updated;
    } catch {
      if (this.registeredUsers.has(userId)) {
        const u = this.registeredUsers.get(userId);
        if (u.profile) {
          u.profile.displayName = data.displayName;
          u.profile.bio = data.bio || u.profile.bio;
          u.profile.avatarUrl = data.avatarUrl || u.profile.avatarUrl;
        }
      }
      return {
        userId,
        ...data,
      };
    }
  }

  static async searchUsers(query: string, currentUserId?: string) {
    const q = query.trim().toLowerCase();
    const cleanDigits = query.replace(/\D/g, '');

    const results: any[] = [];
    const seenIds = new Set<string>();

    if (currentUserId) seenIds.add(currentUserId);

    // 1. Search DB if available
    try {
      const dbUsers = await prisma.user.findMany({
        where: {
          OR: [
            { phoneNumber: { contains: query } },
            { profile: { displayName: { contains: query, mode: 'insensitive' } } },
          ],
          NOT: currentUserId ? { id: currentUserId } : undefined,
        },
        include: { profile: true },
        take: 20,
      });

      for (const u of dbUsers) {
        if (!seenIds.has(u.id)) {
          seenIds.add(u.id);
          results.push(u);
        }
      }
    } catch {
      // Ignore DB error
    }

    // 2. Search In-Memory Registered Users
    for (const u of this.registeredUsers.values()) {
      if (!u || !u.id || seenIds.has(u.id)) continue;
      const phone = (u.phoneNumber || '').toLowerCase();
      const name = (u.profile?.displayName || '').toLowerCase();

      if (
        phone.includes(q) ||
        name.includes(q) ||
        (cleanDigits.length >= 3 && phone.includes(cleanDigits))
      ) {
        seenIds.add(u.id);
        results.push(u);
      }
    }

    // If query looks like a valid 10-digit phone number and not registered yet, create virtual user preview
    if (cleanDigits.length >= 10 && results.length === 0) {
      const formattedPhone = cleanDigits.startsWith('91') && cleanDigits.length > 10 ? `+${cleanDigits}` : `+91${cleanDigits.slice(-10)}`;
      const previewUser = {
        id: `usr_${cleanDigits.slice(-10)}`,
        phoneNumber: formattedPhone,
        role: 'USER',
        isVerified: true,
        profile: {
          displayName: `Contact (${formattedPhone})`,
          bio: 'Available on Let\'s Talk',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedPhone}`,
        },
      };
      results.push(previewUser);
    }

    return results;
  }
}
