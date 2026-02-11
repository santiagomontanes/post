import { Product, StockStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';

const buildSku = (brand: string, model: string, count: number) => `${brand.slice(0, 3).toUpperCase()}-${model.slice(0, 3).toUpperCase()}-${String(count).padStart(4, '0')}`;

export const createProduct = async (payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sku'> & { sku?: string }) => {
  const count = await prisma.product.count();
  const sku = payload.sku || buildSku(payload.brand, payload.model, count + 1);
  return prisma.product.create({ data: { ...payload, sku } });
};

export const updateProduct = async (id: string, payload: Partial<Product>) => {
  return prisma.product.update({ where: { id }, data: payload });
};

export const reserveExpired = async () => {
  const now = new Date();
  return prisma.product.updateMany({
    where: { stockStatus: StockStatus.RESERVADO, reservedUntil: { lt: now } },
    data: { stockStatus: StockStatus.DISPONIBLE, reservedUntil: null },
  });
};
