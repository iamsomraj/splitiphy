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
    <main className="flex flex-1 flex-col divide-y px-4 pt-6 pb-28 sm:px-6 sm:pb-12 lg:px-12">
      <section className="flex flex-col gap-4 pb-6">
        <GroupHeader
          groupName={group.name}
          memberCount={group.groupMemberships.length}
        />
        <GroupBalances group={group} user={user} />
      </section>
      {/* Wraps instead of scrolling so no action is hidden off-screen on phones */}
      <section className="grid grid-cols-1 gap-3 py-6 sm:flex sm:flex-wrap">
        <GroupSimplifyButton group={group} />
        {group.groupUserBalances.length > 0 &&
          group.groupUserBalances.map((balance) => (
            <GroupSettleUpButton
              key={balance.uuid}
              balance={balance}
              groupUuid={group?.uuid || ''}
            />
          ))}
        <GroupMembers group={group} currentUserId={user?.id} />
      </section>
      <GroupDetailContent group={group} user={user} filters={filters} />
    </main>
  );
};

export default GroupDetailsPage;
