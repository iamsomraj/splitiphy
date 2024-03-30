import GroupCreateForm from '@/components/groups/group-create-form';
import GroupItem from '@/components/groups/group-item';
import { getUserGroups } from '@/db/queries/get-user-groups';

const GroupsPage = async () => {
  const groups = await getUserGroups();
  return (
    <div>
      <p>Create Group</p>
      <GroupCreateForm />
      <h1>Your Groups</h1>
      <div className='flex flex-col gap-y-4'>
        {groups.map((group) => (
          <GroupItem
            key={group.id}
            group={group}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupsPage;
