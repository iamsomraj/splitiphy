'use server';

import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import paths from '@/lib/paths';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addUserToGroup(userId: string, groupUuid: string) {
  const group = await db.query.groups.findFirst({
    where: eq(groups.uuid, groupUuid),
  });

  if (!group) {
    redirect(paths.groups());
  }

  try {
    await db.insert(groupMemberships).values({
      userId,
      groupId: group.id,
      createdAt: new Date(),
    });
  } catch (error) {
    redirect(paths.groups());
  }

  revalidatePath(paths.groups());
  redirect(paths.groupShow(groupUuid));
}
