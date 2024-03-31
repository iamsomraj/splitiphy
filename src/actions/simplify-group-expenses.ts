'use server';

import db from '@/db/drizzle';
import { groups } from '@/db/schema';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

interface SettleGroupExpenseFormState {
  errors: {
    _form?: string[];
  };
}

export async function simplifyGroupExpenses(
  groupUuid: string,
  formState: SettleGroupExpenseFormState,
  formData: FormData,
): Promise<SettleGroupExpenseFormState> {
  const session = await auth();
  if (!session || !session.userId) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.uuid, groupUuid),
    with: {
      groupExpenses: {
        with: {
          expense: {
            with: {
              transactions: {
                with: {
                  payer: true,
                  receiver: true,
                },
              },
            },
          },
        },
      },
      groupMemberships: {
        with: {
          user: true,
        },
      },
      userBalances: {
        with: {
          user: true,
          otherUser: true,
        },
      },
      owner: true,
    },
  });
  if (!group) {
    return {
      errors: {
        _form: ['Invalid group provided.'],
      },
    };
  }

  return { errors: {} };
}
