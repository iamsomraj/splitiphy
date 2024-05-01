'use client';
import * as actions from '@/actions';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { LoggedInUser, SingleGroupWithData } from '@/db/queries';
import constants from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';
import { DotsHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { useTransition } from 'react';
import { useToast } from '../ui/use-toast';
import { ExpenseCategoryIcon } from './expense-category-icon';

type ExpenseListProps = {
  group: SingleGroupWithData;
  user: LoggedInUser;
};

const ExpenseList = ({ group, user }: ExpenseListProps) => {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  if (!group || !user) return null;

  const currencyCode = user.currency;
  const currencySymbol =
    constants.currenciesCodeSymbolMap[
      currencyCode as keyof typeof constants.currenciesCodeSymbolMap
    ];

  let totalAmount = 0;
  group.groupExpenses.forEach((groupExpense) => {
    if (!groupExpense.isSystemGenerated) {
      totalAmount += formatNumber(groupExpense.expense.amount);
    }
  });

  const onDeleteExpense = async (
    groupUuid: string,
    groupExpenseUuid: string,
  ) => {
    startTransition(async () => {
      const deleteResponse = await actions.deleteExpense(
        groupUuid,
        groupExpenseUuid,
      );
      const deleteState = deleteResponse?.state || true;
      if (!deleteState) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'An error occurred while deleting the expense.',
        });
      }
      const simplifyResponse = await actions.simplifyGroupExpenses(groupUuid);
      const simplifyState = simplifyResponse?.state || true;
      const simplifyTitle =
        simplifyResponse?.title || 'Great! Your expenses have been simplified.';
      const simplifyDescription =
        simplifyResponse?.message ||
        `Expenses simplified for group ${group?.name}.`;
      if (!simplifyState) {
        toast({
          title: simplifyTitle,
          description: simplifyDescription,
        });
      } else {
        toast({
          title: simplifyTitle,
          description: simplifyDescription,
        });
      }
    });
  };

  return (
    <>
      <div className="hidden sm:block">
        <Table>
          <TableCaption>Group Expenses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.groupExpenses.map((groupExpense) => (
              <TableRow
                key={groupExpense.uuid}
                className={cn(
                  groupExpense.isSystemGenerated &&
                    'font-medium text-green-600 dark:text-green-200',
                  pending && 'pointer-events-none opacity-60',
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ExpenseCategoryIcon
                      icon={
                        constants.expenseCategoryKeyIconMap[
                          (groupExpense?.expense
                            ?.category as keyof typeof constants.expenseCategoryKeyIconMap) ||
                            'other'
                        ]
                      }
                      className="ml-2 h-4 w-4"
                    />
                    <span>
                      {constants.expensesCategories.find(
                        (category) =>
                          category.key === groupExpense.expense.category,
                      )?.name || 'Other'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {groupExpense.expense.date.toDateString()}
                </TableCell>
                <TableCell>{groupExpense.expense.name}</TableCell>
                <TableCell>
                  <div className="line-clamp-1">
                    {groupExpense.expense.description}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="mr-0.5">{currencySymbol}</span>
                  {groupExpense.expense.amount}
                </TableCell>
                <TableCell>
                  {groupExpense.expense.transactions.map((transaction) => (
                    <div
                      key={transaction.uuid}
                      className="grid w-full grid-cols-3 gap-6"
                    >
                      <span className="col-span-2 line-clamp-1">
                        {transaction.payer.firstName}{' '}
                        {transaction.payer.lastName.charAt(0).toUpperCase() +
                          '.'}{' '}
                        paid {transaction.receiver.firstName}{' '}
                        {transaction.receiver.lastName.charAt(0).toUpperCase() +
                          '.'}
                      </span>
                      <span className="col-span-1">
                        <span className="mr-0.5">{currencySymbol}</span>
                        {transaction.amount}
                      </span>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={async () =>
                          await onDeleteExpense(
                            group?.uuid || '',
                            groupExpense?.uuid || '',
                          )
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total Group Spending</TableCell>
              <TableCell>
                <span className="mr-0.5">{currencySymbol}</span>
                {totalAmount}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <ul className="flex flex-col gap-6 sm:hidden">
        {group.groupExpenses.map((groupExpense) => (
          <li
            key={groupExpense.uuid}
            className={cn(
              'flex flex-col gap-2 rounded-sm border bg-muted/40 p-6 hover:bg-muted/20',
              groupExpense.isSystemGenerated &&
                'text-green-600 dark:text-green-200',
              pending && 'pointer-events-none opacity-60',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>{groupExpense.expense.date.toDateString()}</span>
              <span className="flex items-center font-semibold text-accent-foreground/40">
                <ExpenseCategoryIcon
                  icon={
                    constants.expenseCategoryKeyIconMap[
                      (groupExpense?.expense
                        ?.category as keyof typeof constants.expenseCategoryKeyIconMap) ||
                        'other'
                    ]
                  }
                  className="h-4 w-4"
                />
                <span>
                  {constants.expensesCategories.find(
                    (category) =>
                      category.key === groupExpense.expense.category,
                  )?.name || 'Other'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <DotsVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () =>
                        await onDeleteExpense(
                          group?.uuid || '',
                          groupExpense?.uuid || '',
                        )
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-2xl font-bold">
                {groupExpense.expense.name}
              </span>
              <span className="line-clamp-1 font-semibold text-accent-foreground/40">
                {groupExpense.expense.description}
              </span>
            </div>
            <div className="font-medium">
              Total <span className="ml-1 mr-0.5">{currencySymbol}</span>
              {groupExpense.expense.amount}{' '}
            </div>
            <div className="flex flex-col gap-4 pt-2">
              {groupExpense.expense.transactions.map((transaction) => (
                <div
                  key={transaction.uuid}
                  className="grid w-full grid-cols-3 gap-6 text-sm text-accent-foreground/60"
                >
                  <span className="col-span-2 line-clamp-1">
                    {transaction.payer.firstName}{' '}
                    {transaction.payer.lastName.charAt(0).toUpperCase() + '.'}{' '}
                    paid {transaction.receiver.firstName}{' '}
                    {transaction.receiver.lastName.charAt(0).toUpperCase() +
                      '.'}
                  </span>
                  <span className="col-span-1">
                    <span className="mr-0.5">{currencySymbol}</span>
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ExpenseList;
