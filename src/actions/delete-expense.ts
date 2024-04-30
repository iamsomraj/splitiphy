'use server';

import db from '@/db/drizzle';
import { expenses, groupExpenses, groups, transactions } from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteExpense(
  groupUuid: string,
  groupExpenseUuid: string,
) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return {
        state: false,
      };
    }

    const group = await db.query.groups.findFirst({
      where: eq(groups.uuid, groupUuid),
    });

    if (!group) {
      return {
        state: false,
      };
    }

    const groupExpense = await db.query.groupExpenses.findFirst({
      where: eq(groupExpenses.groupId, group.id),
    });

    if (!groupExpense) {
      return {
        state: false,
      };
    }

    const expense = await db.query.expenses.findFirst({
      where: eq(expenses.id, groupExpense.expenseId),
    });

    if (!expense) {
      return {
        state: false,
      };
    }

    const transactionsToDelete = await db.query.transactions.findMany({
      where: eq(transactions.expenseId, expense.id),
    });

    if (transactionsToDelete.length === 0) {
      return {
        state: false,
      };
    }

    await db.delete(groupExpenses).where(eq(groupExpenses.groupId, group.id));

    await db.delete(expenses).where(eq(expenses.id, expense.id));

    await db.delete(transactions).where(
      inArray(
        transactions.id,
        transactionsToDelete.map((t) => t.id),
      ),
    );
  } catch (error) {
    return {
      state: false,
    };
  }

  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
