import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import constants from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import { ExpenseCategoryIcon } from './expense-category-icon';

type ExpenseListProps = {
  group: SingleGroupWithData;
  user: LoggedInUser;
};

const ExpenseList = ({ group, user }: ExpenseListProps) => {
  if (!group || !user) return null;

  const currencyCode = user.currency;
  const currencySymbol =
    constants.currenciesCodeSymbolMap[
      currencyCode as keyof typeof constants.currenciesCodeSymbolMap
    ];

  let totalAmount = 0;
  group.groupExpenses.forEach((groupExpense) => {
    totalAmount += formatNumber(groupExpense.expense.amount);
  });

  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableCaption>Group Expenses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Expense Category</TableHead>
              <TableHead>Expense Date</TableHead>
              <TableHead>Expense Name</TableHead>
              <TableHead>Expense Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Is Simplified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.groupExpenses.map((groupExpense) => (
              <TableRow key={groupExpense.uuid}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ExpenseCategoryIcon
                      icon={
                        constants.expenseCategoryKeyIconMap[
                          (groupExpense?.expense
                            ?.category as keyof typeof constants.expenseCategoryKeyIconMap) ||
                            'other'
                        ]
                      }
                      className="ml-2 h-4 w-4"
                    />
                    <span>
                      {constants.expensesCategories.find(
                        (category) =>
                          category.key === groupExpense.expense.category,
                      )?.name || 'Other'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {groupExpense.expense.date.toDateString()}
                </TableCell>
                <TableCell>{groupExpense.expense.name}</TableCell>
                <TableCell>{groupExpense.expense.description}</TableCell>
                <TableCell>
                  <span className="mr-2">{currencySymbol}</span>
                  {groupExpense.expense.amount}
                </TableCell>
                <TableCell>
                  {groupExpense.expense.transactions.map((transaction) => (
                    <div
                      key={transaction.uuid}
                      className="grid w-full grid-cols-3 gap-6"
                    >
                      <span className="col-span-2">
                        {transaction.payer.firstName}{' '}
                        {transaction.payer.lastName} paid{' '}
                        {transaction.receiver.firstName}{' '}
                        {transaction.receiver.lastName}
                      </span>
                      <span className="col-span-1">
                        <span className="mr-2">{currencySymbol}</span>
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {groupExpense.isExpenseSimplified ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell>
                <span className="mr-2">{currencySymbol}</span>
                {totalAmount}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <ul className="flex flex-col gap-6 sm:hidden">
        {group.groupExpenses.map((groupExpense) => (
          <li
            key={groupExpense.uuid}
            className="flex flex-col gap-2 rounded-sm border bg-muted/40 p-6 hover:bg-muted/20"
          >
            <div className="flex items-center justify-between gap-2">
              <span>{groupExpense.expense.date.toDateString()}</span>
              <span className="flex items-center font-semibold text-accent-foreground/40">
                <ExpenseCategoryIcon
                  icon={
                    constants.expenseCategoryKeyIconMap[
                      (groupExpense?.expense
                        ?.category as keyof typeof constants.expenseCategoryKeyIconMap) ||
                        'other'
                    ]
                  }
                  className="h-4 w-4"
                />
                <span>
                  {constants.expensesCategories.find(
                    (category) =>
                      category.key === groupExpense.expense.category,
                  )?.name || 'Other'}
                </span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {groupExpense.expense.name}
              </span>
              <span className="font-semibold text-accent-foreground/40">
                {groupExpense.expense.description}
              </span>
            </div>
            <div className="font-medium">
              Total <span className="mx-1">{currencySymbol}</span>
              {groupExpense.expense.amount}{' '}
              <span className="text-xs font-bold text-accent-foreground/40">
                {groupExpense.isExpenseSimplified ? 'simplified' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-4 pt-2">
              {groupExpense.expense.transactions.map((transaction) => (
                <div
                  key={transaction.uuid}
                  className="grid w-full grid-cols-3 gap-6 text-sm text-accent-foreground/70"
                >
                  <span className="col-span-2">
                    {transaction.payer.firstName} {transaction.payer.lastName}{' '}
                    paid {transaction.receiver.firstName}{' '}
                    {transaction.receiver.lastName}
                  </span>
                  <span className="col-span-1">
                    <span className="mr-2">{currencySymbol}</span>
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExpenseList;
