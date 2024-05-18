import GroupBalances from '@/app/(protected)/groups/[uuid]/_components/group-balances';
import GroupDetailContent from '@/app/(protected)/groups/[uuid]/_components/group-detail-content';
import GroupHeader from '@/app/(protected)/groups/[uuid]/_components/group-header';
import GroupMembers from '@/app/(protected)/groups/[uuid]/_components/group-members';
import GroupSettleUpButton from '@/app/(protected)/groups/[uuid]/_components/group-settle-up-button';
import GroupSimplifyButton from '@/app/(protected)/groups/[uuid]/_components/group-simplify-button';
import { getGroupDetailsById, getLoggedInUser } from '@/db/queries';
import paths from '@/lib/paths';
import { redirect } from 'next/navigation';

type GroupDetailsPageProps = {
  params: {
    uuid: string;
  };
};

const GroupDetailsPage = async ({ params }: GroupDetailsPageProps) => {
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
      <div className="flex max-w-full gap-6 overflow-x-auto px-6 pt-6 scrollbar-none sm:px-12">
        <GroupSimplifyButton group={group} />
        {group.groupUserBalances.length > 0 &&
          group.groupUserBalances.map((balance) => (
            <GroupSettleUpButton
              key={balance.uuid}
              balance={balance}
              groupUuid={group?.uuid || ''}
            />
          ))}
        <GroupMembers group={group} className="w-full" />
      </div>
      <GroupDetailContent group={group} user={user} />
    </main>
  );
};

export default GroupDetailsPage;
