-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'SELLER',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Customer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "taxId" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sku" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "serial" TEXT NOT NULL,
  "cpu" TEXT NOT NULL,
  "ramGb" INTEGER NOT NULL,
  "storageType" TEXT NOT NULL,
  "storageGb" INTEGER NOT NULL,
  "screenInches" REAL NOT NULL,
  "resolution" TEXT NOT NULL,
  "touch" BOOLEAN NOT NULL DEFAULT false,
  "batteryState" TEXT NOT NULL,
  "batteryHoursEstimate" REAL NOT NULL,
  "physicalState" TEXT NOT NULL,
  "functionalState" TEXT NOT NULL,
  "purchasePrice" REAL NOT NULL,
  "salePrice" REAL NOT NULL,
  "supplier" TEXT,
  "purchaseDate" DATETIME,
  "entryDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "location" TEXT NOT NULL,
  "notes" TEXT,
  "photos" TEXT,
  "warrantyMonths" INTEGER NOT NULL DEFAULT 3,
  "stockStatus" TEXT NOT NULL DEFAULT 'DISPONIBLE',
  "category" TEXT NOT NULL DEFAULT 'LAPTOP',
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "reservedUntil" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE UNIQUE INDEX "Product_serial_key" ON "Product"("serial");

CREATE TABLE "Sale" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "invoiceNumber" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "customerId" TEXT,
  "subtotal" REAL NOT NULL,
  "discount" REAL NOT NULL DEFAULT 0,
  "taxPercent" REAL NOT NULL DEFAULT 0,
  "taxAmount" REAL NOT NULL DEFAULT 0,
  "total" REAL NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  "paymentDetails" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Sale_invoiceNumber_key" ON "Sale"("invoiceNumber");

CREATE TABLE "SaleItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "saleId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unitPrice" REAL NOT NULL,
  "purchasePrice" REAL NOT NULL,
  "total" REAL NOT NULL,
  CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "CashMovement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "concept" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "saleId" TEXT,
  "createdById" TEXT NOT NULL,
  CONSTRAINT "CashMovement_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "CashMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "CashClosing" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "date" DATETIME NOT NULL,
  "openingBalance" REAL NOT NULL,
  "totalIn" REAL NOT NULL,
  "totalOut" REAL NOT NULL,
  "closingBalance" REAL NOT NULL,
  "notes" TEXT,
  "createdById" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "CashClosing_date_key" ON "CashClosing"("date");

CREATE TABLE "Setting" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "businessName" TEXT NOT NULL DEFAULT 'Sistetecni',
  "businessTaxId" TEXT,
  "businessPhone" TEXT,
  "businessEmail" TEXT,
  "businessAddr" TEXT,
  "invoicePrefix" TEXT NOT NULL DEFAULT 'SIS',
  "currentNumber" INTEGER NOT NULL DEFAULT 1,
  "ivaPercent" REAL NOT NULL DEFAULT 0
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "entity" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" TEXT NOT NULL,
  CONSTRAINT "AuditLog_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
