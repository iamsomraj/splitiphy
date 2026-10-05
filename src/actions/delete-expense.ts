'use server';

import * as actions from '@/actions';
import db from '@/db/drizzle';
import { expenses, groupExpenses, transactions } from '@/db/schema';
import { requireGroupMember } from '@/lib/authz';
import paths from '@/lib/paths';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteExpense(
  groupUuid: string,
  groupExpenseUuid: string,
) {
  try {
    const access = await requireGroupMember(groupUuid);
    if (!access.ok) {
      return {
        state: false,
      };
    }

    // Scope the lookup to the group so an expense from another group
    // can't be deleted by pairing it with a group the caller belongs to.
    const groupExpense = await db.query.groupExpenses.findFirst({
      where: and(
        eq(groupExpenses.uuid, groupExpenseUuid),
        eq(groupExpenses.groupId, access.group.id),
      ),
    });

    if (!groupExpense) {
      return {
        state: false,
      };
    }

    await db.batch([
      db
        .delete(transactions)
        .where(eq(transactions.expenseId, groupExpense.expenseId)),
      db
        .delete(groupExpenses)
        .where(eq(groupExpenses.expenseId, groupExpense.expenseId)),
      db.delete(expenses).where(eq(expenses.id, groupExpense.expenseId)),
    ]);

    await actions.simplifyGroupExpenses(groupUuid);
  } catch {
    return {
      state: false,
    };
  }

  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
