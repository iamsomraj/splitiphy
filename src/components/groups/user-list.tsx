import UserItem from '@/components/groups/user-item';
import type { UserSearchResult } from '@/db/queries';

interface UserListProps {
  fetchData: () => Promise<UserSearchResult>;
  groupUuid: string;
}

const UserList = async ({ fetchData, groupUuid }: UserListProps) => {
  const users = await fetchData();
  return (
    <div className="flex flex-col gap-y-4">
      {users.map((user) => (
        <UserItem key={user.id} user={user} groupUuid={groupUuid} />
      ))}
    </div>
  );
};

export default UserList;
