import GroupExpenseForm from '@/components/groups/group-expense-form';
import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import { getGroupDetailsById } from '@/db/queries';
import paths from '@/lib/paths';
import Link from 'next/link';

type GroupsShowPageProps = {
  params: {
    uuid: string;
  };
};

const GroupsShowPage = async ({ params }: GroupsShowPageProps) => {
  const group = await getGroupDetailsById(params.uuid);

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div>
      <Link href={paths.groups()}>Back to Groups</Link>
      <h1>Group Name: {group.name}</h1>
      <GroupUserSearchForm groupUuid={params.uuid} />
      <div>
        <h2>Members</h2>
        <ul className="flex flex-col gap-y-4">
          {group.groupMemberships.map((member) => (
            <li key={member.uuid}>
              <div>@{member.user.username}</div>
              <div>{member.user.firstName + ' ' + member.user.lastName}</div>
              <div>{member.user.email}</div>
            </li>
          ))}
        </ul>
      </div>

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
      <GroupExpenseForm group={group} />
    </div>
  );
};

export default GroupsShowPage;
