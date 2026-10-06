'use client';
import * as actions from '@/actions';
import { ExpenseCategoryIcon } from '@/components/shared/expense-category-icon';
import { ExpenseCategorySelect } from '@/components/shared/expense-category-select';
import FormButton from '@/components/shared/form-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { SingleGroupWithData } from '@/db/queries';
import useMultistepForm from '@/hooks/use-multistep-form';
import constants from '@/lib/constants';
import { cn, formatNumber } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

type SplitMode = 'equal' | 'custom';

const STEPS = ['Details', 'Paid by', 'Split', 'Review'] as const;

/** Which step owns each server-side field error. */
const FIELD_STEP: Record<string, number> = {
  category: 0,
  name: 0,
  description: 0,
  date: 0,
  amount: 0,
  paidBy: 1,
  isMultiplePaidBy: 1,
  paidByList: 1,
  paidByAmounts: 1,
  splitWith: 2,
  splitAmounts: 2,
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

const sumOf = (ids: string[], amounts: Record<string, number>) =>
  formatNumber(ids.reduce((acc, id) => acc + (amounts[id] || 0), 0));

const isEvenSplit = (values: ExpenseFormValues) => {
  const even = splitEvenly(values.expenseAmount || 0, values.expenseSplitWith);
  return values.expenseSplitWith.every(
    (id) => even[id] === values.splitAmounts[id],
  );
};

type Member = NonNullable<SingleGroupWithData>['groupMemberships'][number];

const memberName = (member: Member) =>
  `${member.user.firstName} ${member.user.lastName}`.trim();

const initials = (member: Member) =>
  `${member.user.firstName.charAt(0)}${member.user.lastName.charAt(0)}`.toUpperCase();

type MemberChipProps = {
  member: Member;
  selected: boolean;
  onToggle: () => void;
  isYou?: boolean;
};

const MemberChip = ({ member, selected, onToggle, isYou }: MemberChipProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={selected}
    onClick={onToggle}
    className={cn(
      'flex min-h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm font-medium transition-colors',
      selected
        ? 'border-primary bg-primary text-primary-foreground'
        : 'bg-background hover:bg-muted',
    )}
  >
    <Avatar className="h-8 w-8">
      <AvatarImage src={member.user.profileImage || undefined} alt="" />
      <AvatarFallback className="text-xs text-foreground">
        {initials(member)}
      </AvatarFallback>
    </Avatar>
    <span className="max-w-40 truncate">
      {member.user.firstName}
      {isYou ? ' (you)' : ''}
    </span>
    {selected && <Check className="h-4 w-4" />}
  </button>
);

type AmountRowsProps = {
  members: Member[];
  amounts: Record<string, number>;
  currencySymbol: string;
  onChange: (userId: string, value: number) => void;
  label: (member: Member) => string;
};

const AmountRows = ({
  members,
  amounts,
  currencySymbol,
  onChange,
  label,
}: AmountRowsProps) => (
  <div className="flex flex-col gap-3">
    {members.map((member) => (
      <div key={member.user.id} className="flex items-center gap-3">
        <Label
          htmlFor={`amount-${member.user.id}`}
          className="min-w-0 flex-1 truncate"
        >
          {label(member)}
        </Label>
        <div className="relative w-36 shrink-0">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            {currencySymbol}
          </span>
          <Input
            id={`amount-${member.user.id}`}
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            className="pl-8 text-right"
            value={amounts[member.user.id] ?? ''}
            onChange={(e) =>
              onChange(member.user.id, formatNumber(e.target.value))
            }
          />
        </div>
      </div>
    ))}
  </div>
);

const RemainingIndicator = ({
  total,
  assigned,
  currencySymbol,
}: {
  total: number;
  assigned: number;
  currencySymbol: string;
}) => {
  const remaining = formatNumber(total - assigned);
  return (
    <div
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium',
        remaining === 0
          ? 'bg-primary/10 text-primary'
          : 'bg-destructive/10 text-destructive',
      )}
    >
      {remaining === 0
        ? 'All amounts add up.'
        : remaining > 0
          ? `${currencySymbol}${remaining} left to assign`
          : `${currencySymbol}${Math.abs(remaining)} over the total`}
    </div>
  );
};

