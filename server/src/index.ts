import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { productsRouter } from './routes/products.routes';
import { salesRouter } from './routes/sales.routes';
import { financeRouter } from './routes/finance.routes';
import { reportsRouter } from './routes/reports.routes';
import { dashboardRouter } from './routes/dashboard.routes';
import { prisma } from './utils/prisma';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '2mb' }));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Sistetecni POS API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: [],
});

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/finance', financeRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/dashboard', dashboardRouter);

const start = async () => {
  const existing = await prisma.setting.findFirst();
  if (!existing) {
    await prisma.setting.create({ data: {} });
  }
  app.listen(env.port, () => console.log(`Server ready on ${env.port}`));
};

start();
