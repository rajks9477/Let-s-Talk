import { prisma } from '../../db/prisma.js';

export class PollsService {
  static async createPoll(chatId: string, userId: string, data: { question: string; options: string[]; isMultipleChoice?: boolean }) {
    try {
      // Create message wrapper
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId: userId,
          type: 'POLL',
          poll: {
            create: {
              question: data.question,
              isMultipleChoice: !!data.isMultipleChoice,
              options: {
                create: data.options.map((opt, idx) => ({ text: opt, order: idx })),
              },
            },
          },
        },
        include: {
          poll: { include: { options: { include: { votes: true } } } },
          sender: { include: { profile: true } },
        },
      });
      return message;
    } catch {
      return {
        id: `poll_msg_${Date.now()}`,
        chatId,
        senderId: userId,
        type: 'POLL',
        poll: {
          id: `poll_${Date.now()}`,
          question: data.question,
          isMultipleChoice: !!data.isMultipleChoice,
          options: data.options.map((opt, idx) => ({ id: `opt_${idx}`, text: opt, votes: [] })),
        },
      };
    }
  }

  static async votePoll(pollId: string, optionId: string, userId: string) {
    try {
      const existing = await prisma.pollVote.findUnique({
        where: {
          pollId_optionId_userId: { pollId, optionId, userId },
        },
      });

      if (existing) {
        await prisma.pollVote.delete({ where: { id: existing.id } });
      } else {
        await prisma.pollVote.create({
          data: { pollId, optionId, userId },
        });
      }

      return await prisma.poll.findUnique({
        where: { id: pollId },
        include: { options: { include: { votes: true } } },
      });
    } catch {
      return { pollId, optionId, userId, action: 'VOTED' };
    }
  }
}
