import GroupCreateForm from '@/components/groups/group-create-form';
import GroupItem from '@/components/groups/group-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserGroups } from '@/db/queries';
import paths from '@/lib/paths';
import Link from 'next/link';

const GroupsPage = async () => {
  const groups = await getUserGroups();
  return (
    <main className="grid w-full flex-1 grid-cols-4 gap-6 p-4 sm:p-6 lg:p-12">
      <GroupCreateForm className="col-span-4 sm:col-span-2" />
      <Card className="col-span-1 bg-muted/40">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-2xl font-bold">$45,231.89</div>
          <p className="mt-4 text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-1 bg-muted/40">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="mt-2 text-2xl font-bold">$45,231.89</div>
          <p className="mt-4 text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <div className="col-span-2 flex flex-col gap-y-4">
        {groups.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
      </div>
    </main>
  );
};

export default GroupsPage;
