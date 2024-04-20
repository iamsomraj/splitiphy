import GroupExpenseForm from '@/components/groups/group-expense-form';
import { Button } from '@/components/ui/button';
import { getGroupDetailsById } from '@/db/queries';
import paths from '@/lib/paths';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type NewExpensePageProps = {
  params: {
    uuid: string;
  };
};

const BackButton = ({ groupUuid }: { groupUuid: string }) => (
  <Link href={paths.groupShow(groupUuid)}>
    <Button variant="outline" size="icon" className="h-7 w-7">
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
  </Link>
);

const ExpenseHeader = ({ groupName }: { groupName: string }) => (
  <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
    New Expense for {groupName}
  </h1>
);

export default async function NewExpensePage({ params }: NewExpensePageProps) {
  const group = await getGroupDetailsById(params.uuid);
  if (!group) return null;

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 pb-8 pt-6 sm:p-6 lg:p-12 lg:pb-16">
      <div className="flex items-center justify-start gap-2">
        <BackButton groupUuid={group.uuid || ''} />
        <ExpenseHeader groupName={group.name} />
      </div>
      <GroupExpenseForm group={group} />
    </main>
  );
}
