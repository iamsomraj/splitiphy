'use client';

import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
import { UserSearchResult } from '@/db/queries';

type UserItemProps = {
  user: UserSearchResult[0];
  groupUuid: string;
};

const UserItem = ({ user, groupUuid }: UserItemProps) => {
  return (
    <div
      key={user.id}
      className="flex items-center justify-between rounded-md border bg-muted/40 p-6 hover:bg-muted/20"
    >
      <p className="text-lg font-bold">
        {user.firstName + ' ' + user.lastName}
      </p>
      <Button
        onClick={async () => {
          await actions.addUserToGroup(user, groupUuid);
        }}
      >
        Add to Group
      </Button>
    </div>
  );
};

export default UserItem;
