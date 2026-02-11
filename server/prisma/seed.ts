import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminPass = await bcrypt.hash("Admin123*", 10);

  await prisma.user.upsert({
    where: { email: "admin@sistetecni.local" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@sistetecni.local",
      passwordHash: adminPass,
      role: "ADMIN",
    },
  });

  // Productos ejemplo (todo en strings, sin enums)
  const examples = [
    {
      brand: "Dell",
      model: "Latitude 5400",
      serial: "DL5400-0001",
      cpu: "Intel i5 8365U",
      ramGb: 16,
      storageType: "SSD",
      storageGb: 512,
      screenInches: 14,
      resolution: "1920x1080",
      touch: false,
      batteryState: "Buena",
      batteryHoursEstimate: 4.5,
      physicalState: "A",
      functionalState: "OK",
      purchasePrice: 250,
      salePrice: 420,
      location: "Vitrina",
    },
    {
      brand: "HP",
      model: "Elitebook 840 G5",
      serial: "HP840-0002",
      cpu: "Intel i7 8650U",
      ramGb: 16,
      storageType: "M2",
      storageGb: 256,
      screenInches: 14,
      resolution: "1920x1080",
      touch: true,
      batteryState: "Excelente",
      batteryHoursEstimate: 6,
      physicalState: "B",
      functionalState: "OK",
      purchasePrice: 300,
      salePrice: 520,
      location: "Bodega",
    },
    {
      brand: "Lenovo",
      model: "ThinkPad T480",
      serial: "LN480-0003",
      cpu: "Intel i5 8250U",
      ramGb: 8,
      storageType: "SSD",
      storageGb: 256,
      screenInches: 14,
      resolution: "1366x768",
      touch: false,
      batteryState: "Media",
      batteryHoursEstimate: 3,
      physicalState: "B",
      functionalState: "OBSERVACION",
      purchasePrice: 190,
      salePrice: 340,
      location: "Vitrina",
    },
  ] as const;

  for (let i = 0; i < examples.length; i++) {
    const e = examples[i];

    await prisma.product.upsert({
      where: { serial: e.serial },
      update: {},
      create: {
        ...e,
        sku: `SIS-LAP-${String(i + 1).padStart(4, "0")}`,
        supplier: "Proveedor local",
        notes: "Producto seed",
        category: "LAPTOP",
        quantity: 1,
        warrantyMonths: 3,
        // si tu schema tiene stockStatus con default, no hace falta;
        // pero si lo quieres explícito:
        stockStatus: "DISPONIBLE",
      },
    });
  }

  // Settings inicial
  const s = await prisma.setting.findFirst();
  if (!s) {
    await prisma.setting.create({
      data: {
        businessName: "Sistetecni",
        invoicePrefix: "SIS",
        ivaPercent: 0,
      },
    });
  }

  console.log("✅ Seed completado: admin + productos + settings");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

