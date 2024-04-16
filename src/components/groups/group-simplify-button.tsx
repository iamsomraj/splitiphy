'use client';

import * as actions from '@/actions';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const allExpensesSimplified = group?.groupExpenses?.every(
    (expense) => expense.isExpenseSimplified,
  );
  const disabled =
    isPending || allExpensesSimplified || group?.groupExpenses.length === 0;

  const onClick = () => {
    startTransition(async () => {
      const response = await actions.simplifyGroupExpenses(group?.uuid || '');
      /**
       * Default value for state is true, so if the state is false, it means there was an error.
       * In that case, we show the error message.
       */
      const state = response?.state || true;
      const title =
        response?.title || 'Great! Your expenses have been simplified.';
      const description =
        response?.message || `Expenses simplified for group ${group?.name}.`;
      if (!state) {
        toast({
          title,
          description,
        });
      } else {
        toast({
          title,
          description,
        });
      }
    });
  };
  return group && group.uuid ? (
    <Button
      variant={'secondary'}
      disabled={disabled}
      className={cn(className)}
      onClick={onClick}
      {...rest}
    >
      {isPending ? 'Simplifying...' : 'Simplify Group Expenses'}
    </Button>
  ) : null;
};

export default GroupSimplifyButton;
