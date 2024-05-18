import GroupItem from '@/app/(protected)/dashboard/_components/group-item';
import { ManyGroupsWithData } from '@/db/queries';

type GroupListProps = {
  groups: ManyGroupsWithData;
};

function GroupList({ groups }: GroupListProps) {
  return (
    <div className="col-span-4 overflow-y-auto sm:col-span-2">
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}

export default GroupList;
