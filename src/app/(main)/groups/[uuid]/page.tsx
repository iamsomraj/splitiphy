import GroupBalances from '@/components/groups/group-balances';
import GroupExpenseForm from '@/components/groups/group-expense-form';
import GroupExpenses from '@/components/groups/group-expenses';
import GroupMembers from '@/components/groups/group-members';
import GroupSimplifyForm from '@/components/groups/group-simplify-form';
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
        <h1 className="w-full text-4xl font-bold">{group.name}</h1>
        <GroupBalances group={group} />
      </div>
      <div className="scrollbar-none flex max-w-full gap-6 overflow-x-auto px-6 pt-6 sm:px-12">
        <GroupSimplifyForm group={group} />
        {group.groupUserBalances.length > 0 &&
          group.groupUserBalances.map((balance) => (
            <SettleUpButton
              key={balance.uuid}
              balance={balance}
              groupUuid={group?.uuid || ''}
            />
          ))}
      </div>
      <div className="grid grid-cols-2 gap-6 pt-6">
        <GroupUserSearchForm
          groupUuid={params.uuid}
          className="col-span-2 sm:col-span-1"
        />
        <div className="col-span-2 grid w-full place-items-center gap-6 sm:col-span-1">
          <GroupMembers group={group} className="w-full" />
          <GroupSimplifyForm group={group} className="w-full" />
        </div>
      </div>
      <GroupExpenses group={group} />
      <GroupExpenseForm group={group} />
    </main>
  ) : null;
};

export default GroupsShowPage;
