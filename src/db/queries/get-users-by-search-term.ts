import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import UserAuthService from '@/services/auth-user-service';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getUsersBySearchTerm = cache(
  async (searchTerm: string, groupUuid: string) => {
    const userAuthService = new UserAuthService();
    const [dbUsers, authUsers] = await Promise.allSettled([
      userAuthService.getUsersBySearchTermFromDB(searchTerm),
      userAuthService.getUsersBySearchTermFromAuth(searchTerm),
    ]);

    const mergedUsers = [
      ...(dbUsers.status === 'fulfilled' ? dbUsers.value : []),
      ...(authUsers.status === 'fulfilled' ? authUsers.value : []),
    ];

    const uniqueUsers = Array.from(
      new Map(mergedUsers.map((user) => [user.id, user])).values(),
    );

    const group = await db.query.groups.findFirst({
      where: eq(groups.uuid, groupUuid),
      with: {
        groupMemberships: true,
      },
    });

    if (!group) {
      return [];
    }

    const existingGroupMembersIds = group.groupMemberships.map(
      (membership) => membership.userId,
    );

    const filteredUsers = uniqueUsers.filter(
      (user) => !existingGroupMembersIds.includes(user.id),
    );

    return filteredUsers;
  },
);

export type UserListWithData = Awaited<ReturnType<typeof getUsersBySearchTerm>>;
