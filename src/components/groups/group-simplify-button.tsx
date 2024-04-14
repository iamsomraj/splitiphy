'use client';

import * as actions from '@/actions';
import { Button, ButtonProps } from '@/components/ui/button';
import { GroupWithData } from '@/db/queries';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';

type GroupMembersProps = {
  group: GroupWithData;
} & ButtonProps;

const GroupSimplifyButton = ({
  group,
  className,
  ...rest
}: GroupMembersProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      await actions.simplifyGroupExpenses(group?.uuid || '');
    });
  };
  return group && group.uuid ? (
    <Button
      variant={'secondary'}
      disabled={isPending || group.groupExpenses.length === 0}
      className={cn(className)}
      onClick={onClick}
      {...rest}
    >
      {isPending ? 'Simplifying...' : 'Simplify Group Expenses'}
    </Button>
  ) : null;
};

export default GroupSimplifyButton;
