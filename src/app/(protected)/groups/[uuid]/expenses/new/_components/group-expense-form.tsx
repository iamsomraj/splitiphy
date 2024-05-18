'use client';
import * as actions from '@/actions';
import { ExpenseCategorySelect } from '@/components/shared/expense-category-select';
import FormButton from '@/components/shared/form-button';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SingleGroupWithData } from '@/db/queries';
import constants from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { useFormState } from 'react-dom';

type GroupExpenseFormProps = {
  group: SingleGroupWithData;
};

const GroupExpenseForm = ({ group }: GroupExpenseFormProps) => {
  const hiddenExpenseCategoryInputRef = useRef<HTMLSelectElement>(null);
  const hiddenExpenseSplitWithRef = useRef<HTMLSelectElement>(null);
  const hiddenExpenseDateInputRef = useRef<HTMLInputElement>(null);
  const hiddenExpensePaidBySingleRef = useRef<HTMLSelectElement>(null);
  const hiddenExpensePaidByMultipleRef = useRef<HTMLSelectElement>(null);

  const [formState, action] = useFormState(
    actions.addGroupExpense.bind(null, group?.uuid || ''),
    {
      errors: {},
    },
  );

  const [formData, setFormData] = useState({
    expenseCategory: '',
    expenseDate: undefined as Date | undefined,
    expenseAmount: '' as '' | number,
    isMultiplePaidBy: false,
    paidByList: [] as string[],
    paidByAmounts: {} as Record<string, number>,
    expenseSplitWith: [] as string[],
    splitAmounts: {} as Record<string, number>,
  });

  const handleExpenseCategoryChange = (value: string) => {
    if (!hiddenExpenseCategoryInputRef.current) {
      return;
    }
    hiddenExpenseCategoryInputRef.current.value = value;
    setFormData({
      ...formData,
      expenseCategory: value,
    });
  };

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

  const handleExpenseSinglePaidByChange = (value: string) => {
    if (!hiddenExpensePaidBySingleRef.current) {
      return;
    }
    hiddenExpensePaidBySingleRef.current.value = value;
  };

  const handleExpenseAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newExpenseAmount = formatNumber(event.target.value);
    const selectedUsers = formData.expenseSplitWith;
    const totalSelectedUsers = selectedUsers.length;
    const isMultiplePaidBy = formData.isMultiplePaidBy;

    let evenSplitAmount =
      Math.floor((newExpenseAmount / totalSelectedUsers) * 100) / 100;

    let remainingAmount = formatNumber(
      newExpenseAmount - evenSplitAmount * totalSelectedUsers,
    );

    const updatedSplitAmounts: Record<string, number> = {};
    const updatedPaidAmounts: Record<string, number> = {};

    for (let i = 0; i < totalSelectedUsers; i++) {
      updatedSplitAmounts[selectedUsers[i]] = evenSplitAmount;
    }

    updatedSplitAmounts[selectedUsers[0]] = formatNumber(
      updatedSplitAmounts[selectedUsers[0]] + remainingAmount,
    );

    if (isMultiplePaidBy) {
      const totalPaidAmount = newExpenseAmount;
      const selectedPaidByUsers = formData.paidByList;
      const totalSelectedPaidByUsers = selectedPaidByUsers.length;

      let evenPaidAmount =
        Math.floor((totalPaidAmount / totalSelectedPaidByUsers) * 100) / 100;

      let remainingPaidAmount = formatNumber(
        totalPaidAmount - evenPaidAmount * totalSelectedPaidByUsers,
      );

      for (let i = 0; i < totalSelectedPaidByUsers; i++) {
        updatedPaidAmounts[selectedPaidByUsers[i]] = evenPaidAmount;
      }

      updatedPaidAmounts[selectedPaidByUsers[0]] = formatNumber(
        updatedPaidAmounts[selectedPaidByUsers[0]] + remainingPaidAmount,
      );
    }

    setFormData({
      ...formData,
      expenseAmount: formatNumber(newExpenseAmount),
      splitAmounts: updatedSplitAmounts,
      paidByAmounts: isMultiplePaidBy
        ? updatedPaidAmounts
        : formData.paidByAmounts,
    });
  };

  const handleSplitWithChange = (options: string[]) => {
    if (!hiddenExpenseSplitWithRef.current) {
      return;
    }

    const selectedUsers = options;

    Array.from(hiddenExpenseSplitWithRef.current.options).forEach((option) => {
      option.selected = options.includes(option.value);
    });

    const totalExpense = formData.expenseAmount || 0;
    const totalSelectedUsers = selectedUsers.length;

    let evenSplitAmount =
      Math.floor((totalExpense / totalSelectedUsers) * 100) / 100;

    let remainingAmount = formatNumber(
      totalExpense - evenSplitAmount * totalSelectedUsers,
    );

    const updatedSplitAmounts: Record<string, number> = {};

    for (let i = 0; i < totalSelectedUsers; i++) {
      updatedSplitAmounts[selectedUsers[i]] = evenSplitAmount;
    }

    updatedSplitAmounts[selectedUsers[0]] = formatNumber(
      updatedSplitAmounts[selectedUsers[0]] + remainingAmount,
    );

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
        [userId]: formatNumber(e.target.value),
      },
    });
  };

  const handlePaidByListChange = (options: string[]) => {
    if (!hiddenExpensePaidByMultipleRef.current) {
      return;
    }

    const selectedUsers = options;

    Array.from(hiddenExpensePaidByMultipleRef.current.options).forEach(
      (option) => {
        option.selected = options.includes(option.value);
      },
    );

    const totalPaidAmount = formData.expenseAmount || 0;
    const totalSelectedUsers = selectedUsers.length;

    let evenPaidAmount =
      Math.floor((totalPaidAmount / totalSelectedUsers) * 100) / 100;

    let remainingAmount = formatNumber(
      totalPaidAmount - evenPaidAmount * totalSelectedUsers,
    );

    const updatedPaidAmounts: Record<string, number> = {};

    for (let i = 0; i < totalSelectedUsers; i++) {
      updatedPaidAmounts[selectedUsers[i]] = evenPaidAmount;
    }

    updatedPaidAmounts[selectedUsers[0]] = formatNumber(
      updatedPaidAmounts[selectedUsers[0]] + remainingAmount,
    );

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
        [userId]: formatNumber(e.target.value),
      },
    });
  };

  if (!group) {
    return null;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* EXPENSE CATEGORY */}
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="expense-category"
          className={cn({
            'text-destructive': Boolean(formState?.errors?.category || false),
          })}
        >
          Category
        </Label>
        <ExpenseCategorySelect
          value={formData.expenseCategory}
          onChange={handleExpenseCategoryChange}
        />
        <select
          ref={hiddenExpenseCategoryInputRef}
          id="expense-category"
          name="expense-category"
          className="hidden"
        >
          {constants.expensesCategories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="text-sm text-muted-foreground">
          This is the category of your expense.
        </div>
        {formState.errors.category ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.category?.join(', ')}
          </span>
        ) : null}
      </div>
      {/* EXPENSE CATEGORY */}

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
          placeholder="Weekly household grocery"
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
                'justify-start text-left font-normal',
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
          pattern="[0-9]+(\.[0-9]+)?"
          inputMode="numeric"
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
        <div className="flex items-center gap-4">
          <Switch
            id="is-multiple-paid-by"
            name="is-multiple-paid-by"
            checked={formData.isMultiplePaidBy}
            onCheckedChange={(checked) =>
              setFormData({
                ...formData,
                isMultiplePaidBy: checked,
              })
            }
          />
          <Label
            htmlFor="is-multiple-paid-by"
            className={cn({
              'text-destructive': Boolean(
                formState?.errors?.isMultiplePaidBy || false,
              ),
            })}
          >
            Multi Payment Mode
          </Label>
        </div>
        <div className="text-sm text-muted-foreground">
          This is the selection whether the expense is paid by multiple members
        </div>
        {formState.errors.isMultiplePaidBy ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.isMultiplePaidBy?.join(', ')}
          </span>
        ) : null}
      </div>
      {formData.isMultiplePaidBy ? (
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="expense-paid-by"
            className={cn({
              'text-destructive': Boolean(
                formState?.errors?.paidByList || false,
              ),
            })}
          >
            Members Paid By
          </Label>
          <MultiSelect
            placeholder="Select members who paid"
            options={[
              ...group.groupMemberships.map((membership) => ({
                label:
                  membership.user.firstName + ' ' + membership.user.lastName,
                value: membership.user.id,
              })),
            ]}
            value={formData.paidByList}
            onChange={handlePaidByListChange}
          />
          <select
            className="hidden"
            ref={hiddenExpensePaidByMultipleRef}
            id="expense-paid-by"
            name="expense-paid-by"
            multiple
          >
            {group?.groupMemberships.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.firstName + ' ' + member.user.lastName}
              </option>
            ))}
          </select>
          <div className="text-sm text-muted-foreground">
            This is the selection of members who paid for the expense.
          </div>
          {formState.errors.paidByList ? (
            <span className="text-sm font-medium text-destructive">
              {formState.errors.paidByList?.join(', ')}
            </span>
          ) : null}
          <div className="flex flex-col gap-4">
            {formData.paidByList.map((userID) => {
              const member = group.groupMemberships.find(
                (membership) => membership.user.id === userID,
              );
              if (!member) {
                return null;
              }
              return (
                <div key={member.user.id} className="flex flex-col gap-4">
                  <Label htmlFor={`paid-amount-${member.user.id}`}>
                    {member.user.firstName + ' ' + member.user.lastName}
                  </Label>
                  <Input
                    type="number"
                    id={`paid-amount-${member.user.id}`}
                    name={`paid-amount-${member.user.id}`}
                    placeholder={`Enter Paid Amount for ${
                      member.user.firstName + ' ' + member.user.lastName
                    }`}
                    pattern="[0-9]+(\.[0-9]+)?"
                    inputMode="numeric"
                    value={formData.paidByAmounts[member.user.id] || ''}
                    onChange={(e) => handlePaidAmountChange(e, member.user.id)}
                  />
                </div>
              );
            })}
            <div className="text-sm text-muted-foreground">
              This is the amount paid by each member.
            </div>
            {formState.errors.paidByAmounts ? (
              <span className="text-sm font-medium text-destructive">
                {formState.errors.paidByAmounts?.join(', ')}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Label
            htmlFor="expense-paid-by"
            className={cn({
              'text-destructive': Boolean(formState?.errors?.paidBy || false),
            })}
          >
            Paid By
          </Label>
          <Select
            name="expense-paid-by"
            onValueChange={handleExpenseSinglePaidByChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {group?.groupMemberships.map((member) => (
                <SelectItem key={member.user.id} value={member.user.id}>
                  {member.user.firstName + ' ' + member.user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <select
            ref={hiddenExpensePaidBySingleRef}
            id="expense-paid-by"
            className="hidden"
            name="expense-paid-by"
          >
            {group?.groupMemberships.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.firstName + ' ' + member.user.lastName}
              </option>
            ))}
          </select>
          <div className="text-sm text-muted-foreground">
            This is the member who paid for the expense.
          </div>
          {formState.errors.paidBy ? (
            <span className="text-sm font-medium text-destructive">
              {formState.errors.paidBy?.join(', ')}
            </span>
          ) : null}
        </div>
      )}
      {/* PAID BY */}

      {/* SPLIT WITH */}
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="expense-split-with"
          className={cn({
            'text-destructive': Boolean(formState?.errors?.splitWith || false),
          })}
        >
          Split With
        </Label>
        <MultiSelect
          placeholder="Select members to split with"
          options={[
            ...group.groupMemberships.map((membership) => ({
              label: membership.user.firstName + ' ' + membership.user.lastName,
              value: membership.user.id,
            })),
          ]}
          value={formData.expenseSplitWith}
          onChange={handleSplitWithChange}
        />
        <select
          className="hidden"
          ref={hiddenExpenseSplitWithRef}
          id="expense-split-with"
          name="expense-split-with"
          multiple
        >
          {group?.groupMemberships.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.firstName + ' ' + member.user.lastName}
            </option>
          ))}
        </select>

        <div className="text-sm text-muted-foreground">
          This is the selection of members with whom the expense is split.
        </div>
        {formState.errors.splitWith ? (
          <span className="text-sm font-medium text-destructive">
            {formState.errors.splitWith?.join(', ')}
          </span>
        ) : null}
      </div>
      {formData.expenseSplitWith.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {formData.expenseSplitWith.map((userID) => {
              const member = group.groupMemberships.find(
                (membership) => membership.user.id === userID,
              );
              if (!member) {
                return null;
              }
              return (
                <div key={member.user.id} className="flex flex-col gap-4">
                  <Label htmlFor={`split-amount-${member.user.id}`}>
                    {member.user.firstName + ' ' + member.user.lastName}
                  </Label>
                  <Input
                    type="number"
                    id={`split-amount-${member.user.id}`}
                    name={`split-amount-${member.user.id}`}
                    placeholder={`Enter Split Amount for ${
                      member.user.firstName + ' ' + member.user.lastName
                    }`}
                    pattern="[0-9]+(\.[0-9]+)?"
                    inputMode="numeric"
                    value={formData.splitAmounts[member.user.id] || ''}
                    onChange={(e) => handleSplitAmountChange(e, member.user.id)}
                  />
                </div>
              );
            })}
            {formState.errors.splitAmounts ? (
              <span className="text-sm font-medium text-destructive">
                {formState.errors.splitAmounts?.join(', ')}
              </span>
            ) : null}
          </div>
          <div className="text-sm text-muted-foreground">
            This is the amount split with each member.
          </div>
        </div>
      )}
      {/* SPLIT WITH */}

      {formState.errors._form ? (
        <span className="text-sm font-medium text-destructive">
          {formState.errors._form?.join(', ')}
        </span>
      ) : null}

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <FormButton className="w-full">Add</FormButton>
        <Button variant="outline" type="reset" className="w-full">
          Reset
        </Button>
      </div>
    </form>
  );
};

export default GroupExpenseForm;
