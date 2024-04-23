'use server';

import db from '@/db/drizzle';
import { UserListWithData } from '@/db/queries';
import { groupMemberships, groups, users } from '@/db/schema';
import paths from '@/lib/paths';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createOrUpdateUser = async (currUser: UserListWithData[0]) => {
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
        updatedAt: null,
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
        updatedAt: new Date(),
      })
      .where(eq(users.id, currUser.id))
      .returning();
  }
};

export async function addUserToGroup(
  user: UserListWithData[0],
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
    });
  } catch (error) {
    return {
      state: false,
    };
  }

  revalidatePath(paths.dashboard());
  redirect(paths.groupShow(groupUuid));
}
