import SettleUpButton from '@/components/groups/settle-up-button';
import { GroupWithData } from '@/db/queries';
import { cn } from '@/lib/utils';

type GroupBalancesProps = {
  group: GroupWithData;
} & React.HTMLAttributes<HTMLDivElement>;

const GroupBalances = ({ group, className, ...rest }: GroupBalancesProps) => {
  return group ? (
    <div className={cn(className)} {...rest}>
      {group.groupUserBalances.length === 0 ? (
        <h2 className="w-full text-2xl font-bold text-accent-foreground/40 ">
          No simplified balances to display
        </h2>
      ) : (
        <ul className="flex flex-col gap-4">
          {group.groupUserBalances.map((balance) => (
            <li
              key={balance.uuid}
              className="flex items-center gap-2 text-xs font-medium sm:text-sm"
            >
              {balance.sender.firstName} {balance.sender.lastName} owes{' '}
              {balance.recipient.firstName} {balance.recipient.lastName}{' '}
              {balance.amount} {' in total'}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : null;
};

export default GroupBalances;
