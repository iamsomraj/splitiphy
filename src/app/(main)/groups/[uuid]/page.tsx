import GroupUserSearchForm from '@/components/groups/group-user-search-form';
import paths from '@/lib/paths';
import Link from 'next/link';

type GroupsShowPageProps = {
  params: {
    uuid: string;
  };
};

const GroupsShowPage = ({ params }: GroupsShowPageProps) => {
  return (
    <div>
      <Link href={paths.groups()}>Back to Groups</Link>
      <h1>GroupsShowPage</h1>
      <GroupUserSearchForm groupUuid={params.uuid} />
    </div>
  );
};

export default GroupsShowPage;
