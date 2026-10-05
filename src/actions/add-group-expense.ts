'use server';

import db from '@/db/drizzle';
import {
  expenses,
  groupExpenses,
  groupMemberships,
  transactions,
} from '@/db/schema';
import { groupAccessErrorMessages, requireGroupMember } from '@/lib/authz';
import {
  ExpenseFormState,
  parseExpenseForm,
  validateExpenseAmounts,
} from '@/lib/expense-form';
import paths from '@/lib/paths';
import TransactionManagerService from '@/services/transaction-manager-service';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function addGroupExpense(
  groupUuid: string,
  _formState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const result = parseExpenseForm(formData);

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const access = await requireGroupMember(groupUuid);
  if (!access.ok) {
    return {
      errors: {
        _form: [groupAccessErrorMessages[access.reason]],
      },
    };
  }
  const { group, userId } = access;

  try {
    const groupMembers = await db.query.groupMemberships.findMany({
      where: eq(groupMemberships.groupId, group.id),
    });

    const validationError = validateExpenseAmounts(
      result.data,
      groupMembers.map((member) => member.userId),
    );
    if (validationError) {
      return {
        errors: {
          _form: [validationError],
        },
      };
    }

    const expense = await db
      .insert(expenses)
      .values({
        category: result.data.category,
        name: result.data.name,
        description: result.data.description || '',
        amount: `${result.data.amount}`,
        date: new Date(result.data.date),
        ownerId: userId,
      })
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

    const transactionRecords = TransactionManagerService.createTransactions({
      isMultiplePaidBy: result.data.isMultiplePaidBy,
      paidByAmounts: result.data.paidByAmounts || {},
      splitAmounts: { ...(result.data.splitAmounts || {}) },
      sessionUserId: userId,
      expenseId: expense[0].id,
      paidBy: result.data.paidBy || '',
      paidByList: result.data.paidByList || [],
      splitWith: result.data.splitWith,
    });

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
    return {
      errors: {
        _form: [err instanceof Error ? err.message : 'Something went wrong'],
      },
    };
  }
  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
