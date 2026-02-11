import { Router } from 'express';
import { authGuard, roleGuard, type AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/prisma';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import { auditLog } from '../services/audit.service';
import { createProduct, reserveExpired, updateProduct } from '../services/inventory.service';

export const productsRouter = Router();
productsRouter.use(authGuard);


productsRouter.get('/export.csv', async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  const csv = stringify(products, { header: true });
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

productsRouter.post('/import.csv', roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  const { csv } = req.body as { csv: string };
  const rows = parse(csv, { columns: true, skip_empty_lines: true });
  const created = [];
  for (const row of rows) {
    const product = await createProduct({
      ...row,
      ramGb: Number(row.ramGb),
      storageGb: Number(row.storageGb),
      screenInches: Number(row.screenInches),
      touch: String(row.touch).toLowerCase() === 'true',
      batteryHoursEstimate: Number(row.batteryHoursEstimate),
      purchasePrice: Number(row.purchasePrice),
      salePrice: Number(row.salePrice),
      warrantyMonths: Number(row.warrantyMonths || 3),
      quantity: Number(row.quantity || 1),
      purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : undefined,
      entryDate: row.entryDate ? new Date(row.entryDate) : new Date(),
    });
    created.push(product.id);
  }
  res.json({ imported: created.length });
});

productsRouter.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ sku: { contains: q } }, { brand: { contains: q } }, { model: { contains: q } }, { serial: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
});

productsRouter.post('/', roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  const product = await createProduct(req.body);
  await auditLog(req.user!.id, 'PRODUCT', product.id, 'CREATE', product.sku);
  res.status(201).json(product);
});

productsRouter.put('/:id', roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  const product = await updateProduct(req.params.id, req.body);
  await auditLog(req.user!.id, 'PRODUCT', product.id, 'UPDATE', JSON.stringify(req.body));
  res.json(product);
});

productsRouter.delete('/:id', roleGuard('ADMIN'), async (req: AuthRequest, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  await auditLog(req.user!.id, 'PRODUCT', req.params.id, 'DELETE');
  res.status(204).send();
});

productsRouter.post('/reserve-expired/process', roleGuard('ADMIN'), async (_req, res) => {
  const result = await reserveExpired();
  res.json(result);
});
