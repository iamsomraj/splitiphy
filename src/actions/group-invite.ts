'use server';

import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import { requireGroupMember } from '@/lib/authz';
import paths from '@/lib/paths';
import UserAuthService from '@/services/auth-user-service';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type InviteLinkResponse =
  { state: true; inviteToken: string } | { state: false; message: string };

/** Returns the group's invite token, creating one if it doesn't exist yet. */
export async function createInviteLink(
  groupUuid: string,
): Promise<InviteLinkResponse> {
  const access = await requireGroupMember(groupUuid);
  if (!access.ok) {
    return { state: false, message: 'You are not a member of this group.' };
  }

  if (access.group.inviteToken) {
    return { state: true, inviteToken: access.group.inviteToken };
  }

  try {
    const [updated] = await db
      .update(groups)
      .set({ inviteToken: crypto.randomUUID(), updatedAt: new Date() })
      .where(eq(groups.id, access.group.id))
      .returning({ inviteToken: groups.inviteToken });

    if (!updated?.inviteToken) {
      return { state: false, message: 'Could not create an invite link.' };
    }

    revalidatePath(paths.groupShow(groupUuid));
    return { state: true, inviteToken: updated.inviteToken };
  } catch {
    return { state: false, message: 'Could not create an invite link.' };
  }
}

/** Invalidates the current invite link. Only the group owner can do this. */
export async function revokeInviteLink(groupUuid: string) {
  const access = await requireGroupMember(groupUuid);
  if (!access.ok || access.group.ownerId !== access.userId) {
    return {
      state: false,
      message: 'Only the group owner can revoke the invite link.',
    };
  }

  await db
    .update(groups)
    .set({ inviteToken: null, updatedAt: new Date() })
    .where(eq(groups.id, access.group.id));

  revalidatePath(paths.groupShow(groupUuid));
  return { state: true, message: 'Invite link revoked.' };
}

/** Adds the signed-in user to the group that owns this invite token. */
export async function joinGroupByInvite(inviteToken: string) {
  const loggedInUser = await new UserAuthService().createOrUpdateLoggedInUser();
  const userId = loggedInUser?.[0]?.id;
  if (!userId) {
    redirect(paths.getStarted());
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.inviteToken, inviteToken),
  });
  if (!group || !group.uuid) {
    redirect(paths.dashboard());
  }

  const existingMembership = await db.query.groupMemberships.findFirst({
    where: and(
      eq(groupMemberships.groupId, group.id),
      eq(groupMemberships.userId, userId),
    ),
  });

  if (!existingMembership) {
    await db.insert(groupMemberships).values({ groupId: group.id, userId });
  }

  revalidatePath(paths.dashboard());
  redirect(paths.groupShow(group.uuid));
}
