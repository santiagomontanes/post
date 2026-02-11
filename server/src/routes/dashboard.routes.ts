import { Router } from 'express';
import { authGuard } from '../middleware/auth';
import { prisma } from '../utils/prisma';

export const dashboardRouter = Router();
dashboardRouter.use(authGuard);

dashboardRouter.get('/', async (_req, res) => {
  const [sales, paymentMethods, inventory, topProducts] = await Promise.all([
    prisma.sale.findMany({ orderBy: { createdAt: 'asc' }, include: { items: true } }),
    prisma.sale.groupBy({ by: ['paymentMethod'], _count: { paymentMethod: true } }),
    prisma.product.groupBy({ by: ['stockStatus'], _count: { stockStatus: true } }),
    prisma.saleItem.groupBy({ by: ['productId'], _count: { productId: true }, orderBy: { _count: { productId: 'desc' } }, take: 5 }),
  ]);

  const salesByDay = Object.values(
    sales.reduce((acc, sale) => {
      const key = sale.createdAt.toISOString().slice(0, 10);
      if (!acc[key]) acc[key] = { date: key, total: 0, utility: 0 };
      acc[key].total += sale.total;
      acc[key].utility += sale.items.reduce((sum, i) => sum + (i.unitPrice - i.purchasePrice) * i.quantity, 0);
      return acc;
    }, {} as Record<string, { date: string; total: number; utility: number }>),
  );

  const products = await prisma.product.findMany({ where: { id: { in: topProducts.map((p) => p.productId) } } });
  const topProductsNamed = topProducts.map((entry) => ({
    productId: entry.productId,
    count: entry._count.productId,
    name: `${products.find((p) => p.id === entry.productId)?.brand || ''} ${products.find((p) => p.id === entry.productId)?.model || ''}`.trim(),
  }));

  res.json({ salesByDay, paymentMethods, inventory, topProducts: topProductsNamed });
});
