'use server';

import db from '@/db/drizzle';
import { users } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const updateUserSettingsSchema = z.object({
  currency: z
    .string()
    .min(3, {
      message: 'Currency must be at least 3 characters long',
    })
    .max(3, {
      message: 'Currency must be at most 50 characters long',
    })
    .regex(/[A-Z]+/, 'Group currency must only contain uppercase letters'),
});

interface UpdateUserSettingsFormState {
  errors: {
    currency?: string[];
    _form?: string[];
  };
}

export async function updateUserSettings(
  _formState: UpdateUserSettingsFormState,
  formData: FormData,
): Promise<UpdateUserSettingsFormState> {
  const result = updateUserSettingsSchema.safeParse({
    currency: formData.get('currency'),
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

  let updatedUser: (typeof users.$inferInsert)[];
  try {
    updatedUser = await db
      .update(users)
      .set({
        currency: result.data.currency,
      })
      .where(eq(users.id, session.userId))
      .returning();

    if (!updatedUser.length || !updatedUser[0].uuid || !updatedUser[0].id) {
      return {
        errors: {
          _form: ['Something went wrong while updating your settings'],
        },
      };
    }
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

  revalidatePath(paths.settings());
  redirect(paths.settings());
}
