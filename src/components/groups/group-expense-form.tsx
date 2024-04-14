'use client';
import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GroupWithData } from '@/db/queries';
import { cn, formatNumber } from '@/lib/utils';
import { useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { SelectSingleEventHandler } from 'react-day-picker';

type GroupExpenseFormProps = {
  group: GroupWithData;
};

const GroupExpenseForm = ({ group }: GroupExpenseFormProps) => {
  const hiddenExpenseDateInputRef = useRef<HTMLInputElement>(null);
  const [formState, action] = useFormState(
    actions.createGroupExpense.bind(null, group?.uuid || ''),
    {
      errors: {},
    },
  );

  const [formData, setFormData] = useState({
    expenseDate: undefined as Date | undefined,
    expenseAmount: 0,
    isMultiplePaidBy: false,
    paidByList: [] as string[],
    paidByAmounts: {} as Record<string, number>,
    expenseSplitWith: [] as string[],
    splitAmounts: {} as Record<string, number>,
  });

  const handleExpenseDateChange: SelectSingleEventHandler = (date) => {
    if (!hiddenExpenseDateInputRef.current || !date) {
      return;
    }
    setFormData({
      ...formData,
      expenseDate: date,
    });
    hiddenExpenseDateInputRef.current.value = format(date, 'yyyy-MM-dd');
  };

  const handleExpenseAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newExpenseAmount = parseFloat(event.target.value);
    const selectedUsers = formData.expenseSplitWith;
    const totalSelectedUsers = selectedUsers.length;
    const evenSplitAmount = formatNumber(newExpenseAmount / totalSelectedUsers);
    const remainingAmount = formatNumber(
      newExpenseAmount - evenSplitAmount * totalSelectedUsers,
    );

    const updatedSplitAmounts: Record<string, number> = {};

    for (let i = 0; i < totalSelectedUsers; i++) {
      updatedSplitAmounts[selectedUsers[i]] = evenSplitAmount;
    }

    for (let i = 0; i < remainingAmount * 100; i++) {
      updatedSplitAmounts[selectedUsers[i % totalSelectedUsers]] = formatNumber(
        updatedSplitAmounts[selectedUsers[i % totalSelectedUsers]] + 0.01,
      );
    }

    setFormData({
      ...formData,
      expenseAmount: formatNumber(newExpenseAmount),
      splitAmounts: updatedSplitAmounts,
    });
  };

  const handleSplitWithChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsers = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    const totalExpense = formData.expenseAmount || 0;
    const totalSelectedUsers = selectedUsers.length;
    const evenSplitAmount = formatNumber(totalExpense / totalSelectedUsers);
    const remainingAmount = formatNumber(
      totalExpense - evenSplitAmount * totalSelectedUsers,
    );

    const updatedSplitAmounts: Record<string, number> = {};

    for (let i = 0; i < totalSelectedUsers; i++) {
      updatedSplitAmounts[selectedUsers[i]] = evenSplitAmount;
    }

    for (let i = 0; i < remainingAmount * 100; i++) {
      updatedSplitAmounts[selectedUsers[i % totalSelectedUsers]] = formatNumber(
        updatedSplitAmounts[selectedUsers[i % totalSelectedUsers]] + 0.01,
      );
    }

    setFormData({
      ...formData,
      expenseSplitWith: selectedUsers,
      splitAmounts: updatedSplitAmounts,
    });
  };

  const handleSplitAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string,
  ) => {
    setFormData({
      ...formData,
      splitAmounts: {
        ...formData.splitAmounts,
        [userId]: parseFloat(parseFloat(e.target.value).toFixed(2)),
      },
    });
  };
  const handlePaidByListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsers = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    const totalPaidAmount = formData.expenseAmount || 0;
    const totalSelectedUsers = selectedUsers.length;
    const evenPaidAmount = formatNumber(totalPaidAmount / totalSelectedUsers);
    const remainingAmount = formatNumber(
      totalPaidAmount - evenPaidAmount * totalSelectedUsers,
    );

    const updatedPaidAmounts: Record<string, number> = {};

    for (let i = 0; i < totalSelectedUsers; i++) {
      updatedPaidAmounts[selectedUsers[i]] = evenPaidAmount;
    }

    for (let i = 0; i < remainingAmount * 100; i++) {
      updatedPaidAmounts[selectedUsers[i % totalSelectedUsers]] = formatNumber(
        updatedPaidAmounts[selectedUsers[i % totalSelectedUsers]] + 0.01,
      );
    }

    setFormData({
      ...formData,
      paidByList: selectedUsers,
      paidByAmounts: updatedPaidAmounts,
    });
  };

  const handlePaidAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string,
  ) => {
    setFormData({
      ...formData,
      paidByAmounts: {
        ...formData.paidByAmounts,
        [userId]: parseFloat(parseFloat(e.target.value).toFixed(2)),
      },
    });
  };

  if (!group) {
    return null;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* EXPENSE NAME */}
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="expense-name"
          className={cn({
            'text-destructive': Boolean(formState?.errors?.name || false),
          })}
        >
          Name
        </Label>
        <Input
          type="text"
          id="expense-name"
          name="expense-name"
          placeholder="Grocery"
        />
        <div className="text-sm text-muted-foreground">
          This is the name of your expense.
        </div>
        {formState.errors.name ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.name?.join(', ')}
          </span>
        ) : null}
      </div>
      {/* EXPENSE NAME */}
      {/* EXPENSE DESCRIPTION */}
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="expense-description"
          className={cn({
            'text-destructive': Boolean(
              formState?.errors?.description || false,
            ),
          })}
        >
          Description
        </Label>
        <Textarea
          id="expense-description"
          name="expense-description"
          placeholder="For the party"
          className="resize-none"
        ></Textarea>
        <div className="text-sm text-muted-foreground">
          This is the description of your expense.
        </div>
        {formState.errors.description ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.description?.join(', ')}
          </span>
        ) : null}
      </div>
      {/* EXPENSE DESCRIPTION */}
      {/* EXPENSE DATE */}
      <div className="flex flex-col gap-4">
        <Label
          className={cn({
            'text-destructive': Boolean(formState?.errors?.date || false),
          })}
        >
          Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !formData.expenseDate && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.expenseDate ? (
                format(formData.expenseDate, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.expenseDate}
              onSelect={handleExpenseDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="text-sm text-muted-foreground">
          This is the date of your expense.
        </div>
        {formState.errors.date ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.date?.join(', ')}
          </span>
        ) : null}
      </div>
      <div className="hidden">
        <label htmlFor="expense-date">Expense Date</label>
        <input
          ref={hiddenExpenseDateInputRef}
          type="date"
          id="expense-date"
          name="expense-date"
          placeholder="Enter Expense Date"
        />
      </div>
      {/* EXPENSE DATE */}
      {/* EXPENSE AMOUNT */}
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="expense-amount"
          className={cn({
            'text-destructive': Boolean(formState?.errors?.amount || false),
          })}
        >
          Amount
        </Label>
        <Input
          type="number"
          id="expense-amount"
          name="expense-amount"
          placeholder="Enter Expense Amount"
          value={formData.expenseAmount}
          onChange={handleExpenseAmountChange}
        />
        <div className="text-sm text-muted-foreground">
          This is the total amount of your expense.
        </div>
        {formState.errors.amount ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.amount?.join(', ')}
          </span>
        ) : null}
      </div>
      {/* EXPENSE AMOUNT */}

      {/* PAID BY */}
      <div className="flex flex-col gap-4">
        <label htmlFor="is-multiple-paid-by">Multiple Paid By</label>
        <input
          type="checkbox"
          id="is-multiple-paid-by"
          name="is-multiple-paid-by"
          checked={formData.isMultiplePaidBy}
          onChange={(e) =>
            setFormData({
              ...formData,
              isMultiplePaidBy: e.target.checked,
            })
          }
        />
        {formState.errors.isMultiplePaidBy ? (
          <span>{formState.errors.isMultiplePaidBy?.join(', ')}</span>
        ) : null}
      </div>
      {formData.isMultiplePaidBy ? (
        <div>
          <label htmlFor="expense-paid-by">Paid By</label>
          <select
            id="expense-paid-by"
            name="expense-paid-by"
            multiple
            size={group?.groupMemberships.length}
            value={formData.paidByList}
            onChange={handlePaidByListChange}
          >
            {group?.groupMemberships.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.firstName + ' ' + member.user.lastName}
              </option>
            ))}
          </select>
          {formState.errors.paidByList ? (
            <span>{formState.errors.paidByList?.join(', ')}</span>
          ) : null}
          <div>
            {formData.paidByList.map((userID) => {
              const member = group.groupMemberships.find(
                (membership) => membership.user.id === userID,
              );
              if (!member) {
                return null;
              }
              return (
                <div key={member.user.id}>
                  <label htmlFor={`paid-amount-${member.user.id}`}>
                    {member.user.firstName + ' ' + member.user.lastName}
                  </label>
                  <input
                    type="number"
                    id={`paid-amount-${member.user.id}`}
                    name={`paid-amount-${member.user.id}`}
                    placeholder="Enter Paid Amount"
                    value={formData.paidByAmounts[member.user.id] || ''}
                    onChange={(e) => handlePaidAmountChange(e, member.user.id)}
                  />
                </div>
              );
            })}
            {formState.errors.paidByAmounts ? (
              <span>{formState.errors.paidByAmounts?.join(', ')}</span>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="expense-paid-by">Paid By</label>
          <select id="expense-paid-by" name="expense-paid-by">
            {group?.groupMemberships.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.firstName + ' ' + member.user.lastName}
              </option>
            ))}
          </select>
          {formState.errors.paidBy ? (
            <span>{formState.errors.paidBy?.join(', ')}</span>
          ) : null}
        </div>
      )}
      {/* PAID BY */}

      <div>
        <label htmlFor="expense-split-with">Split With</label>
        <select
          id="expense-split-with"
          name="expense-split-with"
          multiple
          size={group?.groupMemberships.length}
          value={formData.expenseSplitWith}
          onChange={handleSplitWithChange}
        >
          {group?.groupMemberships.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.firstName + ' ' + member.user.lastName}
            </option>
          ))}
        </select>
        {formState.errors.splitWith ? (
          <span>{formState.errors.splitWith?.join(', ')}</span>
        ) : null}
      </div>
      <div>
        <label htmlFor="expense-split-amount">Split Amount</label>
        <div>
          {formData.expenseSplitWith.map((userID) => {
            const member = group.groupMemberships.find(
              (membership) => membership.user.id === userID,
            );
            if (!member) {
              return null;
            }
            return (
              <div key={member.user.id}>
                <label htmlFor={`split-amount-${member.user.id}`}>
                  {member.user.firstName + ' ' + member.user.lastName}
                </label>
                <input
                  type="number"
                  id={`split-amount-${member.user.id}`}
                  name={`split-amount-${member.user.id}`}
                  placeholder="Enter Split Amount"
                  value={formData.splitAmounts[member.user.id] || ''}
                  onChange={(e) => handleSplitAmountChange(e, member.user.id)}
                />
              </div>
            );
          })}
          {formState.errors.splitAmounts ? (
            <span>{formState.errors.splitAmounts?.join(', ')}</span>
          ) : null}
        </div>
      </div>
      {formState.errors._form ? (
        <div>{formState.errors._form?.join(', ')}</div>
      ) : null}
      <FormButton>Create Expense</FormButton>
    </form>
  );
};

export default GroupExpenseForm;
