import GroupExpenseList from '@/app/(protected)/groups/[uuid]/_components/group-expense-list';
import { Button } from '@/components/ui/button';
import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import paths from '@/lib/paths';
import { Plus } from 'lucide-react';
import Link from 'next/link';

type GroupExpensesProps = {
  group: SingleGroupWithData;
  user: LoggedInUser;
};

const GroupDetailContent = ({ group, user }: GroupExpensesProps) => (
  <div className="flex flex-col gap-6 px-6 pt-6 sm:px-12">
    <div className="flex flex-col  justify-between gap-4 sm:flex-row sm:items-center">
      <span className="text-2xl font-bold">Expenses</span>
      <Link href={paths.groupAddNewExpense(group?.uuid || '')}>
        <Button className="fixed bottom-5 right-5 h-16 w-16 gap-1 rounded-full sm:static sm:h-auto sm:w-auto sm:rounded-md">
          <Plus className="h-10 w-10 sm:h-3.5 sm:w-3.5" />
          <span className="hidden sm:block">Add Expense</span>
        </Button>
      </Link>
    </div>
    {group?.groupExpenses.length === 0 ? (
      <span className="py-8 text-center text-xl font-bold text-accent-foreground/40">
        No expenses have been added yet.
      </span>
    ) : (
      <GroupExpenseList group={group} user={user} />
    )}
  </div>
);

export default GroupDetailContent;
