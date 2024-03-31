'use server';

import db from '@/db/drizzle';
import { expenses, groupExpenses, groups, transactions } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
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
  paidBy: z.string(),
  splitWith: z.array(z.string()).min(1, {
    message: 'At least one member should be selected to split with',
  }),
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
    splitAmounts?: string[];
    _form?: string[];
  };
}

export async function createGroupExpense(
  groupUuid: string,
  _formState: CreateGroupExpenseFormState,
  formData: FormData,
): Promise<CreateGroupExpenseFormState> {
  const result = createGroupExpenseSchema.safeParse({
    name: formData.get('expense-name') as string,
    description: formData.get('expense-description') as string,
    date: new Date(formData.get('expense-date') as string),
    amount: parseFloat(formData.get('expense-amount') as string),
    paidBy: formData.get('expense-paid-by') as string,
    splitWith: Array.from(formData.getAll('expense-split-with')).map(
      (id) => id as string,
    ),
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
      where: eq(groups.id, group.id),
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
    const splitAmounts = result.data.splitAmounts;

    if (splitWith.length !== Object.keys(splitAmounts || {}).length) {
      return {
        errors: {
          _form: ['Split amount is required for each member'],
        },
      };
    }

    const totalSplitAmount = Object.values(splitAmounts || {}).reduce(
      (acc, amount) => acc + amount,
      0,
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
        name: result.data.name,
        description: result.data.description,
        expenseDate: new Date(result.data.date),
        ownerId: result.data.paidBy,
        createdAt: new Date(),
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
        createdAt: new Date(),
      })
      .returning();

    if (!groupExpense.length || !groupExpense[0].id) {
      return {
        errors: {
          _form: ['Something went wrong while creating the expense'],
        },
      };
    }

    const transactionRecords = Object.entries(splitAmounts || {}).map(
      ([userId, amount]) => ({
        ownerId: result.data.paidBy,
        payerId: result.data.paidBy,
        receiverId: userId,
        expenseId: expense[0].id,
        createdAt: new Date(),
        amount: `${amount}`,
      }),
    ) as (typeof transactions.$inferInsert)[];

    const trxs = await db
      .insert(transactions)
      .values(transactionRecords)
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
