import { SingleGroupWithData } from '@/db/queries';
import { formatNumber } from '@/lib/utils';

type GroupExpense = NonNullable<SingleGroupWithData>['groupExpenses'][number];
type Transaction = GroupExpense['expense']['transactions'][number];

export type ExpenseSummary = {
  /** Everyone who paid, with how much they put in */
  payers: { user: Transaction['payer']; amount: number }[];
  /** What others owe the viewer for this expense */
  lent: number;
  /** What the viewer owes others for this expense */
  borrowed: number;
  net: number;
  involved: boolean;
};

/**
 * A transaction means "payer covered receiver's share"; payer === receiver is
 * the payer's own share (see TransactionManagerService).
 */
export const getExpenseSummary = (
  groupExpense: GroupExpense,
  viewerId: string,
): ExpenseSummary => {
  const payers = new Map<string, ExpenseSummary['payers'][number]>();
  let lent = 0;
  let borrowed = 0;
  let involved = false;

  for (const transaction of groupExpense.expense.transactions) {
    const amount = formatNumber(transaction.amount);
    const payer = payers.get(transaction.payerId);
    if (payer) {
      payer.amount += amount;
    } else {
      payers.set(transaction.payerId, { user: transaction.payer, amount });
    }

    const isPayer = transaction.payerId === viewerId;
    const isReceiver = transaction.receiverId === viewerId;
    if (isPayer || isReceiver) {
      involved = true;
    }
    if (isPayer && !isReceiver) {
      lent += amount;
    } else if (isReceiver && !isPayer) {
      borrowed += amount;
    }
  }

  return {
    payers: [...payers.values()].map((payer) => ({
      ...payer,
      amount: formatNumber(payer.amount),
    })),
    lent: formatNumber(lent),
    borrowed: formatNumber(borrowed),
    net: formatNumber(lent - borrowed),
    involved,
  };
};
