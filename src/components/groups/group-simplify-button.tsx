'use client';

import * as actions from '@/actions';
import { Button, ButtonProps } from '@/components/ui/button';
import { GroupWithData } from '@/db/queries';
import { cn } from '@/lib/utils';

type GroupMembersProps = {
  group: GroupWithData;
} & ButtonProps;

const GroupSimplifyButton = ({
  group,
  className,
  ...rest
}: GroupMembersProps) => {
  return group && group.uuid ? (
    <Button
      variant={'secondary'}
      disabled={group.groupExpenses.length === 0}
      className={cn(className)}
      onClick={async () => actions.simplifyGroupExpenses(group?.uuid || '')}
      {...rest}
    >
      Simplify Expenses
    </Button>
  ) : null;
};

export default GroupSimplifyButton;
