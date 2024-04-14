import UserItem from '@/components/groups/user-item';
import type { UserSearchResult } from '@/db/queries';

interface UserListProps {
  fetchData: () => Promise<UserSearchResult>;
  groupUuid: string;
}

const UserList = async ({ fetchData, groupUuid }: UserListProps) => {
  const users = await fetchData();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserItem key={user.id} user={user} groupUuid={groupUuid} />
      ))}
    </div>
  );
};

export default UserList;
