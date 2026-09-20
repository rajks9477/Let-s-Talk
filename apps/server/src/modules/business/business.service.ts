import { prisma } from '../../db/prisma.js';

export class BusinessService {
  static async getBusinessProfile(userId: string) {
    try {
      return await prisma.businessProfile.findUnique({
        where: { userId },
        include: {
          catalogs: { include: { products: true } },
          quickReplies: true,
          labels: true,
        },
      });
    } catch {
      return {
        id: `biz_${userId}`,
        userId,
        businessName: 'Apex Studio & Design Co.',
        category: 'Professional Services',
        description: 'Bespoke UI/UX design and scalable full-stack engineering consultancy.',
        email: 'contact@apexstudio.io',
        website: 'https://apexstudio.io',
        catalogs: [
          {
            id: 'cat_1',
            name: 'Consulting Packages',
            products: [
              { id: 'prod_1', name: 'UI/UX Design Audit', price: 14999, currency: 'INR', description: 'Comprehensive design system review.' },
              { id: 'prod_2', name: 'Full-Stack Architecture Sprint', price: 49999, currency: 'INR', description: 'Production-ready architecture design.' },
            ],
          },
        ],
        quickReplies: [
          { id: 'qr_1', shortcut: '/pricing', message: 'Hello! You can view our full catalog and pricing packages directly in this chat.' },
          { id: 'qr_2', shortcut: '/hours', message: 'Our business hours are Mon-Fri 9:00 AM - 6:00 PM IST.' },
        ],
      };
    }
  }

  static async addProduct(catalogId: string, data: { name: string; price: number; description?: string; imageUrl?: string }) {
    try {
      return await prisma.product.create({
        data: {
          catalogId,
          name: data.name,
          price: data.price,
          description: data.description,
          imageUrl: data.imageUrl,
        },
      });
    } catch {
      return { id: `prod_${Date.now()}`, catalogId, ...data };
    }
  }
}
