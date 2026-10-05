import GroupExpenseFilters from '@/app/(protected)/groups/[uuid]/_components/group-expense-filters';
import GroupExpenseList from '@/app/(protected)/groups/[uuid]/_components/group-expense-list';
import { Button } from '@/components/ui/button';
import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import {
  ExpenseFilters,
  filterGroupExpenses,
  hasActiveFilters,
} from '@/lib/expense-filters';
import paths from '@/lib/paths';
import { Download, Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

type GroupExpensesProps = {
  group: SingleGroupWithData;
  user: LoggedInUser;
  filters: ExpenseFilters;
};

const GroupDetailContent = ({ group, user, filters }: GroupExpensesProps) => {
  const allExpenses = group?.groupExpenses || [];
  const filteredExpenses = filterGroupExpenses(allExpenses, filters);

  return (
    <section className="flex flex-col gap-6 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <div className="flex items-center gap-2">
          {allExpenses.length > 0 && (
            <Button variant="outline" className="gap-1" asChild>
              {/* Plain anchor: the route streams a file download */}
              <a href={paths.groupExportCsv(group?.uuid || '')} download>
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </a>
            </Button>
          )}
          <Link href={paths.groupAddNewExpense(group?.uuid || '')}>
            <Button className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 h-14 w-14 gap-1 rounded-full shadow-lg sm:static sm:h-auto sm:w-auto sm:rounded-md sm:shadow-none">
              <Plus className="h-7 w-7 sm:h-3.5 sm:w-3.5" />
              <span className="sr-only sm:hidden">Add Expense</span>
              <span className="hidden sm:block">Add Expense</span>
            </Button>
          </Link>
        </div>
      </div>
      {allExpenses.length === 0 ? (
        <span className="py-8 text-center text-xl font-bold text-accent-foreground/40">
          No expenses have been added yet.
        </span>
      ) : (
        <>
          <Suspense>
            <GroupExpenseFilters />
          </Suspense>
          {filteredExpenses.length === 0 ? (
            <span className="py-8 text-center text-xl font-bold text-accent-foreground/40">
              No expenses match your filters.
            </span>
          ) : (
            <GroupExpenseList
              group={group}
              groupExpenses={filteredExpenses}
              user={user}
              isFiltered={hasActiveFilters(filters)}
            />
          )}
        </>
      )}
    </section>
  );
};

export default GroupDetailContent;
