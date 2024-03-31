'use server';

import { auth } from '@clerk/nextjs';

interface SettleGroupExpenseFormState {
  errors: {
    _form?: string[];
  };
}

export async function settleGroupExpenses(
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

  return { errors: {} };
}
