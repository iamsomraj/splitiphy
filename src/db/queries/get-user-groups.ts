import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getUserGroups = cache(async () => {
  const session = await auth();

  if (!session || !session.userId) {
    return [];
  }

  const ownedGroups = await db.query.groups.findMany({
    where: eq(groups.ownerId, session.userId),
    with: {
      groupExpenses: true,
      groupMemberships: true,
      userBalances: true,
    },
  });
  return ownedGroups;
});

export type GetUserGroups = Awaited<ReturnType<typeof getUserGroups>>;
