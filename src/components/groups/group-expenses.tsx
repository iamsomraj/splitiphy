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

type GroupMembersProps = {
  group: GroupWithData;
};

const GroupExpenses = ({ group }: GroupMembersProps) => {
  if (!group) return null;

  let totalAmount = 0;
  group.groupExpenses.forEach((groupExpense) => {
    totalAmount += formatNumber(groupExpense.expense.amount);
  });
  return (
    <Table>
      <TableCaption>Group Expenses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Expense Date</TableHead>
          <TableHead>Expense Name</TableHead>
          <TableHead>Expense Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payer</TableHead>
          <TableHead>Receiver</TableHead>
          <TableHead>Transaction Amount</TableHead>
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
                  {transaction.payer.firstName +
                    ' ' +
                    transaction.payer.lastName}
                </div>
              ))}
            </TableCell>
            <TableCell>
              {groupExpense.expense.transactions.map((transaction) => (
                <div key={transaction.uuid}>
                  {transaction.receiver.firstName +
                    ' ' +
                    transaction.receiver.lastName}
                </div>
              ))}
            </TableCell>
            <TableCell>
              {groupExpense.expense.transactions.map((transaction) => (
                <div key={transaction.uuid}>{transaction.amount}</div>
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
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default GroupExpenses;
