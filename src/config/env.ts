import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || "4040",
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DATABASE_URL: process.env.DATABASE_URL,
};
