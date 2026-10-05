'use server';

import db from '@/db/drizzle';
import { groupUserBalances, groups } from '@/db/schema';
import paths from '@/lib/paths';
import SplitManagerService from '@/services/split-manager-service';
import { requireGroupMember } from '@/lib/authz';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function simplifyGroupExpenses(groupUuid: string) {
  try {
    const access = await requireGroupMember(groupUuid);
    if (!access.ok) {
      return {
        state: false,
        title: 'Uh oh! Something went wrong 😕',
        message:
          access.reason === 'unauthenticated'
            ? 'You must be logged in to simplify group expenses.'
            : 'You do not have access to this group.',
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
        state: false,
        title: 'Uh oh! Something went wrong 😕',
        message: 'Group not found.',
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

    const splitManagerService = new SplitManagerService(newTransactions);

    const balances = splitManagerService.settleAllBalances().map((bal) => {
      return {
        groupId: group.id,
        senderId: bal.payer,
        recipientId: bal.receiver,
        amount: `${bal.amount.toFixed(2)}`,
      } as typeof groupUserBalances.$inferSelect;
    });

    await db
      .delete(groupUserBalances)
      .where(eq(groupUserBalances.groupId, group.id));

    if (balances.length) {
      await db.insert(groupUserBalances).values(balances);
    } else {
      return {
        state: false,
        title: 'Group expenses already simplified',
        message: 'No balances to simplify.',
      };
    }
  } catch {
    return {
      state: false,
      title: 'Uh oh! Something went wrong 😕',
      message: 'An error occurred while simplifying group expenses.',
    };
  }

  revalidatePath(paths.groupShow(groupUuid));
}
