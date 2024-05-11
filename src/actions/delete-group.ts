'use server';

import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteGroup(groupUuid: string) {
  const session = await auth();
  if (!session || !session.userId) {
    return {
      state: false,
      message: 'You must be signed in to do this.',
    };
  }

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.uuid, groupUuid),
    });

    if (!group) {
      return {
        state: false,
        message: 'Group not found',
      };
    }

    const groupMembershipRecord = await db.query.groupMemberships.findFirst({
      where: and(
        eq(groupMemberships.groupId, group.id),
        eq(groupMemberships.userId, session.userId),
      ),
    });

    if (!groupMembershipRecord) {
      return {
        state: false,
        message: 'You are not a member of this group',
      };
    }

    await db.delete(groups).where(eq(groups.uuid, groupUuid));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        state: false,
        message: err.message,
      };
    } else {
      return {
        state: false,
        message: 'Something went wrong',
      };
    }
  }

  revalidatePath(paths.dashboard());
}
