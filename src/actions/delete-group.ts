'use server';

import db from '@/db/drizzle';
import {
  groupExpenses,
  groupMemberships,
  groupUserBalances,
  groups,
  transactions,
} from '@/db/schema';
import paths from '@/lib/paths';
import { auth } from '@clerk/nextjs';
import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteGroup(groupUuid: string) {
  const session = await auth();
  if (!session || !session.userId) {
    return {
      state: false,
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
        message: 'Group not found',
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
        message: 'You are not a member of this group',
      };
    }

    const groupExpensesRecord = await db.query.groupExpenses.findMany({
      where: eq(groupExpenses.groupId, group.id),
    });

    const expenseIds = groupExpensesRecord.map(
      (grpExpense) => grpExpense.expenseId,
    );

    if (expenseIds.length) {
      await db
        .delete(transactions)
        .where(inArray(transactions.expenseId, expenseIds));
    }

    await db.delete(groupExpenses).where(eq(groupExpenses.groupId, group.id));

    await db
      .delete(groupUserBalances)
      .where(eq(groupUserBalances.groupId, group.id));

    await db.delete(groups).where(eq(groups.uuid, groupUuid));

    await db
      .delete(groupMemberships)
      .where(eq(groupMemberships.groupId, group.id));
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        state: false,
        message: err.message,
      };
    } else {
      return {
        state: false,
        message: 'Something went wrong',
      };
    }
  }

  revalidatePath(paths.dashboard());
}
