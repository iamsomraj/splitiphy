'use server';

import db from '@/db/drizzle';
import { groupUserBalances, groups, transactions } from '@/db/schema';
import paths from '@/lib/paths';
import SplitManagerService from '@/services/split-manager-service';
import { auth } from '@clerk/nextjs';
import { SQL, eq, getTableColumns, inArray, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
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

interface SettleGroupExpenseFormState {
  errors: {
    _form?: string[];
  };
}

export async function simplifyGroupExpenses(
  groupUuid: string,
  _formState: SettleGroupExpenseFormState,
  _formData: FormData,
): Promise<SettleGroupExpenseFormState> {
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
                where: eq(transactions.isSimplified, false),
              },
            },
          },
        },
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

  const allTransactions = group.groupExpenses
    .flatMap((groupExpense) => groupExpense.expense.transactions)
    .map((transaction) => ({
      id: transaction.id,
      payer: transaction.payer.id,
      receiver: transaction.receiver.id,
      amount: parseFloat(transaction.amount),
    }));

  const splitManagerService = new SplitManagerService(allTransactions);
  const balances = splitManagerService.settleBalances().map((bal) => {
    return {
      groupId: group.id,
      senderId: bal.payer,
      recipientId: bal.receiver,
      amount: `${bal.amount.toFixed(2)}`,
      createdAt: new Date(),
    } as typeof groupUserBalances.$inferSelect;
  });

  await db
    .insert(groupUserBalances)
    .values(balances)
    .onConflictDoUpdate({
      target: [
        groupUserBalances.groupId,
        groupUserBalances.senderId,
        groupUserBalances.recipientId,
      ],
      set: buildConflictUpdateColumns(groupUserBalances, ['amount']),
    });

  await db
    .update(transactions)
    .set({ isSimplified: true })
    .where(
      inArray(
        transactions.id,
        allTransactions.map((t) => t.id),
      ),
    );

  redirect(paths.groupShow(groupUuid));
}
