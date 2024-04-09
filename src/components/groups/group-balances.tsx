import SettleUpButton from '@/components/groups/settle-up-button';
import { GroupWithData } from '@/db/queries';
import { cn } from '@/lib/utils';

type GroupBalancesProps = {
  group: GroupWithData;
} & React.HTMLAttributes<HTMLDivElement>;

const GroupBalances = ({ group, className, ...rest }: GroupBalancesProps) => {
  return group ? (
    <div className={cn(className)} {...rest}>
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
