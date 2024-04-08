import { transactions } from '@/db/schema';

interface TransactionParams {
  expenseAmount: number;
  isMultiplePaidBy: boolean;
  paidByAmounts: Record<string, number>;
  splitAmounts: Record<string, number>;
  sessionUserId: string;
  expenseId: number;
  paidBy: string;
  paidByList: string[];
  splitWith: string[];
}

class TransactionManagerService {
  static createTransactions(params: TransactionParams) {
    const {
      expenseAmount,
      isMultiplePaidBy,
      paidByAmounts,
      splitAmounts,
      sessionUserId,
      expenseId,
      paidBy,
      paidByList,
      splitWith,
    } = params;

    let transactionRecords: (typeof transactions.$inferInsert)[] = [];

    if (isMultiplePaidBy) {
      // Iterate through paidByList and paidByAmounts
      for (const payerId of paidByList) {
        let amountPaidByPayer = paidByAmounts[payerId];

        // Check if the payer owes money to themselves
        if (splitWith.includes(payerId) && splitAmounts[payerId] > 0) {
          const amountToPaySelf = Math.min(
            amountPaidByPayer,
            splitAmounts[payerId],
          );

          transactionRecords.push({
            ownerId: sessionUserId,
            payerId,
            receiverId: payerId,
            expenseId: expenseId,
            createdAt: new Date(),
            amount: `${amountToPaySelf}`,
          });

          splitAmounts[payerId] -= amountToPaySelf;
          amountPaidByPayer -= amountToPaySelf;
        }

        // Distribute remaining amount paid by the payer to other members
        for (const receiverId of splitWith) {
          if (amountPaidByPayer <= 0) {
            break; // Payer has no more money to distribute
          }

          if (splitAmounts[receiverId] > 0 && receiverId !== payerId) {
            const amountToPayReceiver = Math.min(
              amountPaidByPayer,
              splitAmounts[receiverId],
            );

            transactionRecords.push({
              ownerId: sessionUserId,
              payerId,
              receiverId,
              expenseId: expenseId,
              createdAt: new Date(),
              amount: `${amountToPayReceiver}`,
            });

            splitAmounts[receiverId] -= amountToPayReceiver;
            amountPaidByPayer -= amountToPayReceiver;
          }
        }
      }
    } else {
      // Existing transaction creation logic for single payer
      transactionRecords = Object.entries(splitAmounts).map(
        ([userId, amount]) => ({
          ownerId: sessionUserId,
          payerId: paidBy,
          receiverId: userId,
          expenseId: expenseId,
          createdAt: new Date(),
          amount: `${amount}`,
        }),
      ) as (typeof transactions.$inferInsert)[];
    }

    return transactionRecords as (typeof transactions.$inferInsert)[];
  }
}

export default TransactionManagerService;
