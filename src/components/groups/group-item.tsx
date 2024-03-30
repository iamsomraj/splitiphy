import { GetUserGroups } from '@/db/queries/get-user-groups';

type GroupItemProps = {
  group: GetUserGroups[0];
};

const GroupItem = ({ group }: GroupItemProps) => {
  return (
    <div>
      <p>Group Name:{group.name}</p>
      <p>
        Members Count:
        {group.groupMemberships.length}
      </p>
    </div>
  );
};

export default GroupItem;
