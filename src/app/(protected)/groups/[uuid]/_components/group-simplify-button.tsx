'use client';

import * as actions from '@/actions';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SingleGroupWithData } from '@/db/queries';
import { cn } from '@/lib/utils';
import { Divide } from 'lucide-react';
import { useTransition } from 'react';

type GroupMembersProps = {
  group: SingleGroupWithData;
} & ButtonProps;

const GroupSimplifyButton = ({
  group,
  className,
  ...rest
}: GroupMembersProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const disabled = isPending || group?.groupExpenses.length === 0;

  const onClick = () => {
    startTransition(async () => {
      const response = await actions.simplifyGroupExpenses(group?.uuid || '');
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
      <Divide className="mr-2 h-3.5 w-3.5" />
      {isPending ? 'Simplifying...' : 'Simplify'}
    </Button>
  ) : null;
};

export default GroupSimplifyButton;
