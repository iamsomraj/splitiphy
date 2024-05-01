'use server';

import db from '@/db/drizzle';
import {
  expenses,
  groupExpenses,
  groupUserBalances,
  groups,
  transactions,
} from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function settleBalance(groupUuid: string, balanceUuid: string) {
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

    const groupUserBalance = await db.query.groupUserBalances.findFirst({
      where: eq(groupUserBalances.uuid, balanceUuid),
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
        ownerId: session.userId,
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
        ownerId: session.userId,
        payerId: groupUserBalance.senderId,
        receiverId: groupUserBalance.recipientId,
        expenseId: expense[0].id,
        amount: groupUserBalance.amount,
      } as typeof transactions.$inferInsert)
      .returning();

    await db
      .delete(groupUserBalances)
      .where(eq(groupUserBalances.uuid, balanceUuid));
  } catch (error) {
    return {
      state: false,
    };
  }

  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
