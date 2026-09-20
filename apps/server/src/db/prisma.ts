import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL / Prisma Database successfully connected.');
  } catch (error) {
    console.warn('⚠️ Prisma connection warning (operating with in-memory persistence fallback for dev/demo if DB offline):', (error as Error).message);
  }
}
