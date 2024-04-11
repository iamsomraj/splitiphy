import GroupBalances from '@/components/groups/group-balances';
import GroupExpenseForm from '@/components/groups/group-expense-form';
import GroupExpenses from '@/components/groups/group-expenses';
import GroupMembers from '@/components/groups/group-members';
import GroupSimplifyForm from '@/components/groups/group-simplify-form';
import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import { getGroupDetailsById } from '@/db/queries';

type GroupsShowPageProps = {
  params: {
    uuid: string;
  };
};

const GroupsShowPage = async ({ params }: GroupsShowPageProps) => {
  const group = await getGroupDetailsById(params.uuid);

  return group ? (
    <main className="flex flex-1 flex-col gap-6 divide-y p-4 pt-6 sm:p-6 lg:p-12">
      <div>
        <h1 className="w-full text-4xl font-bold">{group.name}</h1>
        <GroupBalances group={group} className="pt-6" />
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
