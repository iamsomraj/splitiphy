import 'server-only';

import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

type Group = typeof groups.$inferSelect;

export type GroupAccess =
  | { ok: true; userId: string; group: Group }
  | { ok: false; reason: 'unauthenticated' | 'not-found' | 'forbidden' };

/**
 * Resolves the signed-in user and verifies they are a member of the group.
 * Every server action / route that touches group data must go through this.
 */
export async function requireGroupMember(
  groupUuid: string,
): Promise<GroupAccess> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, reason: 'unauthenticated' };
  }

  if (!groupUuid) {
    return { ok: false, reason: 'not-found' };
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.uuid, groupUuid),
  });
  if (!group) {
    return { ok: false, reason: 'not-found' };
  }

  const membership = await db.query.groupMemberships.findFirst({
    where: and(
      eq(groupMemberships.groupId, group.id),
      eq(groupMemberships.userId, userId),
    ),
  });
  if (!membership) {
    return { ok: false, reason: 'forbidden' };
  }

  return { ok: true, userId, group };
}

export const groupAccessErrorMessages = {
  unauthenticated: 'You must be signed in to do this.',
  'not-found': 'Group not found',
  forbidden: 'You are not a member of this group',
} as const;
