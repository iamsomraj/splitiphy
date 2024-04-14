import GroupCreateForm from '@/components/groups/group-create-form';
import GroupItem from '@/components/groups/group-item';
import { getUserGroups } from '@/db/queries';

export default async function DashboardPage() {
  const groups = await getUserGroups();
  return (
    <main className="grid w-full flex-1 grid-cols-4 gap-6 p-4 sm:p-6 lg:p-12">
      <div className="col-span-4 sm:col-span-2">
        <div className="static top-[7rem] z-10 grid grid-cols-2 gap-6 sm:sticky ">
          <GroupCreateForm className="col-span-2 " />
        </div>
      </div>
      {groups.length > 0 && (
        <div className="col-span-4 overflow-y-auto sm:col-span-2">
          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <GroupItem key={group.id} group={group} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
