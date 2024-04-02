'use client';

import { Button } from '@/components/ui/button';
import * as actions from '@/actions';

type SettleUpButtonProps = {
  groupUuid: string;
  balanceUuid: string;
};

const SettleUpButton = ({ groupUuid, balanceUuid }: SettleUpButtonProps) => {
  return balanceUuid && groupUuid ? (
    <Button
      variant={'secondary'}
      onClick={async () => {
        await actions.settleBalance(groupUuid, balanceUuid);
      }}
    >
      Settle
    </Button>
  ) : null;
};

export default SettleUpButton;
