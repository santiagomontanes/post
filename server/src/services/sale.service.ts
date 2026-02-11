import { PaymentMethod, Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';

interface SaleInput {
  userId: string;
  customer?: { name: string; taxId?: string; phone?: string; email?: string };
  productIds: string[];
  discount?: number;
  taxPercent?: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: string;
}

export const createSaleTx = async (input: SaleInput) => {
  return prisma.$transaction(async (tx) => {
    const settings = await tx.setting.findFirst();
    if (!settings) throw new Error('Configuración no inicializada');

    const products = await tx.product.findMany({ where: { id: { in: input.productIds }, stockStatus: 'DISPONIBLE' } });
    if (products.length !== input.productIds.length) throw new Error('Uno o más items no están disponibles');

    const subtotal = products.reduce((sum, p) => sum + p.salePrice, 0);
    const discount = input.discount || 0;
    const taxPercent = input.taxPercent ?? settings.ivaPercent;
    const taxAmount = ((subtotal - discount) * taxPercent) / 100;
    const total = subtotal - discount + taxAmount;
    const invoiceNumber = `${settings.invoicePrefix}-${String(settings.currentNumber).padStart(6, '0')}`;

    let customerId: string | undefined;
    if (input.customer?.name) {
      const customer = await tx.customer.create({ data: input.customer });
      customerId = customer.id;
    }

    const sale = await tx.sale.create({
      data: {
        userId: input.userId,
        customerId,
        subtotal,
        discount,
        taxPercent,
        taxAmount,
        total,
        paymentMethod: input.paymentMethod,
        paymentDetails: input.paymentDetails,
        invoiceNumber,
        items: {
          create: products.map((product) => ({
            productId: product.id,
            quantity: 1,
            unitPrice: product.salePrice,
            purchasePrice: product.purchasePrice,
            total: product.salePrice,
          })),
        },
      },
      include: { items: { include: { product: true } }, customer: true, user: true },
    });

    await tx.product.updateMany({ where: { id: { in: input.productIds } }, data: { stockStatus: 'VENDIDO' } });
    await tx.cashMovement.create({
      data: {
        type: 'INGRESO',
        category: 'VENTA',
        concept: `Venta ${invoiceNumber}`,
        amount: total,
        saleId: sale.id,
        createdById: input.userId,
      },
    });

    await tx.setting.update({ where: { id: settings.id }, data: { currentNumber: { increment: 1 } } });

    return sale;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
};
