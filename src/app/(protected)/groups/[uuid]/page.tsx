import GroupBalances from '@/app/(protected)/groups/[uuid]/_components/group-balances';
import GroupDetailContent from '@/app/(protected)/groups/[uuid]/_components/group-detail-content';
import GroupHeader from '@/app/(protected)/groups/[uuid]/_components/group-header';
import GroupMembers from '@/app/(protected)/groups/[uuid]/_components/group-members';
import GroupSettleUpButton from '@/app/(protected)/groups/[uuid]/_components/group-settle-up-button';
import GroupSimplifyButton from '@/app/(protected)/groups/[uuid]/_components/group-simplify-button';
import { getGroupDetailsById, getLoggedInUser } from '@/db/queries';
import { ExpenseFilters } from '@/lib/expense-filters';
import paths from '@/lib/paths';
import { redirect } from 'next/navigation';

type GroupDetailsPageProps = {
  params: Promise<{
    uuid: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const GroupDetailsPage = async (props: GroupDetailsPageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const filters: ExpenseFilters = {
    q: firstValue(searchParams.q),
    category: firstValue(searchParams.category),
    from: firstValue(searchParams.from),
    to: firstValue(searchParams.to),
  };
  const [groupResult, userResult] = await Promise.allSettled([
    getGroupDetailsById(params.uuid),
    getLoggedInUser(),
  ]);

  const group = groupResult.status === 'fulfilled' ? groupResult.value : null;
  const user = userResult.status === 'fulfilled' ? userResult.value : null;

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
      <div className="scrollbar-none flex max-w-full gap-6 overflow-x-auto px-6 pt-6 sm:px-12">
        <GroupSimplifyButton group={group} />
        {group.groupUserBalances.length > 0 &&
          group.groupUserBalances.map((balance) => (
            <GroupSettleUpButton
              key={balance.uuid}
              balance={balance}
              groupUuid={group?.uuid || ''}
            />
          ))}
        <GroupMembers
          group={group}
          currentUserId={user?.id}
          className="w-full"
        />
      </div>
      <GroupDetailContent group={group} user={user} filters={filters} />
    </main>
  );
};

export default GroupDetailsPage;
