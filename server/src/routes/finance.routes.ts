import { Router } from 'express';
import { authGuard, roleGuard, type AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { rangeFilter } from '../services/report.service';

export const financeRouter = Router();
financeRouter.use(authGuard);

financeRouter.get('/movements', async (req, res) => {
  const { from, to } = req.query;
  const data = await prisma.cashMovement.findMany({
    where: { date: rangeFilter(from as string, to as string) },
    orderBy: { date: 'desc' },
  });
  res.json(data);
});

financeRouter.post('/movements', roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  const movement = await prisma.cashMovement.create({ data: { ...req.body, createdById: req.user!.id } });
  res.status(201).json(movement);
});

financeRouter.post('/closings', roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  const { date, openingBalance, notes } = req.body;
  const start = new Date(date);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const [income, out] = await Promise.all([
    prisma.cashMovement.aggregate({ _sum: { amount: true }, where: { date: { gte: start, lte: end }, type: 'INGRESO' } }),
    prisma.cashMovement.aggregate({ _sum: { amount: true }, where: { date: { gte: start, lte: end }, type: 'EGRESO' } }),
  ]);

  const totalIn = income._sum.amount || 0;
  const totalOut = out._sum.amount || 0;
  const closing = await prisma.cashClosing.upsert({
    where: { date: start },
    create: { date: start, openingBalance, totalIn, totalOut, closingBalance: openingBalance + totalIn - totalOut, notes, createdById: req.user!.id },
    update: { openingBalance, totalIn, totalOut, closingBalance: openingBalance + totalIn - totalOut, notes, createdById: req.user!.id },
  });
  res.json(closing);
});
