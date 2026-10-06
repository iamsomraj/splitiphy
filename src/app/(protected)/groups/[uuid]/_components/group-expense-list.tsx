'use client';

import * as actions from '@/actions';
import { ExpenseCategoryIcon } from '@/components/shared/expense-category-icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import constants from '@/lib/constants';
import { getExpenseSummary } from '@/lib/expense-summary';
import paths from '@/lib/paths';
import {
  cn,
  currencySymbolFor,
  formatMoney,
  formatNumber,
  initials,
  shortName,
} from '@/lib/utils';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { ChevronDown, Handshake } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

type GroupExpense = NonNullable<SingleGroupWithData>['groupExpenses'][number];

type GroupExpenseListProps = {
  group: SingleGroupWithData;
  groupExpenses: GroupExpense[];
  user: LoggedInUser;
  isFiltered?: boolean;
};

type ExpenseActionsMenuProps = {
  groupUuid: string;
  groupExpense: GroupExpense;
  onDelete: (groupUuid: string, groupExpenseUuid: string) => void;
};

const ExpenseActionsMenu = ({
  groupUuid,
  groupExpense,
  onDelete,
}: ExpenseActionsMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <DotsVerticalIcon className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {!groupExpense.isSystemGenerated && (
        <DropdownMenuItem asChild>
          <Link href={paths.groupEditExpense(groupUuid, groupExpense.uuid)}>
            Edit
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={() => onDelete(groupUuid, groupExpense.uuid || '')}
      >
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const spendingOf = (expenses: GroupExpense[]) =>
  formatNumber(
    expenses.reduce(
      (sum, groupExpense) =>
        groupExpense.isSystemGenerated
          ? sum
          : sum + formatNumber(groupExpense.expense.amount),
      0,
    ),
  );

/** Newest first, bucketed by calendar month */
const groupByMonth = (expenses: GroupExpense[]) => {
  const months = new Map<string, GroupExpense[]>();
  [...expenses]
    .sort((a, b) => b.expense.date.getTime() - a.expense.date.getTime())
    .forEach((groupExpense) => {
      const key = format(groupExpense.expense.date, 'MMMM yyyy');
      months.set(key, [...(months.get(key) || []), groupExpense]);
    });
  return [...months.entries()];
};

type ExpenseRowProps = {
  groupExpense: GroupExpense;
  viewerId: string;
  currencySymbol: string;
};

const ExpenseRow = ({
  groupExpense,
  viewerId,
  currencySymbol,
}: ExpenseRowProps) => {
  const { expense } = groupExpense;
  const money = (value: number | string) => formatMoney(currencySymbol, value);
  const summary = getExpenseSummary(groupExpense, viewerId);
  const date = format(expense.date, 'd MMM');
  const categoryName =
    constants.expensesCategories.find(
      (category) => category.key === expense.category,
    )?.name || 'Other';

  if (groupExpense.isSystemGenerated) {
    const settlement = expense.transactions[0];
    const viewerPaid = settlement?.payerId === viewerId;
    const viewerReceived = settlement?.receiverId === viewerId;
    return (
      <div className="flex items-center gap-3 py-4 pr-12 pl-4 sm:pl-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Handshake className="h-5 w-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-semibold">
            {settlement
              ? `${shortName(settlement.payer, viewerId)} paid ${shortName(settlement.receiver, viewerId)}`
              : expense.name}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {date} · Settlement
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span className="text-xs text-muted-foreground">
            {viewerPaid ? 'you paid' : viewerReceived ? 'you got' : 'settled'}
          </span>
          <span className="font-semibold text-primary">
            {money(expense.amount)}
          </span>
        </div>
      </div>
    );
  }

  const paidBy =
    summary.payers.length === 1
      ? `${shortName(summary.payers[0].user, viewerId)} paid`
      : `${summary.payers.length} people paid`;

  const position = !summary.involved
    ? {
        label: 'not involved',
        amount: null,
        className: 'text-muted-foreground',
      }
    : summary.net > 0
      ? {
          label: 'you lent',
          amount: `+ ${money(summary.net)}`,
          className: 'text-primary',
        }
      : summary.net < 0
        ? {
            label: 'you borrowed',
            amount: `− ${money(-summary.net)}`,
            className: 'text-destructive',
          }
        : {
            label: 'all square',
            amount: money(0),
            className: 'text-muted-foreground',
          };

  return (
    <details className="group/expense">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 pr-12 pl-4 transition-colors select-none hover:bg-muted/40 sm:pl-5 [&::-webkit-details-marker]:hidden">
        <span className="hidden w-10 shrink-0 flex-col items-center leading-none sm:flex">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
            {format(expense.date, 'MMM')}
          </span>
          <span className="text-lg font-bold">
            {format(expense.date, 'dd')}
          </span>
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ExpenseCategoryIcon
            icon={
              constants.expenseCategoryKeyIconMap[
                (expense.category as keyof typeof constants.expenseCategoryKeyIconMap) ||
                  'other'
              ]
            }
            className="mr-0 h-5 w-5"
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-semibold">{expense.name}</span>
          <span className="truncate text-sm text-muted-foreground">
            {paidBy} {money(expense.amount)}
            <span className="hidden sm:inline"> · {categoryName}</span>
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end">
          <span className="text-xs text-muted-foreground">
            {position.label}
          </span>
          {position.amount && (
            <span className={cn('font-semibold', position.className)}>
              {position.amount}
            </span>
          )}
        </span>
        <ChevronDown className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/expense:rotate-180 sm:block" />
      </summary>
      <div className="flex flex-col gap-3 border-t border-dashed bg-muted/30 py-4 pr-4 pl-[4.25rem] sm:pl-[7.75rem]">
        <p className="text-sm text-muted-foreground">
          {format(expense.date, 'd MMM yyyy')} · {categoryName}
          {expense.description && (
            <span className="mt-1 block">{expense.description}</span>
          )}
        </p>
        <ul className="flex max-w-md flex-col gap-2">
          {expense.transactions.map((transaction) => {
            const receiverName = shortName(transaction.receiver, viewerId);
            const ownShare = transaction.payerId === transaction.receiverId;
            return (
              <li
                key={transaction.uuid}
                className="flex items-center gap-3 text-sm"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
                  {initials(transaction.receiver)}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium">{receiverName}</span>{' '}
                  <span className="text-muted-foreground">
                    {ownShare
                      ? 'paid own share'
                      : `${receiverName === 'You' ? 'owe' : 'owes'} ${shortName(transaction.payer, viewerId)}`}
                  </span>
                </span>
                <span className="font-medium">{money(transaction.amount)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
};

const GroupExpenseList = ({
  group,
  groupExpenses,
  user,
  isFiltered = false,
}: GroupExpenseListProps) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  if (!group || !user) return null;

  const currencySymbol = currencySymbolFor(user.currency);
  const totalAmount = spendingOf(groupExpenses);

  const onDeleteExpense = (groupUuid: string, groupExpenseUuid: string) => {
    startTransition(async () => {
      const deleteResponse = await actions.deleteExpense(
        groupUuid,
        groupExpenseUuid,
      );
      // On success the action redirects, so only a failure returns a value.
      const deleteState = deleteResponse?.state !== false;
      if (!deleteState) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'An error occurred while deleting the expense.',
        });
      } else {
        toast({
          title: 'Expense deleted successfully.',
          description: 'The expense has been removed from the group.',
        });
      }
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        pending && 'pointer-events-none opacity-60',
      )}
    >
      {groupByMonth(groupExpenses).map(([month, expenses]) => (
        <section
          key={month}
          className="overflow-hidden rounded-2xl border bg-card text-card-foreground"
        >
          <header className="flex items-center justify-between px-4 py-3 sm:px-5">
            <h3 className="font-semibold">{month}</h3>
            <span className="text-sm text-muted-foreground">
              {formatMoney(currencySymbol, spendingOf(expenses))}
            </span>
          </header>
          <ul>
            {expenses.map((groupExpense) => (
              <li key={groupExpense.uuid} className="relative border-t">
                <ExpenseRow
                  groupExpense={groupExpense}
                  viewerId={user.id}
                  currencySymbol={currencySymbol}
                />
                {/* Outside the row's <summary> so opening the menu doesn't expand it */}
                <div className="absolute top-5 right-2 sm:right-3">
                  <ExpenseActionsMenu
                    groupUuid={group.uuid || ''}
                    groupExpense={groupExpense}
                    onDelete={onDeleteExpense}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 font-semibold sm:px-5">
        <span>{isFiltered ? 'Total (filtered)' : 'Total group spending'}</span>
        <span>{formatMoney(currencySymbol, totalAmount)}</span>
      </div>
    </div>
  );
};

export default GroupExpenseList;
