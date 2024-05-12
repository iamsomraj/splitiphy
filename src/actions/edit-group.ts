'use server';

import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const editGroupSchema = z.object({
  groupUuid: z.string(),
  name: z
    .string()
    .min(3, {
      message: 'Group name must be at least 3 characters long',
    })
    .max(50, {
      message: 'Group name must be at most 50 characters long',
    })
    .regex(
      /[a-zA-Z0-9 ]+/,
      'Group name must only contain lowercase or uppercase letters, numbers and spaces',
    ),
});

interface EditGroupFormState {
  errors: {
    groupUuid?: string[];
    name?: string[];
    _form?: string[];
  };
}

export async function editGroup(
  _formState: EditGroupFormState,
  formData: FormData,
): Promise<EditGroupFormState> {
  const result = editGroupSchema.safeParse({
    groupUuid: formData.get('group-uuid'),
    name: formData.get('name'),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const session = await auth();
  if (!session || !session.userId) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  try {
    const existingGroup = await db.query.groups.findFirst({
      where: eq(groups.uuid, result.data.groupUuid),
    });

    if (!existingGroup) {
      return {
        errors: {
          _form: ['Group not found.'],
        },
      };
    }

    const groupMembershipRecord = await db.query.groupMemberships.findFirst({
      where: and(
        eq(groupMemberships.groupId, existingGroup.id),
        eq(groupMemberships.userId, session.userId),
      ),
    });

    if (!groupMembershipRecord) {
      return {
        errors: {
          _form: ['You are not a member of this group.'],
        },
      };
    }

    await db
      .update(groups)
      .set({
        name: result.data.name,
      })
      .where(eq(groups.uuid, result.data.groupUuid));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ['Something went wrong'],
        },
      };
    }
  }

  revalidatePath(paths.dashboard());
  redirect(paths.groupShow(result.data.groupUuid));
}
