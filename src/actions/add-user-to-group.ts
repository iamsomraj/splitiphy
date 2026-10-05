'use server';

import db from '@/db/drizzle';
import { UserListWithData } from '@/db/queries';
import { groupMemberships, users } from '@/db/schema';
import { requireGroupMember } from '@/lib/authz';
import paths from '@/lib/paths';
import UserAuthService from '@/services/auth-user-service';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addUserToGroup(
  user: UserListWithData[0],
  groupUuid: string,
) {
  const access = await requireGroupMember(groupUuid);
  if (!access.ok) {
    redirect(paths.dashboard());
  }
  const { group } = access;

  try {
    // Never trust the client-supplied profile: re-fetch it from Clerk by id.
    const authUser = await new UserAuthService().getUserByIdFromAuth(user.id);
    if (!authUser) {
      return {
        state: false,
      };
    }

    await db
      .insert(users)
      .values(authUser)
      .onConflictDoUpdate({
        target: users.id,
        set: { ...authUser, updatedAt: new Date() },
      });

    const existingMembership = await db.query.groupMemberships.findFirst({
      where: and(
        eq(groupMemberships.groupId, group.id),
        eq(groupMemberships.userId, authUser.id),
      ),
    });

    if (!existingMembership) {
      await db.insert(groupMemberships).values({
        userId: authUser.id,
        groupId: group.id,
      });
    }
  } catch {
    return {
      state: false,
    };
  }

  revalidatePath(paths.dashboard());
  redirect(paths.groupShow(groupUuid));
}
