import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import constants from '@/lib/constants';
import { cn } from '@/lib/utils';

type GroupBalancesProps = {
  group: SingleGroupWithData;
  user: LoggedInUser;
} & React.HTMLAttributes<HTMLDivElement>;

const GroupBalances = ({
  group,
  user,
  className,
  ...rest
}: GroupBalancesProps) => {
  if (!group || !user) return null;

  const currencyCode = user.currency;
  const currencySymbol =
    constants.currenciesCodeSymbolMap[
      currencyCode as keyof typeof constants.currenciesCodeSymbolMap
    ];

  return (
    <div className={cn(className)} {...rest}>
      {group.groupUserBalances.length === 0 ? (
        <h2 className="w-full text-2xl font-bold text-accent-foreground/40 ">
          No simplified balances to display.
        </h2>
      ) : (
        <ul className="flex flex-col gap-4">
          {group.groupUserBalances.map((balance) => (
            <li
              key={balance.uuid}
              className="flex items-center text-xs font-medium sm:text-sm"
            >
              {balance.sender.firstName} {balance.sender.lastName} owes{' '}
              {balance.recipient.firstName} {balance.recipient.lastName}{' '}
              <span className="ml-1.5 mr-0.5">{currencySymbol}</span>
              {balance.amount} {' in total'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupBalances;
