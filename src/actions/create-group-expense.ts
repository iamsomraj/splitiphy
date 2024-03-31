'use server';

import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const createGroupExpenseSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Expense name must be at least 3 characters long',
    })
    .max(50, {
      message: 'Expense name must be at most 50 characters long',
    })
    .regex(
      /[a-zA-Z0-9 ]+/,
      'Expense name must only contain lowercase or uppercase letters, numbers and spaces',
    ),
  description: z
    .string()
    .max(255, {
      message: 'Expense description must be at most 255 characters long',
    })
    .optional(),
  date: z.date(),
  amount: z.number().positive(),
  paidBy: z.number(),
  splitWith: z.array(z.number()).min(1, {
    message: 'At least one member should be selected to split with',
  }),
  splitType: z.enum(['amount', 'share', 'percentage']),
  splitAmounts: z.record(z.number()).optional(),
});

interface CreateGroupExpenseFormState {
  errors: {
    name?: string[];
    description?: string[];
    date?: string[];
    amount?: string[];
    paidBy?: string[];
    splitWith?: string[];
    splitType?: string[];
    splitAmounts?: string[];
    _form?: string[];
  };
}

export async function createGroupExpense(
  formState: CreateGroupExpenseFormState,
  formData: FormData,
): Promise<CreateGroupExpenseFormState> {
  const result = createGroupExpenseSchema.safeParse({
    name: formData.get('expense-name'),
    description: formData.get('expense-description'),
    date: formData.get('expense-date'),
    amount: parseFloat(formData.get('expense-amount') as string),
    paidBy: parseInt(formData.get('expense-paid-by') as string),
    splitWith: Array.from(formData.getAll('expense-split-with')).map(
      (id) => id as string,
    ),
    splitType: formData.get('split-type'),
    splitAmounts: Object.fromEntries(
      Array.from(formData.entries())
        .filter(([name]) => name.startsWith('split-amount-'))
        .map(([name, value]) => [
          name.split('-')[2] as string,
          parseFloat(value as string),
        ]),
    ),
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

  revalidatePath(paths.groupShow(formData.get('groupId') as string));
  redirect(paths.groupShow(formData.get('groupId') as string));
}
