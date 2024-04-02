import { GroupWithData } from '@/db/queries';
import SettleUpButton from './settle-up-button';

type GroupBalancesProps = {
  group: GroupWithData;
};

const GroupBalances = ({ group }: GroupBalancesProps) => {
  return group ? (
    <div>
      <h2>Group Balances</h2>
      <ul className="flex flex-col">
        {group.groupUserBalances.map((balance) => (
          <li key={balance.uuid}>
            {balance.sender.firstName} {balance.sender.lastName} owes{' '}
            {balance.recipient.firstName} {balance.recipient.lastName}{' '}
            {balance.amount}
            <SettleUpButton
              groupUuid={group?.uuid || ''}
              balanceUuid={balance?.uuid || ''}
            ></SettleUpButton>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default GroupBalances;
