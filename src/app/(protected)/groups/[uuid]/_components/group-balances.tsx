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
        <h2 className="w-full text-lg font-semibold text-accent-foreground/40 sm:text-2xl">
          No simplified balances to display.
        </h2>
      ) : (
        <ul className="flex flex-col gap-2">
          {group.groupUserBalances.map((balance) => (
            <li
              key={balance.uuid}
              className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 rounded-md border bg-muted/40 px-3 py-2 text-sm font-medium"
            >
              <span>
                {balance.sender.firstName} {balance.sender.lastName}{' '}
                <span className="text-muted-foreground">owes</span>{' '}
                {balance.recipient.firstName} {balance.recipient.lastName}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {currencySymbol}
                {balance.amount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupBalances;
