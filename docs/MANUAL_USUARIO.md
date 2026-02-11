# Manual de Usuario — Sistetecni POS + Inventario

Este manual está pensado para el equipo de **Sistetecni** (administrador y vendedores) para operar la aplicación en el día a día desde una pantalla táctil NCR/Windows.

---

## 1) ¿Qué puedes hacer con la app?

- Gestionar inventario de laptops (crear, consultar, editar, eliminar).
- Registrar ventas y generar comprobante PDF.
- Registrar ingresos/egresos de caja.
- Consultar dashboard y reportes.
- Operar con roles:
  - **Admin**: acceso total.
  - **Vendedor**: ventas + consulta.

---

## 2) Acceso al sistema

1. Abre el navegador y entra a: `http://localhost:5173`.
2. En pantalla de login, ingresa correo y contraseña.
3. Presiona **Entrar**.

### Credenciales iniciales (primera instalación)
- Email: `admin@sistetecni.local`
- Password: `Admin123*`

> Recomendación: cambiar contraseña del admin después del primer acceso.

---

## 3) Menú principal

En la barra lateral encontrarás:
- **Dashboard**
- **Inventario**
- **Ventas**
- **Caja**
- **Cerrar sesión**

---

## 4) Dashboard (panel de control)

### ¿Qué verás?
- Gráfica de **ventas y utilidad** por fecha.
- Gráfica de **inventario por estado**.

### ¿Para qué sirve?
- Monitorear desempeño diario/semanal.
- Detectar caída de ventas o inventario estancado.

---

## 5) Inventario

### 5.1 Agregar una laptop
1. Ir a **Inventario**.
2. Completar formulario (marca, modelo, serial, CPU, RAM, almacenamiento, precios, etc.).
3. Presionar **Guardar**.

El sistema genera o mantiene SKU y registra el equipo para venta.

### 5.2 Buscar equipos
- Usa la búsqueda por **SKU**, **marca**, **modelo** o **serial** (si está habilitada en tu vista o integración).

### 5.3 Estados de inventario
- **DISPONIBLE**: listo para vender.
- **RESERVADO**: separado temporalmente.
- **VENDIDO**: ya facturado.
- **DEVUELTO**: retornado al negocio.

### 5.4 Importar / Exportar CSV
- Exporta inventario para respaldos o análisis.
- Importa CSV para carga masiva (solo Admin).

> Consejo: valida encabezados y tipos numéricos antes de importar.

---

## 6) Ventas (flujo POS)

### 6.1 Crear venta
1. Ir a **Ventas**.
2. Seleccionar uno o varios productos **DISPONIBLE**.
3. Confirmar venta.

### 6.2 Qué hace el sistema al confirmar
- Crea la venta.
- Marca productos como **VENDIDO**.
- Registra un movimiento de caja tipo **INGRESO**.
- Genera numeración de factura consecutiva.

### 6.3 Factura PDF
- En “Ventas recientes”, abrir enlace **PDF** para visualizar/imprimir comprobante.

---

## 7) Caja y Finanzas

### 7.1 Registrar movimiento manual
1. Ir a **Caja**.
2. Elegir tipo:
   - **INGRESO** (ej. otros ingresos)
   - **EGRESO** (ej. arriendo, servicios, transporte)
3. Completar categoría, concepto y monto.
4. Guardar.

### 7.2 Cierre de caja diario (Admin)
- Registra saldo inicial y notas.
- El sistema calcula entradas/salidas y saldo final del día.

---

## 8) Reportes

Según configuración/rol:
- Resumen por rango de fechas.
- Ventas totales.
- Utilidad.
- Top marcas / inventario por estado.
- Exportación CSV.

---

## 9) Roles y permisos

## Admin
- Configuración total del sistema.
- Gestión completa de inventario.
- Registro de movimientos sensibles.
- Cierres de caja.

## Vendedor
- Crear ventas.
- Ver inventario.
- Ver reportes básicos.
- Sin acceso a operaciones sensibles (según configuración).

---

## 10) Buenas prácticas operativas

- Registrar serial correcto de cada laptop.
- No compartir cuentas entre empleados.
- Realizar respaldo periódico del archivo SQLite (`dev.db`).
- Exportar reportes semanalmente.
- Revisar movimientos de egreso al cierre diario.

---

## 11) Preguntas frecuentes (FAQ)

### No puedo iniciar sesión
- Verifica correo/clave.
- Pide a Admin restablecer credenciales.

### No aparece un producto para vender
- Revisa que esté en estado **DISPONIBLE**.

### La factura no abre
- Comprueba que backend esté activo en `http://localhost:4000`.
- Intenta descargar el PDF desde “Ventas recientes”.

### Se ve mal en pantalla táctil
- Usa navegador en pantalla completa (kiosk).
- Ajusta zoom a 100% y resolución recomendada del monitor NCR.

---

## 12) Guía rápida (entrenamiento 10 minutos)

1. Inicia sesión.
2. Carga 1 laptop en Inventario.
3. Ve a Ventas y véndela.
4. Abre el PDF de factura.
5. Registra un egreso en Caja.
6. Revisa Dashboard.

Con esto dominas el flujo básico del POS.
