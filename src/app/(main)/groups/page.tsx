import { getGroups } from '@/db/queries/get-groups';

const GroupsPage = async () => {
  const groups = await getGroups();
  return (
    <div>
      <p>Groups Page</p>
      <div>{JSON.stringify(groups, null, 2)}</div>
    </div>
  );
};

export default GroupsPage;
