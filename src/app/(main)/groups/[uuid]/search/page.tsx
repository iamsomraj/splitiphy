import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import UserList from '@/components/groups/user-list';
import { Button } from '@/components/ui/button';
import { getGroupDetailsById, getUsersBySearchTerm } from '@/db/queries';
import paths from '@/lib/paths';
import { ChevronLeft } from 'lucide-react';
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
    <main className="flex flex-1 flex-col gap-6 p-4 pb-8 pt-6 sm:p-6 lg:p-12 lg:pb-16">
      <Link href={paths.groupShow(group?.uuid || '')}>
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      </Link>{' '}
      <GroupUserSearchForm group={group} />
      <UserList
        fetchData={() => getUsersBySearchTerm(searchParams.term, params.uuid)}
        groupUuid={params.uuid}
      />
    </main>
  );
};

export default GroupUserSearchPage;
