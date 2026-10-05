import BackButton from '@/app/(protected)/groups/[uuid]/expenses/new/_components/back-button';
import GroupExpenseForm, {
  ExpenseFormValues,
} from '@/app/(protected)/groups/[uuid]/expenses/new/_components/group-expense-form';
import { getGroupDetailsById, SingleGroupWithData } from '@/db/queries';
import paths from '@/lib/paths';
import { formatNumber } from '@/lib/utils';
import { redirect } from 'next/navigation';

type EditExpensePageProps = {
  params: Promise<{
    uuid: string;
    expenseUuid: string;
  }>;
};

type GroupExpense = NonNullable<SingleGroupWithData>['groupExpenses'][number];

/**
 * Rebuilds the form state from an expense's stored transactions: each
 * transaction is "payer covered receiver's share", so summing by payer gives
 * what each person paid and summing by receiver gives each person's split.
 */
const toFormValues = ({ expense }: GroupExpense): ExpenseFormValues => {
  const paidByAmounts: Record<string, number> = {};
  const splitAmounts: Record<string, number> = {};

  for (const transaction of expense.transactions) {
    const amount = formatNumber(transaction.amount);
    paidByAmounts[transaction.payerId] = formatNumber(
      (paidByAmounts[transaction.payerId] || 0) + amount,
    );
    splitAmounts[transaction.receiverId] = formatNumber(
      (splitAmounts[transaction.receiverId] || 0) + amount,
    );
  }

  const paidByList = Object.keys(paidByAmounts);

  return {
    expenseCategory: expense.category || 'other',
    expenseName: expense.name,
    expenseDescription: expense.description,
    expenseDate: expense.date,
    expenseAmount: formatNumber(expense.amount),
    isMultiplePaidBy: paidByList.length > 1,
    paidBy: paidByList[0] || '',
    paidByList,
    paidByAmounts,
    expenseSplitWith: Object.keys(splitAmounts),
    splitAmounts,
  };
};

export default async function EditExpensePage(props: EditExpensePageProps) {
  const { uuid, expenseUuid } = await props.params;
  const group = await getGroupDetailsById(uuid);

  if (!group) {
    redirect(paths.dashboard());
  }

  const groupExpense = group.groupExpenses.find(
    (item) => item.uuid === expenseUuid,
  );

  if (!groupExpense || groupExpense.isSystemGenerated) {
    redirect(paths.groupShow(uuid));
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-6 pb-12 sm:px-6 lg:px-12">
      <div className="flex items-center justify-start gap-2">
        <BackButton groupUuid={group.uuid || ''} />
        <h1 className="flex-1 shrink-0 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
          Edit {groupExpense.expense.name}
        </h1>
      </div>
      <GroupExpenseForm
        group={group}
        groupExpenseUuid={expenseUuid}
        initialValues={toFormValues(groupExpense)}
      />
    </main>
  );
}
