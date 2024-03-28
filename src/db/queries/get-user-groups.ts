import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getUserGroups = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }
  const data = await db.query.groups.findMany({
    where: eq(groups.ownerId, userId),
    with: {
      groupExpenses: true,
      groupMemberships: true,
      userBalances: true,
    },
  });
  return data;
});
