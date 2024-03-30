import { UserGroupsWithData } from '@/db/queries';
import paths from '@/lib/paths';
import Link from 'next/link';

type GroupItemProps = {
  group: UserGroupsWithData[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <div>
      <p>Group Name:{group.name}</p>
      <p>
        Members Count:
        {group.groupMemberships.length}
      </p>
      <Link href={paths.groupShow(group.uuid)}>View</Link>
    </div>
  );
};

export default GroupItem;
