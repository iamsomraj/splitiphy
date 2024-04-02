'use server';

import db from '@/db/drizzle';
import { groupUserBalances, groups, transactions, users } from '@/db/schema';
import paths from '@/lib/paths';
import SplitManagerService from '@/services/split-manager-service';
import { auth } from '@clerk/nextjs';
import { eq, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';

interface SettleGroupExpenseFormState {
  errors: {
    _form?: string[];
  };
}

export async function simplifyGroupExpenses(
  groupUuid: string,
  formState: SettleGroupExpenseFormState,
  formData: FormData,
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
  const groupMembers: Record<string, typeof users.$inferSelect> =
    group.groupMemberships.reduce(
      (acc, groupMembership) => ({
        ...acc,
        [groupMembership.user.id]: {
          ...groupMembership.user,
        },
      }),
      {},
    );
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

  await db.insert(groupUserBalances).values(balances);
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
