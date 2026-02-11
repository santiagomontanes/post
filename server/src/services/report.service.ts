import { prisma } from '../utils/prisma';

export const rangeFilter = (from?: string, to?: string) => {
  if (!from && !to) return undefined;
  return {
    gte: from ? new Date(from) : undefined,
    lte: to ? new Date(to) : undefined,
  };
};

export const getWeeklyBalance = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [incomes, expenses, sales] = await Promise.all([
    prisma.cashMovement.aggregate({ _sum: { amount: true }, where: { type: 'INGRESO', date: { gte: sevenDaysAgo } } }),
    prisma.cashMovement.aggregate({ _sum: { amount: true }, where: { type: 'EGRESO', date: { gte: sevenDaysAgo } } }),
    prisma.saleItem.findMany({ where: { sale: { createdAt: { gte: sevenDaysAgo } } } }),
  ]);

  const gross = sales.reduce((acc, i) => acc + (i.unitPrice - i.purchasePrice) * i.quantity, 0);
  const income = incomes._sum.amount || 0;
  const expense = expenses._sum.amount || 0;
  return { income, expense, grossProfit: gross, netProfit: gross - expense };
};
