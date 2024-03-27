import { cache } from 'react';
import db from '@/db/drizzle';

export const getGroups = cache(async () => {
  const data = await db.query.groups.findMany();
  return data;
});
