'use server';

import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const editGroupSchema = z.object({
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
    name?: string[];
    _form?: string[];
  };
}

export async function editGroup(
  groupUuid: string,
  formData: FormData,
): Promise<EditGroupFormState> {
  const result = editGroupSchema.safeParse({
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
      where: eq(groups.uuid, groupUuid),
    });

    if (!existingGroup) {
      return {
        errors: {
          _form: ['Group not found.'],
        },
      };
    }

    if (existingGroup.ownerId !== session.userId) {
      return {
        errors: {
          _form: ['You are not the owner of this group.'],
        },
      };
    }

    await db
      .update(groups)
      .set({
        name: result.data.name,
      })
      .where(eq(groups.uuid, groupUuid));
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
  redirect(paths.dashboard());
}
