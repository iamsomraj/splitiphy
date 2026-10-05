import GroupCreateForm from '@/app/(protected)/dashboard/_components/group-create-form';
import GroupList from '@/app/(protected)/dashboard/_components/group-list';
import { getMyGroups } from '@/db/queries';
import { getMyYearlyExpenses } from '@/db/queries/get-my-yearly-expenses';
import GroupExpensesCharts from './_components/group-expenses-charts';

export default async function DashboardPage() {
  const groups = await getMyGroups();
  const yearlyExpenses = await getMyYearlyExpenses();

  return (
    <main className="grid w-full flex-1 grid-cols-1 items-start gap-6 px-4 pt-6 pb-12 sm:px-6 lg:grid-cols-2 lg:px-12">
      <div className="min-w-0">
        <div className="grid grid-cols-2 gap-6 lg:sticky lg:top-24">
          <GroupCreateForm className="col-span-2" />
          <GroupExpensesCharts
            className="col-span-2"
            expenses={yearlyExpenses}
          />
        </div>
      </div>
      {groups.length > 0 ? <GroupList groups={groups} /> : null}
    </main>
  );
}
