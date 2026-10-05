'use server';

import db from '@/db/drizzle';
import {
  expenses,
  groupExpenses,
  groupMemberships,
  groupUserBalances,
  groups,
  transactions,
} from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs/server';
import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteGroup(groupUuid: string) {
  const session = await auth();
  if (!session || !session.userId) {
    return {
      state: false,
      title: 'Shucks! You are not signed in.',
      message: 'You must be signed in to do this.',
    };
  }

  try {
    const group = await db.query.groups.findFirst({
      where: eq(groups.uuid, groupUuid),
    });

    if (!group) {
      return {
        state: false,
        title: "Shucks! We couldn't find the group.",
        message: 'Group not found',
      };
    }

    if (group.ownerId !== session.userId) {
      return {
        state: false,
        title: 'Shucks! You do not have permission to delete this group.',
        message: 'You are not the owner of this group',
      };
    }

    const groupMembershipRecord = await db.query.groupMemberships.findFirst({
      where: and(
        eq(groupMemberships.groupId, group.id),
        eq(groupMemberships.userId, session.userId),
      ),
    });

    if (!groupMembershipRecord) {
      return {
        state: false,
        title: 'Shucks! You do not have permission to delete this group.',
        message: 'You are not a member of this group',
      };
    }

    const groupExpensesRecord = await db.query.groupExpenses.findMany({
      where: eq(groupExpenses.groupId, group.id),
    });

    const expenseIds = groupExpensesRecord.map(
      (grpExpense) => grpExpense.expenseId,
    );

    // Child rows first, then the group itself, in a single atomic batch.
    await db.batch([
      db
        .delete(transactions)
        .where(inArray(transactions.expenseId, expenseIds)),
      db.delete(groupExpenses).where(eq(groupExpenses.groupId, group.id)),
      db.delete(expenses).where(inArray(expenses.id, expenseIds)),
      db
        .delete(groupUserBalances)
        .where(eq(groupUserBalances.groupId, group.id)),
      db.delete(groupMemberships).where(eq(groupMemberships.groupId, group.id)),
      db.delete(groups).where(eq(groups.id, group.id)),
    ]);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        state: false,
        title: 'Shucks! Something went wrong.',
        message: err.message,
      };
    } else {
      return {
        state: false,
        title: 'Shucks! Something went wrong.',
        message: 'Something went wrong',
      };
    }
  }

  revalidatePath(paths.dashboard());
}
