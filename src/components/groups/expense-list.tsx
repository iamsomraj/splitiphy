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
import { SingleGroupWithData } from '@/db/queries';
import { formatNumber } from '@/lib/utils';

type ExpenseListProps = {
  group: SingleGroupWithData;
};

const ExpenseList = ({ group }: ExpenseListProps) => {
  if (!group) return null;

  let totalAmount = 0;
  group.groupExpenses.forEach((groupExpense) => {
    totalAmount += formatNumber(groupExpense.expense.amount);
  });

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableCaption>Group Expenses</TableCaption>
          <TableHeader>
            <TableRow>
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
                  {groupExpense.expense.createdAt.toDateString()}
                </TableCell>
                <TableCell>{groupExpense.expense.name}</TableCell>
                <TableCell>{groupExpense.expense.description}</TableCell>
                <TableCell>{groupExpense.expense.amount}</TableCell>
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
                      <span className="col-span-1">{transaction.amount}</span>
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
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>{totalAmount}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <ul className="flex flex-col gap-6 md:hidden">
        {group.groupExpenses.map((groupExpense) => (
          <li
            key={groupExpense.uuid}
            className="flex flex-col gap-2 rounded-md border bg-muted/40 p-6 hover:bg-muted/20"
          >
            <div>{groupExpense.expense.createdAt.toDateString()}</div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">
                {groupExpense.expense.name}
              </span>
              <span className="font-semibold text-accent-foreground/40">
                {groupExpense.expense.description}
              </span>
            </div>
            <div className="font-medium">
              Total {groupExpense.expense.amount}{' '}
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
                  <span className="col-span-1">{transaction.amount}</span>
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
