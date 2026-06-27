import { DataSource } from 'typeorm';
import { Coupon } from './orm-entities/coupon';

export const connectionDb = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_NAME || 'database.sqlite',
  synchronize: true,
  entities: [Coupon],
});
