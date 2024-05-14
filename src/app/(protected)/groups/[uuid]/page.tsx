import ExpenseList from '@/components/groups/expense-list';
import GroupBalances from '@/components/groups/group-balances';
import GroupMembers from '@/components/groups/group-members';
import GroupSimplifyButton from '@/components/groups/group-simplify-button';
import SettleUpButton from '@/components/groups/settle-up-button';
import { Button } from '@/components/ui/button';
import {
  LoggedInUser,
  SingleGroupWithData,
  getGroupDetailsById,
  getLoggedInUser,
} from '@/db/queries';
import paths from '@/lib/paths';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type GroupHeaderProps = {
  groupName: string;
  memberCount: number;
};

const GroupHeader = ({ groupName, memberCount }: GroupHeaderProps) => (
  <div className="flex flex-wrap items-end gap-2">
    <span className="text-4xl font-bold">{groupName}</span>
    <span className="font-medium text-accent-foreground/40">
      {memberCount} {memberCount > 1 ? 'members' : 'member'}
    </span>
  </div>
);

type GroupExpensesProps = {
  group: SingleGroupWithData;
  user: LoggedInUser;
};

const GroupExpenses = ({ group, user }: GroupExpensesProps) => (
  <div className="flex flex-col gap-6 px-6 pt-6 sm:px-12">
    <div className="flex flex-col  justify-between gap-4 sm:flex-row sm:items-center">
      <span className="text-2xl font-bold">Expenses</span>
      <Link href={paths.groupAddNewExpense(group?.uuid || '')}>
        <Button className="fixed bottom-5 right-5 h-16 w-16 gap-1 rounded-full sm:static sm:h-auto sm:w-auto sm:rounded-md">
          <Plus className="h-10 w-10 sm:h-3.5 sm:w-3.5" />
          <span className="hidden sm:block">Add Expense</span>
        </Button>
      </Link>
    </div>
    {group?.groupExpenses.length === 0 ? (
      <span className="py-8 text-center text-xl font-bold text-accent-foreground/40">
        No expenses have been added yet.
      </span>
    ) : (
      <ExpenseList group={group} user={user} />
    )}
  </div>
);

type GroupDetailsPageProps = {
  params: {
    uuid: string;
  };
};

const GroupDetailsPage = async ({ params }: GroupDetailsPageProps) => {
  const group = await getGroupDetailsById(params.uuid);
  const user = await getLoggedInUser();

  if (!group) {
    redirect(paths.dashboard());
  }

  return (
    <main className="flex flex-1 flex-col gap-6 divide-y py-4 pt-6 sm:py-6 lg:py-12">
      <div className="flex flex-col gap-6 px-6 sm:px-12">
        <GroupHeader
          groupName={group.name}
          memberCount={group.groupMemberships.length}
        />
        <GroupBalances group={group} user={user} />
      </div>
      <div className="flex max-w-full gap-6 overflow-x-auto px-6 pt-6 scrollbar-none sm:px-12">
        <GroupSimplifyButton group={group} />
        {group.groupUserBalances.length > 0 &&
          group.groupUserBalances.map((balance) => (
            <SettleUpButton
              key={balance.uuid}
              balance={balance}
              groupUuid={group?.uuid || ''}
            />
          ))}
        <GroupMembers group={group} className="w-full" />
      </div>
      <GroupExpenses group={group} user={user} />
    </main>
  );
};

export default GroupDetailsPage;
