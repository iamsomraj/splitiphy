import db from '@/db/drizzle';
import { groupMemberships, groupUserBalances, groups } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { and, eq, not } from 'drizzle-orm';
import { cache } from 'react';

export const getGroupDetailsById = cache(async (groupUuid: string) => {
  const session = await auth();

  if (!session || !session.userId) {
    return null;
  }

  const groupDetail = await db.query.groups.findFirst({
    where: and(eq(groups.uuid, groupUuid)),
  });

  if (!groupDetail) {
    return null;
  }

  const groupMember = await db.query.groupMemberships.findFirst({
    where: and(
      eq(groupMemberships.userId, session.userId),
      eq(groupMemberships.groupId, groupDetail.id),
    ),
  });

  if (!groupMember) {
    return null;
  }

  const group = await db.query.groups.findFirst({
    where: and(eq(groups.uuid, groupUuid)),
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
              owner: true,
            },
          },
        },
        orderBy: (groupExpenses, { desc }) => [desc(groupExpenses.createdAt)],
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

export type SingleGroupWithData = Awaited<
  ReturnType<typeof getGroupDetailsById>
>;
