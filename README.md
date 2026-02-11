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


## Configuración del entorno (Windows 10/11 paso a paso)
1. Instala herramientas base:
   - Node.js LTS 20+ (incluye npm).
   - Git for Windows.
2. Clona el repo y entra a la carpeta:
   ```bash
   git clone <tu-repo>.git
   cd post
   ```
3. Crea variables de entorno:
   ```bash
   copy server\.env.example server\.env
   copy .env.example apps\frontend\.env
   ```
4. Verifica/ajusta variables:
   - `server/.env`
     - `DATABASE_URL="file:./dev.db"`
     - `JWT_SECRET="una_clave_segura"`
     - `PORT=4000`
   - `apps/frontend/.env`
     - `VITE_API_URL="http://localhost:4000/api"`
5. Instala dependencias:
   ```bash
   npm install
   ```
6. Ejecuta migraciones y carga datos iniciales:
   ```bash
   npm run prisma:migrate -w server
   npm run prisma:seed -w server
   ```
7. Levanta backend y frontend:
   ```bash
   npm run dev
   ```
8. Abre en el navegador:
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:4000`
   - Swagger: `http://localhost:4000/api/docs`

### Credenciales iniciales
- Email: `admin@sistetecni.local`
- Password: `Admin123*`

### Solución de problemas rápida
- Si `npm install` falla por red/proxy corporativo, configura npm:
  ```bash
  npm config set registry https://registry.npmjs.org/
  npm config delete proxy
  npm config delete https-proxy
  ```
- Si el puerto 4000 o 5173 está ocupado, cambia `PORT` en `server/.env` y/o puerto de Vite en `apps/frontend/vite.config.ts`.
- Si Prisma no encuentra la BD, confirma que `DATABASE_URL` quede exactamente como `file:./dev.db` en `server/.env`.
