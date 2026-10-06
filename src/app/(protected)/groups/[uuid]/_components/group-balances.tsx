import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import {
  cn,
  currencySymbolFor,
  formatMoney,
  initials,
  shortName,
} from '@/lib/utils';

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

  const currencySymbol = currencySymbolFor(user.currency);
  const balances = group.groupUserBalances;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border bg-card text-card-foreground sm:max-w-xl',
        className,
      )}
      {...rest}
    >
      <header className="flex items-center justify-between px-4 py-3 sm:px-5">
        <h2 className="font-semibold">Balances</h2>
        {balances.length > 0 && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            Simplified
          </span>
        )}
      </header>
      {balances.length === 0 ? (
        <p className="border-t px-4 py-4 text-sm text-muted-foreground sm:px-5">
          Everyone is settled up. Add an expense or simplify to see who owes
          whom.
        </p>
      ) : (
        <ul>
          {balances.map((balance) => {
            const youOwe = balance.senderId === user.id;
            const owedToYou = balance.recipientId === user.id;
            return (
              <li
                key={balance.uuid}
                className="flex items-center gap-3 border-t px-4 py-3 sm:px-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {initials(balance.sender)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-semibold">
                    {shortName(balance.sender, user.id)}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {youOwe ? 'owe' : 'owes'}
                  </span>{' '}
                  <span className="font-semibold">
                    {shortName(balance.recipient, user.id)}
                  </span>
                </span>
                <span
                  className={cn(
                    'font-semibold whitespace-nowrap',
                    youOwe && 'text-destructive',
                    owedToYou && 'text-primary',
                    !youOwe && !owedToYou && 'text-muted-foreground',
                  )}
                >
                  {youOwe ? '− ' : owedToYou ? '+ ' : ''}
                  {formatMoney(currencySymbol, balance.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GroupBalances;
