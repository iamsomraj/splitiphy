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
import { GroupWithData } from '@/db/queries';
import { formatNumber } from '@/lib/utils';

type ExpenseListProps = {
  group: GroupWithData;
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
                    <div key={transaction.uuid}>
                      {transaction.payer.firstName} {transaction.payer.lastName}{' '}
                      paid {transaction.receiver.firstName}{' '}
                      {transaction.receiver.lastName} {transaction.amount}
                    </div>
                  ))}
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
            className="flex flex-col rounded-md border bg-muted/40 p-6 hover:bg-muted/20"
          >
            <div>{groupExpense.expense.createdAt.toDateString()}</div>
            <div className="flex gap-2">
              <span className="text-lg font-medium">
                {groupExpense.expense.name}
              </span>
              <span className="text-lg text-accent-foreground/40">
                {groupExpense.expense.description}
              </span>
            </div>
            <div>Total {groupExpense.expense.amount}</div>
            <div>
              {groupExpense.expense.transactions.map((transaction) => (
                <div key={transaction.uuid}>
                  {transaction.payer.firstName} {transaction.payer.lastName}{' '}
                  paid {transaction.receiver.firstName}{' '}
                  {transaction.receiver.lastName} {transaction.amount}
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
