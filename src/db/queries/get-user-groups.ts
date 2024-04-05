import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import UserAuthService from '@/services/auth-user-service';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
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

  const ownedGroups = await db.query.groups.findMany({
    where: eq(groups.ownerId, session[0].id),
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
  return ownedGroups;
});

export type UserGroupsWithData = Awaited<ReturnType<typeof getUserGroups>>;
