import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'biblioteca',
  port: parseInt(process.env.DB_PORT || '5434', 10),
});
