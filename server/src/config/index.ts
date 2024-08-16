import { config } from 'dotenv';
config();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  STRIPE_SECRET_KEY,
  JWT_SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN
} = process.env;
