import GroupExpenseForm from '@/components/groups/group-expense-form';
import { getGroupDetailsById } from '@/db/queries';

type NewExpensePageProps = {
  params: {
    uuid: string;
  };
};

export default async function NewExpensePage({ params }: NewExpensePageProps) {
  const group = await getGroupDetailsById(params.uuid);
  return <GroupExpenseForm group={group} />;
}
