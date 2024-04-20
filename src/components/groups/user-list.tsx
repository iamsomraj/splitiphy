import UserItem from '@/components/groups/user-item';
import type { UserListWithData } from '@/db/queries';

interface UserListProps {
  fetchData: () => Promise<UserListWithData>;
  groupUuid: string;
}

const UserList = async ({ fetchData, groupUuid }: UserListProps) => {
  const users = await fetchData();
  return users.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserItem key={user.id} user={user} groupUuid={groupUuid} />
      ))}
    </div>
  ) : (
    <div className="flex items-center justify-center py-6">
      <span className="w-56 text-center text-2xl font-bold text-accent-foreground/40">
        No users found.
      </span>
    </div>
  );
};

export default UserList;
