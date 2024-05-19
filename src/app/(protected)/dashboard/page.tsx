import GroupCreateForm from '@/app/(protected)/dashboard/_components/group-create-form';
import GroupList from '@/app/(protected)/dashboard/_components/group-list';
import { getMyGroups } from '@/db/queries';
import { getMyExpenses } from '@/db/queries/get-my-expenses';
import GroupExpensesCharts from './_components/group-expenses-charts';

export default async function DashboardPage() {
  const groups = await getMyGroups();
  const expenses = await getMyExpenses();

  return (
    <main className="grid w-full flex-1 grid-cols-4 gap-6 p-4 sm:p-6 lg:p-12">
      <div className="col-span-4 sm:col-span-2">
        <div className="static top-[7rem] z-10 grid grid-cols-2 gap-6 sm:sticky ">
          <GroupCreateForm className="col-span-2" />
          <GroupExpensesCharts className="col-span-2" expenses={expenses} />
        </div>
      </div>
      {groups.length > 0 ? <GroupList groups={groups} /> : null}
    </main>
  );
}
