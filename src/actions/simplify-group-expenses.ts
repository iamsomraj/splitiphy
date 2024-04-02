'use server';

import db from '@/db/drizzle';
import { groups, users } from '@/db/schema';
import SplitManagerService from '@/services/split-manager-service';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';

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
      payer: transaction.payer.id,
      receiver: transaction.receiver.id,
      amount: parseFloat(transaction.amount),
    }));

  const splitManagerService = new SplitManagerService(allTransactions);
  const balances = splitManagerService.settleBalances();

  if (balances.length === 0) {
    console.log('Group expenses settled successfully');
    return { errors: {} };
  }

  balances.forEach(async (bal) => {
    const payerUser = groupMembers[bal.payer];
    const receiverUser = groupMembers[bal.receiver];
    const amount = bal.amount.toFixed(2);
    console.log(
      `Payer: ${payerUser.firstName} Receiver: ${receiverUser.firstName} Amount: ${amount}`,
    );
  });

  return { errors: {} };
}
