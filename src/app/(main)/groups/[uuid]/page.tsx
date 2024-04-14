import ExpenseList from '@/components/groups/expense-list';
import GroupBalances from '@/components/groups/group-balances';
import GroupMembers from '@/components/groups/group-members';
import GroupSimplifyButton from '@/components/groups/group-simplify-button';
import SettleUpButton from '@/components/groups/settle-up-button';
import { Button } from '@/components/ui/button';
import { getGroupDetailsById } from '@/db/queries';
import paths from '@/lib/paths';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

type GroupsShowPageProps = {
  params: {
    uuid: string;
  };
};

const GroupsShowPage = async ({ params }: GroupsShowPageProps) => {
  const group = await getGroupDetailsById(params.uuid);

  return group ? (
    <main className="flex flex-1 flex-col gap-6 divide-y py-4 pt-6 sm:py-6 lg:py-12">
      <div className="flex flex-col gap-6 px-6 sm:px-12">
        <div className="flex flex-row items-end gap-2">
          <span className="text-4xl font-bold">{group.name}</span>
          <span className="font-medium text-accent-foreground/40">
            {group.groupMemberships.length}{' '}
            {group.groupMemberships.length > 1 ? 'members' : 'member'}
          </span>
        </div>
        <GroupBalances group={group} />
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
      <div className="flex flex-col gap-6 px-6 pt-6 sm:px-12">
        <div className="flex flex-col  justify-between gap-4 sm:flex-row sm:items-center">
          <span className="text-2xl font-bold">Expenses</span>
          <Link href={paths.groupAddNewExpense(group.uuid)}>
            <Button className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Expense</span>
            </Button>
          </Link>
        </div>
        {group.groupExpenses.length === 0 ? (
          <span className="py-8 text-center text-xl font-bold text-accent-foreground/40">
            No expenses have been added yet.
          </span>
        ) : (
          <ExpenseList group={group} />
        )}
      </div>
    </main>
  ) : null;
};

export default GroupsShowPage;
