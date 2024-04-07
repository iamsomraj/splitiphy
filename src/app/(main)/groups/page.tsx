import GroupCreateForm from '@/components/groups/group-create-form';
import GroupItem from '@/components/groups/group-item';
import { getUserGroups } from '@/db/queries';
import paths from '@/lib/paths';
import Link from 'next/link';

const GroupsPage = async () => {
  const groups = await getUserGroups();
  return (
    <main className="grid w-full flex-1 grid-cols-2 gap-6 p-12">
      <GroupCreateForm />
      <div className="col-span-2 flex flex-col gap-y-4">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
      </div>
    </main>
  );
};

export default GroupsPage;
