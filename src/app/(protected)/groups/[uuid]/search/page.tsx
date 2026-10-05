import BackButton from '@/app/(protected)/groups/[uuid]/search/_components/back-button';
import GroupUserSearchForm from '@/app/(protected)/groups/[uuid]/search/_components/group-user-search-form';
import PageHeader from '@/app/(protected)/groups/[uuid]/search/_components/page-header';
import UserList from '@/app/(protected)/groups/[uuid]/search/_components/user-list';
import { getGroupDetailsById, getUsersBySearchTerm } from '@/db/queries';
import paths from '@/lib/paths';
import { redirect } from 'next/navigation';

type GroupUserSearchPageProps = {
  params: Promise<{
    uuid: string;
  }>;
  searchParams: Promise<{
    term: string;
  }>;
};

const GroupUserSearchPage = async (props: GroupUserSearchPageProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const group = await getGroupDetailsById(params.uuid);

  if (!group) {
    redirect(paths.dashboard());
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-6 pb-12 sm:px-6 lg:px-12">
      <div className="flex items-center justify-start gap-4">
        <BackButton groupUuid={group?.uuid || ''} />
        <PageHeader groupName={group?.name || ''} />
      </div>
      <GroupUserSearchForm group={group} />
      <UserList
        fetchData={() => getUsersBySearchTerm(searchParams.term, params.uuid)}
        groupUuid={params.uuid}
      />
    </main>
  );
};

export default GroupUserSearchPage;
