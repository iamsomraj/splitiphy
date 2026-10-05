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
import { cn, formatNumber } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';

export type ExpenseFormValues = {
  expenseCategory: string;
  expenseName: string;
  expenseDescription: string;
  expenseDate: Date | undefined;
  expenseAmount: '' | number;
  isMultiplePaidBy: boolean;
  paidBy: string;
  paidByList: string[];
  paidByAmounts: Record<string, number>;
  expenseSplitWith: string[];
  splitAmounts: Record<string, number>;
};

const emptyFormValues: ExpenseFormValues = {
  expenseCategory: '',
  expenseName: '',
  expenseDescription: '',
  expenseDate: undefined,
  expenseAmount: '',
  isMultiplePaidBy: false,
  paidBy: '',
  paidByList: [],
  paidByAmounts: {},
  expenseSplitWith: [],
  splitAmounts: {},
};

/**
 * Splits `total` evenly across `ids` (rounded down to cents) and gives the
 * leftover cents to the first member so the parts always add up to `total`.
 */
const splitEvenly = (total: number, ids: string[]) => {
  const amounts: Record<string, number> = {};
  if (!ids.length) {
    return amounts;
  }
  const evenAmount = Math.floor((total / ids.length) * 100) / 100;
  const remaining = formatNumber(total - evenAmount * ids.length);
  ids.forEach((id) => (amounts[id] = evenAmount));
  amounts[ids[0]] = formatNumber(amounts[ids[0]] + remaining);
  return amounts;
};

type GroupExpenseFormProps = {
  group: SingleGroupWithData;
  /** When provided, the form edits this group expense instead of adding one. */
  groupExpenseUuid?: string;
  initialValues?: ExpenseFormValues;
};

const GroupExpenseForm = ({
  group,
  groupExpenseUuid,
  initialValues = emptyFormValues,
}: GroupExpenseFormProps) => {
  const isEditing = Boolean(groupExpenseUuid);

  const [formState, action] = useActionState(
    isEditing
      ? actions.editGroupExpense.bind(
          null,
          group?.uuid || '',
          groupExpenseUuid || '',
        )
      : actions.addGroupExpense.bind(null, group?.uuid || ''),
    {
      errors: {},
    },
  );

  const [formData, setFormData] = useState<ExpenseFormValues>(initialValues);
  // Bumped on reset so uncontrolled children (multi selects) remount.
  const [resetKey, setResetKey] = useState(0);

  const handleExpenseAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newExpenseAmount = formatNumber(event.target.value);
    setFormData({
      ...formData,
      expenseAmount: Number.isNaN(newExpenseAmount) ? '' : newExpenseAmount,
      splitAmounts: splitEvenly(
        newExpenseAmount || 0,
        formData.expenseSplitWith,
      ),
      paidByAmounts: formData.isMultiplePaidBy
        ? splitEvenly(newExpenseAmount || 0, formData.paidByList)
        : formData.paidByAmounts,
    });
  };

  const handleSplitWithChange = (selectedUsers: string[]) => {
    setFormData({
      ...formData,
      expenseSplitWith: selectedUsers,
      splitAmounts: splitEvenly(formData.expenseAmount || 0, selectedUsers),
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

  const handlePaidByListChange = (selectedUsers: string[]) => {
    setFormData({
      ...formData,
      paidByList: selectedUsers,
      paidByAmounts: splitEvenly(formData.expenseAmount || 0, selectedUsers),
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

  const handleReset = () => {
    setFormData(initialValues);
    setResetKey((key) => key + 1);
  };

  if (!group) {
    return null;
  }

  const memberOptions = group.groupMemberships.map((membership) => ({
    label: membership.user.firstName + ' ' + membership.user.lastName,
    value: membership.user.id,
  }));

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Values managed in React state are submitted through hidden inputs */}
      <input
        type="hidden"
        name="expense-category"
        value={formData.expenseCategory}
      />
      <input
        type="hidden"
        name="expense-date"
        value={
          formData.expenseDate ? format(formData.expenseDate, 'yyyy-MM-dd') : ''
        }
      />
      {formData.isMultiplePaidBy ? (
        formData.paidByList.map((id) => (
          <input key={id} type="hidden" name="expense-paid-by" value={id} />
        ))
      ) : (
        <input type="hidden" name="expense-paid-by" value={formData.paidBy} />
      )}
      {formData.expenseSplitWith.map((id) => (
        <input key={id} type="hidden" name="expense-split-with" value={id} />
      ))}

      {/* EXPENSE CATEGORY */}
      <div className="flex flex-col gap-4">
        <Label
          className={cn({
            'text-destructive': Boolean(formState?.errors?.category || false),
          })}
        >
          Category
        </Label>
        <ExpenseCategorySelect
          value={formData.expenseCategory}
          onChange={(value) =>
            setFormData({ ...formData, expenseCategory: value })
          }
        />
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
          value={formData.expenseName}
          onChange={(e) =>
            setFormData({ ...formData, expenseName: e.target.value })
          }
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
          value={formData.expenseDescription}
          onChange={(e) =>
            setFormData({ ...formData, expenseDescription: e.target.value })
          }
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
              defaultMonth={formData.expenseDate}
              onSelect={(date) =>
                date && setFormData({ ...formData, expenseDate: date })
              }
              autoFocus
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
          step="0.01"
          min="0"
          inputMode="decimal"
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
                paidByAmounts: checked
                  ? splitEvenly(
                      formData.expenseAmount || 0,
                      formData.paidByList,
                    )
                  : formData.paidByAmounts,
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
            className={cn({
              'text-destructive': Boolean(
                formState?.errors?.paidByList || false,
              ),
            })}
          >
            Members Paid By
          </Label>
          <MultiSelect
            key={`paid-by-${resetKey}`}
            placeholder="Select members who paid"
            options={memberOptions}
            value={formData.paidByList}
            onChange={handlePaidByListChange}
          />
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
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    value={formData.paidByAmounts[member.user.id] ?? ''}
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
            className={cn({
              'text-destructive': Boolean(formState?.errors?.paidBy || false),
            })}
          >
            Paid By
          </Label>
          <Select
            value={formData.paidBy}
            onValueChange={(value) =>
              setFormData({ ...formData, paidBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {memberOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          className={cn({
            'text-destructive': Boolean(formState?.errors?.splitWith || false),
          })}
        >
          Split With
        </Label>
        <MultiSelect
          key={`split-with-${resetKey}`}
          placeholder="Select members to split with"
          options={memberOptions}
          value={formData.expenseSplitWith}
          onChange={handleSplitWithChange}
        />
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
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    value={formData.splitAmounts[member.user.id] ?? ''}
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
        <FormButton className="w-full">{isEditing ? 'Save' : 'Add'}</FormButton>
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export default GroupExpenseForm;
