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

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div>
      <Link href={paths.groups()}>Back to Groups</Link>
      <h1>Group Name: {group.name}</h1>
      <GroupUserSearchForm groupUuid={params.uuid} />
      <div>
        <h2>Members</h2>
        <ul className='flex flex-col gap-y-4'>
          {group.groupMemberships.map((member) => (
            <li key={member.uuid}>
              <div>@{member.user.username}</div>
              <div>{member.user.firstName + ' ' + member.user.lastName}</div>
              <div>{member.user.email}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupsShowPage;
