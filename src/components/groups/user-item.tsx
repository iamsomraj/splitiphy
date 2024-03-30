'use client';

import { UserSearchResult } from '@/db/queries';
import * as actions from '@/actions';

type UserItemProps = {
  user: UserSearchResult[0];
  groupUuid: string;
};

const UserItem = ({ user, groupUuid }: UserItemProps) => {
  return (
    <div key={user.id}>
      <p>{user.name}</p>
      <button
        onClick={async () => {
          await actions.addUserToGroup(user.id, groupUuid);
        }}
      >
        Add to Group
      </button>
    </div>
  );
};

export default UserItem;
