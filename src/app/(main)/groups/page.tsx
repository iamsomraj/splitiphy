import { getUserGroups } from '@/db/queries/get-user-groups';

const GroupsPage = async () => {
  const groups = await getUserGroups();
  return (
    <div>
      <p>Groups Page</p>
      <div>{JSON.stringify(groups, null, 2)}</div>
    </div>
  );
};

export default GroupsPage;
