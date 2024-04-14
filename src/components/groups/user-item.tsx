'use client';

import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
import { UserSearchResult } from '@/db/queries';
import { useTransition } from 'react';

type UserItemProps = {
  user: UserSearchResult[0];
  groupUuid: string;
};

const UserItem = ({ user, groupUuid }: UserItemProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      await actions.addUserToGroup(user, groupUuid);
    });
  };

  return (
    <div
      key={user.id}
      className="flex items-center justify-between rounded-md border bg-muted/40 p-6 hover:bg-muted/20"
    >
      <p className="text-lg font-bold">
        {user.firstName + ' ' + user.lastName}
      </p>
      <Button disabled={isPending} onClick={onClick}>
        {isPending ? 'Adding...' : 'Add user'}
      </Button>
    </div>
  );
};

export default UserItem;
