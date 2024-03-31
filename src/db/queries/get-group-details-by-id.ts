import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { cache } from 'react';

export const getGroupDetailsById = cache(async (groupUuid: string) => {
  const session = await auth();

  if (!session || !session.userId) {
    return null;
  }

  const group = await db.query.groups.findFirst({
    where: and(eq(groups.uuid, groupUuid), eq(groups.ownerId, session.userId)),
    with: {
      groupExpenses: true,
      groupMemberships: {
        with: {
          user: true,
        },
      },
      userBalances: true,
      owner: true,
    },
  });

  if (!group) {
    return null;
  }

  return group;
});

export type GroupWithData = Awaited<ReturnType<typeof getGroupDetailsById>>;
