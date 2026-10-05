import BackButton from '@/app/(protected)/groups/[uuid]/expenses/new/_components/back-button';
import GroupExpenseForm from '@/app/(protected)/groups/[uuid]/expenses/new/_components/group-expense-form';
import PageHeader from '@/app/(protected)/groups/[uuid]/expenses/new/_components/page-header';
import { getGroupDetailsById, getLoggedInUser } from '@/db/queries';
import { currencySymbolFor } from '@/lib/utils';
import paths from '@/lib/paths';
import { redirect } from 'next/navigation';

type NewExpensePageProps = {
  params: Promise<{
    uuid: string;
  }>;
};

export default async function NewExpensePage(props: NewExpensePageProps) {
  const params = await props.params;
  const [group, user] = await Promise.all([
    getGroupDetailsById(params.uuid),
    getLoggedInUser(),
  ]);

  if (!group) {
    redirect(paths.dashboard());
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-6 pb-12 sm:px-6 lg:px-12">
      <div className="flex items-center justify-start gap-2">
        <BackButton groupUuid={group.uuid || ''} />
        <PageHeader groupName={group.name} />
      </div>
      <GroupExpenseForm
        group={group}
        currentUserId={user?.id}
        currencySymbol={currencySymbolFor(user?.currency)}
      />
    </main>
  );
}
