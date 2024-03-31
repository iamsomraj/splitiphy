import { GroupWithData } from '@/db/queries';

type GroupMembersProps = {
  group: GroupWithData;
};

const GroupExpenses = ({ group }: GroupMembersProps) => {
  return group ? (
    <div>
      <h2>Expenses</h2>
      <ul className="flex flex-col gap-y-4">
        {group.groupExpenses.map((groupExpense) => (
          <li key={groupExpense.uuid}>
            <h3>Expense Name {groupExpense.expense.name}</h3>
            <p>Expense Description {groupExpense.expense.description}</p>
            <div>Expense Amount {groupExpense.expense.amount}</div>
            <div>
              {groupExpense.expense.transactions.map((transaction) => (
                <div key={transaction.uuid}>
                  {transaction.payer.firstName +
                    ' ' +
                    transaction.payer.lastName}{' '}
                  paid{' '}
                  {transaction.receiver.firstName +
                    ' ' +
                    transaction.receiver.lastName}{' '}
                  {transaction.amount}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default GroupExpenses;
