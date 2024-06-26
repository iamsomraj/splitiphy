'use server';

import db from '@/db/drizzle';
import {
  expenses,
  groupExpenses,
  groupMemberships,
  groups,
  transactions,
} from '@/db/schema';
import constants from '@/lib/constants';
import paths from '@/lib/paths';
import { formatNumber } from '@/lib/utils';
import TransactionManagerService from '@/services/transaction-manager-service';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const addGroupExpenseSchema = z.object({
  category: z
    .string()
    .min(3, {
      message: 'Expense category must be at least 3 characters long',
    })
    .max(50, {
      message: 'Expense category must be at most 50 characters long',
    })
    .regex(
      /[a-zA-Z-]+/,
      'Expense category must only contain lowercase or uppercase letters, hyphens',
    )
    .refine(
      (value) => {
        const categories = constants.expensesCategories.map(
          (category) => category.key,
        ) as string[];
        return categories.includes(value);
      },
      {
        message: 'Invalid expense category',
      },
    ),
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
  paidBy: z.string().optional(),
  isMultiplePaidBy: z.boolean(),
  paidByList: z.array(z.string()).optional(),
  paidByAmounts: z
    .record(z.number().positive('Amount should be a positive number'))
    .optional(),
  splitWith: z.array(z.string()).min(1, {
    message: 'At least one member should be selected to split with',
  }),
  splitAmounts: z
    .record(z.number().positive('Amount should be a positive number'))
    .optional(),
});

interface AddGroupExpenseFormState {
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

export async function addGroupExpense(
  groupUuid: string,
  _formState: AddGroupExpenseFormState,
  formData: FormData,
): Promise<AddGroupExpenseFormState> {
  const result = addGroupExpenseSchema.safeParse({
    category: formData.get('expense-category') as string,
    name: formData.get('expense-name') as string,
    description: formData.get('expense-description') as string,
    date: new Date(formData.get('expense-date') as string),
    amount: formatNumber(parseFloat(formData.get('expense-amount') as string)),
    paidBy: formData.get('expense-paid-by') as string,
    isMultiplePaidBy: formData.get('is-multiple-paid-by') === 'on',
    paidByList: Array.from(formData.getAll('expense-paid-by')).map(
      (id) => id as string,
    ),
    paidByAmounts: Object.fromEntries(
      Array.from(formData.entries())
        .filter(([name]) => name.startsWith('paid-amount-'))
        .map(([name, value]) => [
          name.split('-')[2] as string,
          formatNumber(parseFloat(value as string)),
        ]),
    ),
    splitWith: Array.from(formData.getAll('expense-split-with')).map(
      (id) => id as string,
    ),
    splitAmounts: Object.fromEntries(
      Array.from(formData.entries())
        .filter(([name]) => name.startsWith('split-amount-'))
        .map(([name, value]) => [
          name.split('-')[2] as string,
          formatNumber(parseFloat(value as string)),
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

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.uuid, groupUuid),
    });

    if (!group) {
      return {
        errors: {
          _form: ['Group not found'],
        },
      };
    }

    const groupMembers = await db.query.groupMemberships.findMany({
      where: eq(groupMemberships.groupId, group.id),
    });

    const groupMemberIds = groupMembers.map((member) => member.userId);

    if (!groupMemberIds.includes(session.userId)) {
      return {
        errors: {
          _form: ['You are not a member of this group'],
        },
      };
    }

    const splitWith = result.data.splitWith;
    const splitAmounts = result?.data?.splitAmounts || {};
    const paidByList = result?.data?.paidByList || [];
    const paidByAmounts = result?.data?.paidByAmounts || {};

    if (splitWith.length !== Object.keys(splitAmounts).length) {
      return {
        errors: {
          _form: ['Split amount is required for each member'],
        },
      };
    }

    const totalSplitAmount = formatNumber(
      Object.values(splitAmounts).reduce((acc, amount) => acc + amount, 0),
    );

    if (totalSplitAmount !== result.data.amount) {
      return {
        errors: {
          _form: ['Split amounts should add up to the total amount'],
        },
      };
    }

    const expense = await db
      .insert(expenses)
      .values({
        category: result.data.category,
        name: result.data.name,
        description: result.data.description,
        amount: `${result.data.amount}`,
        date: new Date(result.data.date),
        ownerId: session.userId,
      } as typeof expenses.$inferInsert)
      .returning();

    if (!expense.length || !expense[0].uuid || !expense[0].id) {
      return {
        errors: {
          _form: ['Something went wrong while creating the expense'],
        },
      };
    }

    const groupExpense = await db
      .insert(groupExpenses)
      .values({
        groupId: group.id,
        expenseId: expense[0].id,
      })
      .returning();

    if (!groupExpense.length || !groupExpense[0].id) {
      return {
        errors: {
          _form: ['Something went wrong while creating the expense'],
        },
      };
    }

    if (result.data.isMultiplePaidBy) {
      const totalPaidAmount = formatNumber(
        Object.values(paidByAmounts).reduce((acc, amount) => acc + amount, 0),
      );

      if (totalPaidAmount !== result.data.amount) {
        return {
          errors: {
            _form: [
              'Sum of amounts paid by all payers should equal the total expense amount',
            ],
          },
        };
      }
    }

    const transactionRecords = TransactionManagerService.createTransactions({
      isMultiplePaidBy: result.data.isMultiplePaidBy,
      paidByAmounts,
      splitAmounts,
      sessionUserId: session.userId,
      expenseId: expense[0].id,
      paidBy: result?.data?.paidBy || '',
      paidByList,
      splitWith,
    });

    const trxs = await db
      .insert(transactions)
      .values(transactionRecords as (typeof transactions.$inferInsert)[])
      .returning();

    if (!trxs.length) {
      return {
        errors: {
          _form: ['Something went wrong while creating the transactions'],
        },
      };
    }
  } catch (err) {
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
  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
