import { Router } from 'express';
import { stringify } from 'csv-stringify/sync';
import { authGuard } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { getWeeklyBalance, rangeFilter } from '../services/report.service';

export const reportsRouter = Router();
reportsRouter.use(authGuard);

reportsRouter.get('/summary', async (req, res) => {
  const { from, to } = req.query;
  const where = rangeFilter(from as string, to as string);
  const [sales, movements, topBrands, byStatus] = await Promise.all([
    prisma.sale.findMany({ where: { createdAt: where }, include: { items: true } }),
    prisma.cashMovement.findMany({ where: { date: where } }),
    prisma.product.groupBy({ by: ['brand'], _count: { brand: true }, orderBy: { _count: { brand: 'desc' } }, take: 5 }),
    prisma.product.groupBy({ by: ['stockStatus'], _count: { stockStatus: true } }),
  ]);

  const salesTotal = sales.reduce((sum, s) => sum + s.total, 0);
  const utility = sales.reduce((sum, s) => sum + s.items.reduce((inner, i) => inner + (i.unitPrice - i.purchasePrice) * i.quantity, 0), 0);
  const expenses = movements.filter((m) => m.type === 'EGRESO').reduce((s, m) => s + m.amount, 0);

  res.json({ salesTotal, utility, topBrands, inventoryByStatus: byStatus, weeklyBalance: await getWeeklyBalance(), expenses });
});

reportsRouter.get('/summary.csv', async (req, res) => {
  const { from, to } = req.query;
  const sales = await prisma.sale.findMany({ where: { createdAt: rangeFilter(from as string, to as string) } });
  const csv = stringify(sales.map((s) => ({ factura: s.invoiceNumber, fecha: s.createdAt.toISOString(), total: s.total })), { header: true });
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});
