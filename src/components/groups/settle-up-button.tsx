'use client';

import { Button } from '@/components/ui/button';
import * as actions from '@/actions';
import { groupUserBalances, users } from '@/db/schema';

type SettleUpButtonProps = {
  groupUuid: string;
  balance: typeof groupUserBalances.$inferSelect & {
    sender: typeof users.$inferSelect;
  } & {
    recipient: typeof users.$inferSelect;
  };
};

const SettleUpButton = ({ groupUuid, balance }: SettleUpButtonProps) => {
  return balance.uuid && groupUuid ? (
    <Button
      variant={'secondary'}
      onClick={async () => {
        await actions.settleBalance(groupUuid, balance?.uuid || '');
      }}
    >
      Settle Up {balance.sender.firstName} & {balance.recipient.firstName}
    </Button>
  ) : null;
};

export default SettleUpButton;
