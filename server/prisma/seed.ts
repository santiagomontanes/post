import bcrypt from 'bcrypt';
import { PrismaClient, Role, StorageType, PhysicalState, FunctionalState } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('Admin123*', 10);
  await prisma.user.upsert({
    where: { email: 'admin@sistetecni.local' },
    update: {},
    create: { name: 'Administrador', email: 'admin@sistetecni.local', passwordHash: adminPass, role: Role.ADMIN },
  });

  const examples = [
    { brand: 'Dell', model: 'Latitude 5400', serial: 'DL5400-0001', cpu: 'Intel i5 8365U', ramGb: 16, storageType: StorageType.SSD, storageGb: 512, screenInches: 14, resolution: '1920x1080', touch: false, batteryState: 'Buena', batteryHoursEstimate: 4.5, physicalState: PhysicalState.A, functionalState: FunctionalState.OK, purchasePrice: 250, salePrice: 420, location: 'Vitrina' },
    { brand: 'HP', model: 'Elitebook 840 G5', serial: 'HP840-0002', cpu: 'Intel i7 8650U', ramGb: 16, storageType: StorageType.M2, storageGb: 256, screenInches: 14, resolution: '1920x1080', touch: true, batteryState: 'Excelente', batteryHoursEstimate: 6, physicalState: PhysicalState.B, functionalState: FunctionalState.OK, purchasePrice: 300, salePrice: 520, location: 'Bodega' },
    { brand: 'Lenovo', model: 'ThinkPad T480', serial: 'LN480-0003', cpu: 'Intel i5 8250U', ramGb: 8, storageType: StorageType.SSD, storageGb: 256, screenInches: 14, resolution: '1366x768', touch: false, batteryState: 'Media', batteryHoursEstimate: 3, physicalState: PhysicalState.B, functionalState: FunctionalState.OBSERVACION, purchasePrice: 190, salePrice: 340, location: 'Vitrina' },
  ];

  for (let i = 0; i < examples.length; i++) {
    const e = examples[i];
    await prisma.product.upsert({
      where: { serial: e.serial },
      update: {},
      create: { ...e, sku: `SIS-LAP-${String(i + 1).padStart(4, '0')}`, supplier: 'Proveedor local', notes: 'Producto seed', category: 'LAPTOP', quantity: 1, warrantyMonths: 3 },
    });
  }

  const s = await prisma.setting.findFirst();
  if (!s) await prisma.setting.create({ data: { businessName: 'Sistetecni', invoicePrefix: 'SIS', ivaPercent: 0 } });
}

main().finally(async () => prisma.$disconnect());
