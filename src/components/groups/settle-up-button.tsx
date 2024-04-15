'use client';

import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { groupUserBalances, users } from '@/db/schema';
import { useTransition } from 'react';

type SettleUpButtonProps = {
  groupUuid: string;
  balance: typeof groupUserBalances.$inferSelect & {
    sender: typeof users.$inferSelect;
  } & {
    recipient: typeof users.$inferSelect;
  };
};

const SettleUpButton = ({ groupUuid, balance }: SettleUpButtonProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(async () => {
      const { state } = await actions.settleBalance(
        groupUuid,
        balance?.uuid || '',
      );
      if (!state) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'An error occurred while settling the balance.',
        });
      }
    });
  };

  return balance.uuid && groupUuid ? (
    <Button variant={'outline'} disabled={isPending} onClick={onClick}>
      {isPending ? (
        'Settling Up...'
      ) : (
        <span>
          Settle Up {balance.sender.firstName} & {balance.recipient.firstName}
        </span>
      )}
    </Button>
  ) : null;
};

export default SettleUpButton;
