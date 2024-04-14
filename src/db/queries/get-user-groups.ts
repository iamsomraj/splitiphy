import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import UserAuthService from '@/services/auth-user-service';
import { auth } from '@clerk/nextjs';
import { eq, inArray, or } from 'drizzle-orm';
import { cache } from 'react';

export const getUserGroups = cache(async () => {
  const authUser = await auth();

  if (!authUser || !authUser.userId) {
    return [];
  }

  const userAuthService = new UserAuthService();
  const session = await userAuthService.createOrUpdateLoggedInUser();

  if (!session || !session[0].id) {
    return [];
  }

  const groupMemberRecords = await db.query.groupMemberships.findMany({
    where: eq(groupMemberships.userId, session[0].id),
  });

  const groupIds = groupMemberRecords.map((record) => record.groupId);

  const allGroups = await db.query.groups.findMany({
    where: or(eq(groups.ownerId, session[0].id), inArray(groups.id, groupIds)),
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
      },
      owner: true,
    },
  });
  return allGroups;
});

export type UserGroupsWithData = Awaited<ReturnType<typeof getUserGroups>>;
