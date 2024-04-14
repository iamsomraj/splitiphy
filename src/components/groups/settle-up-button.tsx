'use client';

import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
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
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(async () => {
      await actions.settleBalance(groupUuid, balance?.uuid || '');
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
