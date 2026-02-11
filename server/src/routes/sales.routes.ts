import { Router } from 'express';
import { authGuard, roleGuard, type AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { createSaleTx } from '../services/sale.service';
import { auditLog } from '../services/audit.service';
import { buildInvoicePdf } from '../services/pdf.service';

export const salesRouter = Router();
salesRouter.use(authGuard);

salesRouter.get('/', async (_req, res) => {
  const sales = await prisma.sale.findMany({ include: { customer: true, user: true, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(sales);
});

salesRouter.post('/', roleGuard('ADMIN', 'SELLER'), async (req: AuthRequest, res) => {
  const sale = await createSaleTx({ ...req.body, userId: req.user!.id });
  await auditLog(req.user!.id, 'SALE', sale.id, 'CREATE', sale.invoiceNumber);
  res.status(201).json(sale);
});

salesRouter.get('/:id/invoice.pdf', async (req, res) => {
  const settings = await prisma.setting.findFirst();
  const sale = await prisma.sale.findUnique({ where: { id: req.params.id }, include: { customer: true, items: { include: { product: true } } } });
  if (!sale || !settings) return res.status(404).json({ message: 'No encontrado' });
  const doc = buildInvoicePdf(sale, settings.businessName);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=${sale.invoiceNumber}.pdf`);
  doc.pipe(res);
  doc.end();
});
