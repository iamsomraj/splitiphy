import type { Config } from 'drizzle-kit';
import { env } from '@/env';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: env.DB_HOST,
    port: +env.DB_PORT!,
    user: env.DB_USER!,
    password: env.DB_PASSWORD!,
    database: env.DB_NAME!,
    ssl: true,
  },
} satisfies Config;
