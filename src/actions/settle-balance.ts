'use server';

import db from '@/db/drizzle';
import {
  expenses,
  groupExpenses,
  groupUserBalances,
  transactions,
} from '@/db/schema';
import { requireGroupMember } from '@/lib/authz';
import paths from '@/lib/paths';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
export async function settleBalance(groupUuid: string, balanceUuid: string) {
  try {
    const access = await requireGroupMember(groupUuid);
    if (!access.ok) {
      return {
        state: false,
      };
    }
    const { group, userId } = access;

    const groupUserBalance = await db.query.groupUserBalances.findFirst({
      where: and(
        eq(groupUserBalances.uuid, balanceUuid),
        eq(groupUserBalances.groupId, group.id),
      ),
      with: {
        recipient: true,
        sender: true,
      },
    });

    if (!groupUserBalance) {
      return {
        state: false,
      };
    }

    const expense = await db
      .insert(expenses)
      .values({
        category: 'other',
        name: `Expense settled`,
        description: `${groupUserBalance?.recipient?.firstName} ${groupUserBalance?.recipient?.lastName?.charAt(0).toUpperCase() + '.'} and ${groupUserBalance?.sender?.firstName} ${groupUserBalance?.sender?.lastName?.charAt(0).toUpperCase() + '.'} settled up!`,
        amount: groupUserBalance.amount,
        date: new Date(),
        ownerId: userId,
      } as typeof expenses.$inferInsert)
      .returning();

    if (!expense.length || !expense[0].uuid || !expense[0].id) {
      return {
        state: false,
      };
    }

    const groupExpense = await db
      .insert(groupExpenses)
      .values({
        groupId: group.id,
        expenseId: expense[0].id,
        isSystemGenerated: true,
      })
      .returning();

    if (!groupExpense.length || !groupExpense[0].id) {
      return {
        state: false,
      };
    }

    await db
      .insert(transactions)
      .values({
        ownerId: userId,
        payerId: groupUserBalance.senderId,
        receiverId: groupUserBalance.recipientId,
        expenseId: expense[0].id,
        amount: groupUserBalance.amount,
      } as typeof transactions.$inferInsert)
      .returning();

    await db
      .delete(groupUserBalances)
      .where(eq(groupUserBalances.uuid, balanceUuid));
  } catch {
    return {
      state: false,
    };
  }

  revalidatePath(paths.groupShow(groupUuid));
}