const FieldError = ({ messages }: { messages?: string[] }) =>
  messages?.length ? (
    <span className="text-sm font-medium text-destructive">
      {messages.join(', ')}
    </span>
  ) : null;

type GroupExpenseFormProps = {
  group: SingleGroupWithData;
  currentUserId?: string;
  currencySymbol?: string;
  /** When provided, the form edits this group expense instead of adding one. */
  groupExpenseUuid?: string;
  initialValues?: ExpenseFormValues;
};

const GroupExpenseForm = ({
  group,
  currentUserId,
  currencySymbol = '',
  groupExpenseUuid,
  initialValues,
}: GroupExpenseFormProps) => {
  const isEditing = Boolean(groupExpenseUuid);
  const members = group?.groupMemberships || [];

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

  const [formData, setFormData] = useState<ExpenseFormValues>(
    () =>
      initialValues ?? {
        expenseCategory: '',
        expenseName: '',
        expenseDescription: '',
        expenseDate: new Date(),
        expenseAmount: '',
        isMultiplePaidBy: false,
        paidBy:
          members.find((member) => member.user.id === currentUserId)?.user.id ||
          '',
        paidByList: [],
        paidByAmounts: {},
        expenseSplitWith: members.map((member) => member.user.id),
        splitAmounts: {},
      },
  );
  const [splitMode, setSplitMode] = useState<SplitMode>(() =>
    initialValues && !isEvenSplit(initialValues) ? 'custom' : 'equal',
  );
  const [stepError, setStepError] = useState<string | null>(null);

  const {
    currentStepIndex,
    furthestStepIndex,
    isFirstStep,
    isLastStep,
    goTo,
    next,
    back,
  } = useMultistepForm(STEPS.length);

  // When the server rejects a submission, jump to the step owning the error.
  const [handledFormState, setHandledFormState] = useState(formState);
  if (formState !== handledFormState) {
    setHandledFormState(formState);
    const steps = Object.keys(formState.errors)
      .map((field) => FIELD_STEP[field])
      .filter((step) => step !== undefined);
    if (steps.length) {
      goTo(Math.min(...steps));
    }
  }

  const amount = formData.expenseAmount || 0;
  // In equal mode the shares are always derived from the current amount.
  const splitAmounts =
    splitMode === 'equal'
      ? splitEvenly(amount, formData.expenseSplitWith)
      : formData.splitAmounts;
  const payers = formData.isMultiplePaidBy
    ? formData.paidByList
    : formData.paidBy
      ? [formData.paidBy]
      : [];
  const paidByAmounts = formData.isMultiplePaidBy
    ? formData.paidByAmounts
    : formData.paidBy
      ? { [formData.paidBy]: amount }
      : {};

  const update = (values: Partial<ExpenseFormValues>) =>
    setFormData((current) => ({ ...current, ...values }));

  const membersById = (ids: string[]) =>
    ids
      .map((id) => members.find((member) => member.user.id === id))
      .filter((member): member is Member => Boolean(member));

  const validateStep = (step: number): string | null => {
    if (step === 0) {
      if (!(amount > 0)) return 'Enter an amount greater than zero.';
      if (formData.expenseName.trim().length < 3)
        return 'Give the expense a name of at least 3 characters.';
      if (!formData.expenseCategory) return 'Pick a category.';
      if (!formData.expenseDate) return 'Pick a date.';
    }
    if (step === 1) {
      if (!payers.length) return 'Choose who paid.';
      if (formData.isMultiplePaidBy && sumOf(payers, paidByAmounts) !== amount)
        return 'Paid amounts must add up to the total.';
    }
    if (step === 2) {
      if (!formData.expenseSplitWith.length)
        return 'Choose at least one person to split with.';
      if (
        splitMode === 'custom' &&
        sumOf(formData.expenseSplitWith, splitAmounts) !== amount
      )
        return 'Shares must add up to the total.';
    }
    return null;
  };

  const goNext = () => {
    const error = validateStep(currentStepIndex);
    setStepError(error);
    if (!error) {
      next();
    }
  };

  const goToStep = (step: number) => {
    // Only allow jumping forward once every step before it is valid.
    for (let i = 0; i < step; i++) {
      const error = validateStep(i);
      if (error) {
        setStepError(error);
        goTo(i);
        return;
      }
    }
    setStepError(null);
    goTo(step);
  };

  const togglePayer = (id: string) => {
    if (!formData.isMultiplePaidBy) {
      update({ paidBy: id });
      return;
    }
    const paidByList = formData.paidByList.includes(id)
      ? formData.paidByList.filter((payer) => payer !== id)
      : [...formData.paidByList, id];
    update({ paidByList, paidByAmounts: splitEvenly(amount, paidByList) });
  };

  const toggleSplitMember = (id: string) => {
    const expenseSplitWith = formData.expenseSplitWith.includes(id)
      ? formData.expenseSplitWith.filter((member) => member !== id)
      : [...formData.expenseSplitWith, id];
    update({
      expenseSplitWith,
      splitAmounts: splitEvenly(amount, expenseSplitWith),
    });
  };

  if (!group) {
    return null;
  }

  const category = constants.expensesCategories.find(
    (item) => item.key === formData.expenseCategory,
  );

  return (
    <form
      action={action}
      className="flex flex-col gap-6"
      onKeyDown={(e) => {
        // Enter advances instead of submitting until the review step.
        if (
          e.key === 'Enter' &&
          !isLastStep &&
          !(e.target instanceof HTMLTextAreaElement)
        ) {
          e.preventDefault();
          goNext();
        }
      }}
    >
      {/* Every value is submitted from here, whichever step is visible */}
      <div hidden>
        <input
          readOnly
          name="expense-category"
          value={formData.expenseCategory}
        />
        <input readOnly name="expense-name" value={formData.expenseName} />
        <input
          readOnly
          name="expense-description"
          value={formData.expenseDescription}
        />
        <input
          readOnly
          name="expense-date"
          value={
            formData.expenseDate
              ? format(formData.expenseDate, 'yyyy-MM-dd')
              : ''
          }
        />
        <input readOnly name="expense-amount" value={amount} />
        {formData.isMultiplePaidBy && (
          <input readOnly name="is-multiple-paid-by" value="on" />
        )}
        {payers.map((id) => (
          <input key={id} readOnly name="expense-paid-by" value={id} />
        ))}
        {formData.isMultiplePaidBy &&
          payers.map((id) => (
            <input
              key={id}
              readOnly
              name={`paid-amount-${id}`}
              value={paidByAmounts[id] ?? ''}
            />
          ))}
        {formData.expenseSplitWith.map((id) => (
          <input key={id} readOnly name="expense-split-with" value={id} />
        ))}
        {formData.expenseSplitWith.map((id) => (
          <input
            key={id}
            readOnly
            name={`split-amount-${id}`}
            value={splitAmounts[id] ?? ''}
          />
        ))}
      </div>

      {/* STEP INDICATOR */}
      <nav aria-label="Form progress" className="flex flex-col gap-3">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                disabled={index > furthestStepIndex}
                onClick={() => goToStep(index)}
                aria-current={index === currentStepIndex ? 'step' : undefined}
                className="flex w-full flex-col gap-2 text-left disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    'h-1.5 w-full rounded-full bg-muted transition-colors',
                    index <= currentStepIndex && 'bg-primary',
                  )}
                />
                <span
                  className={cn(
                    'truncate text-xs font-medium text-muted-foreground',
                    index === currentStepIndex && 'text-foreground',
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {STEPS.length}
        </p>
      </nav>

      {/* STEP 1: DETAILS */}
      {currentStepIndex === 0 && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">How much was it?</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
                {currencySymbol}
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                autoFocus
                placeholder="0.00"
                className="h-16 pl-12 text-3xl font-bold md:text-3xl"
                value={formData.expenseAmount}
                onChange={(e) => {
                  const value = formatNumber(e.target.value);
                  const expenseAmount = Number.isNaN(value) ? '' : value;
                  update({
                    expenseAmount,
                    splitAmounts: splitEvenly(
                      expenseAmount || 0,
                      formData.expenseSplitWith,
                    ),
                    paidByAmounts: splitEvenly(
                      expenseAmount || 0,
                      formData.paidByList,
                    ),
                  });
                }}
              />
            </div>
            <FieldError messages={formState.errors.amount} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">What was it for?</Label>
            <Input
              id="name"
              placeholder="Groceries, dinner, rent…"
              value={formData.expenseName}
              onChange={(e) => update({ expenseName: e.target.value })}
            />
            <FieldError messages={formState.errors.name} />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <ExpenseCategorySelect
                value={formData.expenseCategory}
                onChange={(value) => update({ expenseCategory: value })}
              />
              <FieldError messages={formState.errors.category} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !formData.expenseDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expenseDate
                      ? format(formData.expenseDate, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expenseDate}
                    defaultMonth={formData.expenseDate}
                    onSelect={(date) => date && update({ expenseDate: date })}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FieldError messages={formState.errors.date} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Notes <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Weekly household groceries"
              className="resize-none"
              value={formData.expenseDescription}
              onChange={(e) => update({ expenseDescription: e.target.value })}
            />
            <FieldError messages={formState.errors.description} />
          </div>
        </section>
      )}

      {/* STEP 2: PAID BY */}
      {currentStepIndex === 1 && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Who paid?</h2>
            <p className="text-sm text-muted-foreground">
              {formData.isMultiplePaidBy
                ? 'Select everyone who chipped in, then enter how much each paid.'
                : `Pick the person who paid ${currencySymbol}${amount}.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="multiple-payers"
              checked={formData.isMultiplePaidBy}
              onCheckedChange={(checked) =>
                update({
                  isMultiplePaidBy: checked,
                  paidByList: checked
                    ? formData.paidBy
                      ? [formData.paidBy]
                      : []
                    : formData.paidByList,
                  paidByAmounts: checked
                    ? splitEvenly(
                        amount,
                        formData.paidBy ? [formData.paidBy] : [],
                      )
                    : formData.paidByAmounts,
                  paidBy: checked
                    ? formData.paidBy
                    : formData.paidByList[0] || formData.paidBy,
                })
              }
            />
            <Label htmlFor="multiple-payers">Multiple people paid</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <MemberChip
                key={member.user.id}
                member={member}
                isYou={member.user.id === currentUserId}
                selected={payers.includes(member.user.id)}
                onToggle={() => togglePayer(member.user.id)}
              />
            ))}
          </div>
          {formData.isMultiplePaidBy && payers.length > 0 && (
            <>
              <AmountRows
                members={membersById(payers)}
                amounts={paidByAmounts}
                currencySymbol={currencySymbol}
                label={(member) => `${memberName(member)} paid`}
                onChange={(id, value) =>
                  update({
                    paidByAmounts: { ...formData.paidByAmounts, [id]: value },
                  })
                }
              />
              <RemainingIndicator
                total={amount}
                assigned={sumOf(payers, paidByAmounts)}
                currencySymbol={currencySymbol}
              />
            </>
          )}
          <FieldError
            messages={[
              ...(formState.errors.paidBy || []),
              ...(formState.errors.paidByList || []),
              ...(formState.errors.paidByAmounts || []),
            ]}
          />
        </section>
      )}

      {/* STEP 3: SPLIT */}
      {currentStepIndex === 2 && (
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Split between</h2>
            <p className="text-sm text-muted-foreground">
              Choose who shares this expense and how.
            </p>
          </div>
          <div
            role="radiogroup"
            aria-label="Split mode"
            className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
          >
            {(['equal', 'custom'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={splitMode === mode}
                onClick={() => {
                  setSplitMode(mode);
                  update({ splitAmounts });
                }}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  splitMode === mode
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {mode === 'equal' ? 'Split equally' : 'Custom amounts'}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <MemberChip
                key={member.user.id}
                member={member}
                isYou={member.user.id === currentUserId}
                selected={formData.expenseSplitWith.includes(member.user.id)}
                onToggle={() => toggleSplitMember(member.user.id)}
              />
            ))}
          </div>
          {formData.expenseSplitWith.length > 0 &&
            (splitMode === 'equal' ? (
              <p className="rounded-md bg-muted/60 px-3 py-2 text-sm">
                {formData.expenseSplitWith.length === 1
                  ? 'One person covers the full amount.'
                  : `About ${currencySymbol}${formatNumber(
                      amount / formData.expenseSplitWith.length,
                    )} each across ${formData.expenseSplitWith.length} people.`}
              </p>
            ) : (
              <>
                <AmountRows
                  members={membersById(formData.expenseSplitWith)}
                  amounts={splitAmounts}
                  currencySymbol={currencySymbol}
                  label={memberName}
                  onChange={(id, value) =>
                    update({
                      splitAmounts: { ...formData.splitAmounts, [id]: value },
                    })
                  }
                />
                <RemainingIndicator
                  total={amount}
                  assigned={sumOf(formData.expenseSplitWith, splitAmounts)}
                  currencySymbol={currencySymbol}
                />
              </>
            ))}
          <FieldError
            messages={[
              ...(formState.errors.splitWith || []),
              ...(formState.errors.splitAmounts || []),
            ]}
          />
        </section>
      )}

      {/* STEP 4: REVIEW */}
      {currentStepIndex === 3 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-1 rounded-xl border bg-muted/40 px-4 py-6 text-center">
            {category && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <ExpenseCategoryIcon icon={category.icon} className="h-4 w-4" />
                {category.name}
              </span>
            )}
            <span className="text-4xl font-bold">
              {currencySymbol}
              {amount}
            </span>
            <span className="text-lg font-semibold wrap-break-word">
              {formData.expenseName}
            </span>
            {formData.expenseDate && (
              <span className="text-sm text-muted-foreground">
                {format(formData.expenseDate, 'PPP')}
              </span>
            )}
            {formData.expenseDescription && (
              <p className="mt-1 text-sm text-muted-foreground">
                {formData.expenseDescription}
              </p>
            )}
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => goTo(0)}
            >
              Edit details
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Paid by',
                step: 1,
                ids: payers,
                amounts: paidByAmounts,
              },
              {
                title: 'Split between',
                step: 2,
                ids: formData.expenseSplitWith,
                amounts: splitAmounts,
              },
            ].map((block) => (
              <div key={block.title} className="rounded-xl border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">{block.title}</h3>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => goTo(block.step)}
                  >
                    Edit
                  </Button>
                </div>
                <ul className="flex flex-col gap-2 text-sm">
                  {membersById(block.ids).map((member) => (
                    <li
                      key={member.user.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="truncate">{memberName(member)}</span>
                      <span className="font-medium whitespace-nowrap">
                        {currencySymbol}
                        {block.amounts[member.user.id] ?? 0}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <FieldError messages={formState.errors._form} />
        </section>
      )}

      {stepError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {stepError}
        </p>
      )}

      {/* NAVIGATION: pinned to the bottom of the screen on phones */}
      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t bg-background/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:flex-none"
          disabled={isFirstStep}
          onClick={() => {
            setStepError(null);
            back();
          }}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        {isLastStep ? (
          <FormButton className="flex-1">
            {isEditing ? 'Save changes' : 'Add expense'}
          </FormButton>
        ) : (
          <Button type="button" className="flex-1" onClick={goNext}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};

export default GroupExpenseForm;
