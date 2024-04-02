import db from '@/db/drizzle';
import { groupExpenses, groupUserBalances, groups } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { and, eq, not, sql } from 'drizzle-orm';
import { numeric } from 'drizzle-orm/pg-core';
import { cache } from 'react';

export const getGroupDetailsById = cache(async (groupUuid: string) => {
  const session = await auth();

  if (!session || !session.userId) {
    return null;
  }

  const group = await db.query.groups.findFirst({
    where: and(eq(groups.uuid, groupUuid), eq(groups.ownerId, session.userId)),
    with: {
      groupExpenses: {
        with: {
          expense: {
            with: {
              transactions: {
                with: {
                  payer: true,
                  receiver: true,
                },
              },
            },
          },
        },
        where: eq(groupExpenses.isExpenseSimplified, false),
      },
      groupMemberships: {
        with: {
          user: true,
        },
      },
      groupUserBalances: {
        with: {
          sender: true,
          recipient: true,
        },
        where: not(eq(groupUserBalances.amount, '0.00')),
      },
      owner: true,
    },
  });

  if (!group) {
    return null;
  }

  return group;
});

export type GroupWithData = Awaited<ReturnType<typeof getGroupDetailsById>>;
