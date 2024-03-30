import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import UserList from '@/components/groups/user-list';
import { getUsersBySearchTerm } from '@/db/queries';
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

const GroupUserSearchPage = ({ params, searchParams }: GroupUserSearchPageProps) => {
  return (
    <div>
      <Link href={paths.groups()}>Back to Groups</Link>
      <h1>GroupUserSearchPage</h1>
      <GroupUserSearchForm groupUuid={params.uuid} />
      <UserList
        fetchData={() => getUsersBySearchTerm(searchParams.term)}
        groupUuid={params.uuid}
      />
    </div>
  );
};

export default GroupUserSearchPage;
