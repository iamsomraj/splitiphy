import db from '@/db/drizzle';
import { groupMemberships, groups } from '@/db/schema';
import UserAuthService from '@/services/auth-user-service';
import { auth } from '@clerk/nextjs';
import { eq, inArray, or } from 'drizzle-orm';
import { cache } from 'react';

const monthMap: Record<number, string> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

const orderedMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const getMyYearlyExpenses = cache(async () => {
  const authUser = await auth();

  if (!authUser || !authUser.userId) {
    return [];
  }

  const userAuthService = new UserAuthService();
  const session = await userAuthService.createOrUpdateLoggedInUser();

  if (!session || !session[0].id) {
    return [];
  }

  const groupMemberRecords = await db.query.groupMemberships.findMany({
    where: eq(groupMemberships.userId, session[0].id),
  });

  const groupIds = groupMemberRecords.map((record) => record.groupId);

  const allGroups = await db.query.groups.findMany({
    where: or(
      eq(groups.ownerId, session[0].id),
      groupIds.length > 0 ? inArray(groups.id, groupIds) : undefined,
    ),
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
              owner: true,
            },
          },
        },
        orderBy: (groupExpenses, { desc }) => [desc(groupExpenses.createdAt)],
      },
      groupMemberships: {
        with: {
          user: true,
        },
      },
      groupUserBalances: {
        with: {
          sender: true,
          recipient: true,
        },
      },
      owner: true,
    },
    orderBy: (groups, { desc }) => [
      desc(groups.createdAt),
      desc(groups.updatedAt),
    ],
  });

  type Acc = Record<string, number>;

  const data = allGroups.reduce((acc: Acc, group) => {
    group.groupExpenses.forEach((groupExpense) => {
      if (
        new Date(groupExpense.expense.date).getFullYear() !==
        new Date().getFullYear()
      ) {
        return;
      }
      groupExpense.expense.transactions.forEach((transaction) => {
        if (transaction.payer.id === session[0].id) {
          const monthNumber = new Date(groupExpense.expense.date).getMonth();
          const month = monthMap[monthNumber] as string;
          acc[month] = acc[month] || 0;
          acc[month] += parseFloat(transaction.amount);
        }
        if (transaction.receiver.id === session[0].id) {
          const monthNumber = new Date(groupExpense.expense.date).getMonth();
          const month = monthMap[monthNumber] as string;
          acc[month] = acc[month] || 0;
          acc[month] -= parseFloat(transaction.amount);
        }
      });
    });
    return acc;
  }, {});

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].forEach((monthNumber) => {
    const month = monthMap[monthNumber];
    if (!data[month]) {
      data[month] = 0;
    }
  });

  const expenses = orderedMonths.reduce(
    (sortedAcc, month) => {
      sortedAcc.push({
        name: month,
        total: Math.round(data[month]),
      });
      return sortedAcc;
    },
    [] as { name: string; total: number }[],
  );

  return expenses;
});

export type MyExpensesData = NonNullable<
  Awaited<ReturnType<typeof getMyYearlyExpenses>>
>;
