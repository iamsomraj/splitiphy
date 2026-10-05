import db from '@/db/drizzle';
import { groupMemberships } from '@/db/schema';
import { requireGroupMember } from '@/lib/authz';
import UserAuthService from '@/services/auth-user-service';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getUsersBySearchTerm = cache(
  async (rawSearchTerm: string | undefined, groupUuid: string) => {
    const searchTerm = (rawSearchTerm || '').trim();
    // An empty query would list every user in the Clerk instance.
    if (searchTerm.length < 2) {
      return [];
    }

    const access = await requireGroupMember(groupUuid);
    if (!access.ok) {
      return [];
    }

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

    const memberships = await db.query.groupMemberships.findMany({
      where: eq(groupMemberships.groupId, access.group.id),
    });

    const existingGroupMembersIds = memberships.map(
      (membership) => membership.userId,
    );

    const filteredUsers = uniqueUsers.filter(
      (user) => !existingGroupMembersIds.includes(user.id),
    );

    return filteredUsers;
  },
);

export type UserListWithData = Awaited<ReturnType<typeof getUsersBySearchTerm>>;
