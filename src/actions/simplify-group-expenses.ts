'use server';

import db from '@/db/drizzle';
import { groupExpenses, groupUserBalances, groups } from '@/db/schema';
import paths from '@/lib/paths';
import SplitManagerService from '@/services/split-manager-service';
import { auth } from '@clerk/nextjs';
import { SQL, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const buildConflictUpdateColumns = <
  T extends PgTable,
  Q extends keyof T['_']['columns'],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);
      return acc;
    },
    {} as Record<Q, SQL>,
  );
};

export async function simplifyGroupExpenses(groupUuid: string) {
  const session = await auth();
  if (!session || !session.userId) {
    return {
      errors: {
        _form: ['You must be signed in to do this.'],
      },
    };
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.uuid, groupUuid),
    with: {
      groupExpenses: {
        with: {
          expense: {
            with: {
              transactions: {
                with: {
                  payer: true,
                  receiver: true,
                },
              },
            },
          },
        },
        where: eq(groupExpenses.isExpenseSimplified, false),
      },
      groupMemberships: {
        with: {
          user: true,
        },
      },
      groupUserBalances: {
        with: {
          recipient: true,
          sender: true,
        },
      },
      owner: true,
    },
  });
  if (!group) {
    return {
      errors: {
        _form: ['Invalid group provided.'],
      },
    };
  }

  const newTransactions = group.groupExpenses
    .flatMap((groupExpense) => groupExpense.expense.transactions)
    .map((transaction) => ({
      expenseId: transaction.expenseId,
      payer: transaction.payer.id,
      receiver: transaction.receiver.id,
      amount: parseFloat(transaction.amount),
    }));

  const existingTransactions = group.groupUserBalances.map((balance) => ({
    payer: balance.recipient.id,
    receiver: balance.sender.id,
    amount: parseFloat(balance.amount),
  }));

  const splitManagerService = new SplitManagerService([
    ...newTransactions,
    ...existingTransactions,
  ]);
  const balances = splitManagerService.settleAllBalances().map((bal) => {
    return {
      groupId: group.id,
      senderId: bal.payer,
      recipientId: bal.receiver,
      amount: `${bal.amount.toFixed(2)}`,
      createdAt: new Date(),
    } as typeof groupUserBalances.$inferSelect;
  });

  await db
    .delete(groupUserBalances)
    .where(eq(groupUserBalances.groupId, group.id));

  if (balances.length) {
    await db.insert(groupUserBalances).values(balances);
  }

  const uniqueExpenseIds = [
    ...Array.from(new Set(group.groupExpenses.map((t) => t.expenseId))),
  ];

  if (!uniqueExpenseIds.length) {
    return {
      errors: {
        _form: ['No expenses found to simplify.'],
      },
    };
  }

  await db
    .update(groupExpenses)
    .set({
      isExpenseSimplified: true,
    })
    .where(inArray(groupExpenses.expenseId, uniqueExpenseIds));

  revalidatePath(paths.groupShow(groupUuid));
  redirect(paths.groupShow(groupUuid));
}
