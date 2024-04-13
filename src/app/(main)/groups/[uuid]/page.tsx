import GroupBalances from '@/components/groups/group-balances';
import GroupExpenseForm from '@/components/groups/group-expense-form';
import ExpenseList from '@/components/groups/expense-list';
import GroupMembers from '@/components/groups/group-members';
import GroupSimplifyButton from '@/components/groups/group-simplify-button';
import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import SettleUpButton from '@/components/groups/settle-up-button';
import { getGroupDetailsById } from '@/db/queries';

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
        <h1 className="w-full text-xl font-bold">Expenses</h1>
        <ExpenseList group={group} />
      </div>
      <GroupExpenseForm group={group} />
    </main>
  ) : null;
};

export default GroupsShowPage;
