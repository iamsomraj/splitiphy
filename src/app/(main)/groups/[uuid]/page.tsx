import GroupExpenseForm from '@/components/groups/group-expense-form';
import GroupExpenses from '@/components/groups/group-expenses';
import GroupMembers from '@/components/groups/group-members';
import GroupSettleForm from '@/components/groups/group-settle-form';
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

  return group ? (
    <div className="flex flex-col gap-y-4">
      <Link href={paths.groups()}>Back to Groups</Link>
      <h1>Group Name: {group.name}</h1>
      <GroupUserSearchForm groupUuid={params.uuid} />
      <GroupMembers group={group} />
      <GroupExpenses group={group} />
      <GroupSettleForm group={group} />
      <GroupExpenseForm group={group} />
    </div>
  ) : null;
};

export default GroupsShowPage;
