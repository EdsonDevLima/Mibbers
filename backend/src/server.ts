import 'reflect-metadata';
import fastify from 'fastify';
import cors from '@fastify/cors';
import env from 'dotenv';
import { connectionDb } from './infrastructure/database/connection';
import { couponRoutes } from './http/routes/counpon.routes';

env.config();

const app = fastify();

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

app.register(couponRoutes, { prefix: '/coupons' });

const port = parseInt(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';

async function bootstrap() {
  try {
    await connectionDb.initialize();
    await app.listen({ port, host });
    console.log(`servidor iniciado http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

bootstrap();
