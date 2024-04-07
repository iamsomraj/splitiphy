'use server';

import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createGroupSchema = z.object({
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

interface CreateGroupFormState {
  errors: {
    name?: string[];
    _form?: string[];
  };
}

export async function createGroup(
  formState: CreateGroupFormState,
  formData: FormData,
): Promise<CreateGroupFormState> {
  const result = createGroupSchema.safeParse({
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

  let insertedGroups: (typeof groups.$inferInsert)[];
  try {
    insertedGroups = await db
      .insert(groups)
      .values({
        name: result.data.name,
        ownerId: session.userId,
        createdAt: new Date(),
      })
      .returning();

    if (
      !insertedGroups.length ||
      !insertedGroups[0].uuid ||
      !insertedGroups[0].id
    ) {
      return {
        errors: {
          _form: ['Something went wrong while creating the group.'],
        },
      };
    }

    await db.insert(groupMemberships).values({
      userId: session.userId,
      groupId: insertedGroups[0].id,
      createdAt: new Date(),
    });
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

  revalidatePath(paths.groups());
  redirect(paths.groupShow(insertedGroups[0].uuid));
}
