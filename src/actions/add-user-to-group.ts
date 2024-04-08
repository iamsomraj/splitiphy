'use server';

import db from '@/db/drizzle';
import { UserSearchResult } from '@/db/queries';
import { groupMemberships, groups, users } from '@/db/schema';
import paths from '@/lib/paths';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createOrUpdateUser = async (currUser: UserSearchResult[0]) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, currUser.id),
  });

  if (!user) {
    return await db
      .insert(users)
      .values({
        id: currUser.id,
        username: currUser.username || '',
        email: currUser.email || '',
        phone: currUser.phone || '',
        firstName: currUser.firstName || '',
        lastName: currUser.lastName || '',
        profileImage: currUser.profileImage || '',
        createdAt: new Date(),
        updatedAt: null,
        isDeleted: false,
      })
      .returning();
  } else {
    return await db
      .update(users)
      .set({
        username: currUser.username || '',
        email: currUser.email || '',
        phone: currUser.phone || '',
        firstName: currUser.firstName || '',
        lastName: currUser.lastName || '',
        profileImage: currUser.profileImage || '',
      })
      .where(eq(users.id, currUser.id))
      .returning();
  }
};

export async function addUserToGroup(
  user: UserSearchResult[0],
  groupUuid: string,
) {
  const group = await db.query.groups.findFirst({
    where: eq(groups.uuid, groupUuid),
  });

  if (!group) {
    redirect(paths.dashboard());
  }

  try {
    const groupUser = await createOrUpdateUser(user);
    await db.insert(groupMemberships).values({
      userId: groupUser[0].id,
      groupId: group.id,
      createdAt: new Date(),
    });
  } catch (error) {
    redirect(paths.dashboard());
  }

  revalidatePath(paths.dashboard());
  redirect(paths.groupShow(groupUuid));
}
