# Sistetecni POS + Inventario

Sistema POS offline para laptops reacondicionadas con inventario, ventas, caja, reportes y dashboard táctil.

## Stack
- Frontend: React + TypeScript + Recharts
- Backend: Node.js + Express + Prisma
- DB local: SQLite
- Auth: JWT + bcrypt
- PDF: pdfmake

## Estructura
```
/apps/frontend   # UI táctil POS
/server          # API, Prisma, lógica de negocio
```

## Requisitos
- Node.js 20+
- npm 10+

## Instalación
```bash
npm install
cp server/.env.example server/.env
cp .env.example apps/frontend/.env
```

## Migraciones + seed
```bash
npm run prisma:migrate -w server
npm run prisma:seed -w server
```

## Ejecutar en desarrollo
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Swagger: http://localhost:4000/api/docs

## Usuario admin inicial
- Email: `admin@sistetecni.local`
- Password: `Admin123*`

## Funcionalidades implementadas
- Inventario laptops (CRUD + búsqueda por SKU/marca/modelo/serial + estados).
- Ventas con descuento, IVA configurable, forma de pago y transacción atómica:
  venta + items + cambio de stock + ingreso en caja.
- Factura PDF por venta con numeración consecutiva configurable.
- Caja: ingresos/egresos y cierre diario.
- Reportes por rango + exportación CSV + balance semanal automático.
- Dashboard con ventas/utilidad, métodos de pago, inventario por estado y top productos.
- Multiusuario con roles Admin/Vendedor y auditoría básica.

## Endpoints principales
- `POST /api/auth/login`
- `POST /api/auth/register` (admin)
- `GET|POST|PUT|DELETE /api/products`
- `GET|POST /api/sales`
- `GET /api/sales/:id/invoice.pdf`
- `GET|POST /api/finance/movements`
- `POST /api/finance/closings`
- `GET /api/reports/summary`
- `GET /api/reports/summary.csv`
- `GET /api/dashboard`

## Tests
```bash
npm run test -w server
```

## Windows / NCR táctil
- Diseñado con botones grandes y layout POS responsive.
- Compatible con lector de código de barras modo teclado (campo de búsqueda en inventario vía query en API).
- Recomendado ejecutar en modo pantalla completa del navegador o kiosk del sistema.

## Notas
- Todo funciona offline en SQLite.
- Para producción local en Windows: usar `npm run build` y levantar backend con `npm run start -w server`.
