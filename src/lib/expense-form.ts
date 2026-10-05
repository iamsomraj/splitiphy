import 'server-only';

import constants from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import { z } from 'zod';

const amountRecord = z
  .record(z.string(), z.number().positive('Amount should be a positive number'))
  .optional();

export const expenseFormSchema = z.object({
  category: z
    .string()
    .refine(
      (value) =>
        (constants.expensesCategories.map((c) => c.key) as string[]).includes(
          value,
        ),
      { message: 'Invalid expense category' },
    ),
  name: z
    .string()
    .trim()
    .min(3, {
      message: 'Expense name must be at least 3 characters long',
    })
    .max(50, {
      message: 'Expense name must be at most 50 characters long',
    })
    .regex(/[\p{L}\p{N}]/u, 'Expense name must contain letters or numbers'),
  description: z
    .string()
    .max(255, {
      message: 'Expense description must be at most 255 characters long',
    })
    .optional(),
  date: z.date({ error: 'Please pick a valid date' }),
  amount: z.number().positive(),
  paidBy: z.string().optional(),
  isMultiplePaidBy: z.boolean(),
  paidByList: z.array(z.string()).optional(),
  paidByAmounts: amountRecord,
  splitWith: z.array(z.string()).min(1, {
    message: 'At least one member should be selected to split with',
  }),
  splitAmounts: amountRecord,
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

export interface ExpenseFormState {
  errors: {
    category?: string[];
    name?: string[];
    description?: string[];
    date?: string[];
    amount?: string[];
    paidBy?: string[];
    isMultiplePaidBy?: string[];
    paidByList?: string[];
    paidByAmounts?: string[];
    splitWith?: string[];
    splitAmounts?: string[];
    _form?: string[];
  };
}

const amountsByPrefix = (formData: FormData, prefix: string) =>
  Object.fromEntries(
    Array.from(formData.entries())
      .filter(([name]) => name.startsWith(prefix))
      .map(([name, value]) => [
        name.slice(prefix.length),
        formatNumber(parseFloat(value as string)),
      ]),
  );

export function parseExpenseForm(formData: FormData) {
  return expenseFormSchema.safeParse({
    category: formData.get('expense-category') as string,
    name: formData.get('expense-name') as string,
    description: (formData.get('expense-description') as string) ?? undefined,
    date: new Date(formData.get('expense-date') as string),
    amount: formatNumber(parseFloat(formData.get('expense-amount') as string)),
    paidBy: formData.get('expense-paid-by') as string,
    isMultiplePaidBy: formData.get('is-multiple-paid-by') === 'on',
    paidByList: formData.getAll('expense-paid-by').map((id) => id as string),
    paidByAmounts: amountsByPrefix(formData, 'paid-amount-'),
    splitWith: formData.getAll('expense-split-with').map((id) => id as string),
    splitAmounts: amountsByPrefix(formData, 'split-amount-'),
  });
}

/**
 * Cross-field checks that zod can't express on its own: every split/payer
 * must be a group member and all amounts must add up to the expense total.
 * Returns an error message, or null when the data is consistent.
 */
export function validateExpenseAmounts(
  data: ExpenseFormData,
  groupMemberIds: string[],
): string | null {
  const splitAmounts = data.splitAmounts || {};
  const paidByAmounts = data.paidByAmounts || {};
  const payers = data.isMultiplePaidBy
    ? data.paidByList || []
    : [data.paidBy || ''];

  const involved = [...data.splitWith, ...payers];
  if (involved.some((id) => !groupMemberIds.includes(id))) {
    return 'Payers and split members must belong to the group';
  }

  if (
    data.splitWith.length !== Object.keys(splitAmounts).length ||
    data.splitWith.some((id) => splitAmounts[id] === undefined)
  ) {
    return 'Split amount is required for each member';
  }

  const sum = (values: number[]) =>
    formatNumber(values.reduce((acc, amount) => acc + amount, 0));

  if (sum(Object.values(splitAmounts)) !== data.amount) {
    return 'Split amounts should add up to the total amount';
  }

  if (
    data.isMultiplePaidBy &&
    sum(payers.map((id) => paidByAmounts[id] ?? 0)) !== data.amount
  ) {
    return 'Sum of amounts paid by all payers should equal the total expense amount';
  }

  return null;
}
