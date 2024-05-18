import BackButton from '@/app/(protected)/groups/[uuid]/expenses/new/_components/back-button';
import GroupExpenseForm from '@/app/(protected)/groups/[uuid]/expenses/new/_components/group-expense-form';
import PageHeader from '@/app/(protected)/groups/[uuid]/expenses/new/_components/page-header';
import { getGroupDetailsById } from '@/db/queries';
import paths from '@/lib/paths';
import { redirect } from 'next/navigation';

type NewExpensePageProps = {
  params: {
    uuid: string;
  };
};

export default async function NewExpensePage({ params }: NewExpensePageProps) {
  const group = await getGroupDetailsById(params.uuid);

  if (!group) {
    redirect(paths.dashboard());
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 pb-8 pt-6 sm:p-6 lg:p-12 lg:pb-16">
      <div className="flex items-center justify-start gap-2">
        <BackButton groupUuid={group.uuid || ''} />
        <PageHeader groupName={group.name} />
      </div>
      <GroupExpenseForm group={group} />
    </main>
  );
}
