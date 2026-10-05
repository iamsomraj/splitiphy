'use server';

import * as actions from '@/actions';
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
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function editGroupExpense(
  groupUuid: string,
  groupExpenseUuid: string,
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
    const groupExpense = await db.query.groupExpenses.findFirst({
      where: and(
        eq(groupExpenses.uuid, groupExpenseUuid),
        eq(groupExpenses.groupId, group.id),
      ),
    });

    if (!groupExpense) {
      return {
        errors: {
          _form: ['Expense not found'],
        },
      };
    }

    if (groupExpense.isSystemGenerated) {
      return {
        errors: {
          _form: ['Settlements cannot be edited'],
        },
      };
    }

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

    const transactionRecords = TransactionManagerService.createTransactions({
      isMultiplePaidBy: result.data.isMultiplePaidBy,
      paidByAmounts: result.data.paidByAmounts || {},
      splitAmounts: { ...(result.data.splitAmounts || {}) },
      sessionUserId: userId,
      expenseId: groupExpense.expenseId,
      paidBy: result.data.paidBy || '',
      paidByList: result.data.paidByList || [],
      splitWith: result.data.splitWith,
    });

    // neon-http has no interactive transactions; batch runs these atomically.
    await db.batch([
      db
        .update(expenses)
        .set({
          category: result.data.category,
          name: result.data.name,
          description: result.data.description || '',
          amount: `${result.data.amount}`,
          date: new Date(result.data.date),
          updatedAt: new Date(),
        })
        .where(eq(expenses.id, groupExpense.expenseId)),
      db
        .delete(transactions)
        .where(eq(transactions.expenseId, groupExpense.expenseId)),
      db.insert(transactions).values(transactionRecords),
    ]);

    await actions.simplifyGroupExpenses(groupUuid);
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
