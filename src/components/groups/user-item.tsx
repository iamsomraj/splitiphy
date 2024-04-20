'use client';

import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UserListWithData } from '@/db/queries';
import { useTransition } from 'react';

type UserItemProps = {
  user: UserListWithData[0];
  groupUuid: string;
};

const UserItem = ({ user, groupUuid }: UserItemProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const { state } = await actions.addUserToGroup(user, groupUuid);
      if (!state) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'An error occurred while adding the user to the group.',
        });
      }
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
