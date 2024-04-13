import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import UserList from '@/components/groups/user-list';
import { getGroupDetailsById, getUsersBySearchTerm } from '@/db/queries';
import paths from '@/lib/paths';
import Link from 'next/link';

type GroupUserSearchPageProps = {
  params: {
    uuid: string;
  };
  searchParams: {
    term: string;
  };
};

const GroupUserSearchPage = async ({
  params,
  searchParams,
}: GroupUserSearchPageProps) => {
  const group = await getGroupDetailsById(params.uuid);
  return (
    <div>
      <Link href={paths.dashboard()}>Back to Groups</Link>
      <h1>GroupUserSearchPage</h1>
      <GroupUserSearchForm group={group} />
      <UserList
        fetchData={() => getUsersBySearchTerm(searchParams.term, params.uuid)}
        groupUuid={params.uuid}
      />
    </div>
  );
};

export default GroupUserSearchPage;
