import { getAIProvider } from './ai.provider.js';
import { prisma } from '../../db/prisma.js';

export class AIService {
  static async chat(userId: string, prompt: string, conversationId?: string) {
    const provider = getAIProvider();
    const reply = await provider.chat(prompt);

    try {
      let convId = conversationId;
      if (!convId) {
        const conv = await prisma.aiConversation.create({
          data: { userId, title: prompt.slice(0, 30) },
        });
        convId = conv.id;
      }

      await prisma.aIMessage.createMany({
        data: [
          { conversationId: convId, role: 'user', content: prompt },
          { conversationId: convId, role: 'assistant', content: reply },
        ],
      });

      return { conversationId: convId, reply };
    } catch {
      return { conversationId: conversationId || `conv_${Date.now()}`, reply };
    }
  }

  static async summarize(text: string) {
    const provider = getAIProvider();
    return await provider.summarize(text);
  }

  static async translate(text: string, targetLanguage: string) {
    const provider = getAIProvider();
    return await provider.translate(text, targetLanguage);
  }

  static async rewrite(text: string, tone: string) {
    const provider = getAIProvider();
    return await provider.rewrite(text, tone);
  }
}
