import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(__dirname, '..', '..', '.env') });

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql);

async function seed() {}

async function main() {
  try {
    await seed();

    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);

    process.exit(1);
  }
}

main();
