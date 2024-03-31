'use client';
import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { GroupWithData } from '@/db/queries';
import { useState } from 'react';
import { useFormState } from 'react-dom';

type GroupExpenseFormProps = {
  group: GroupWithData;
};

const GroupExpenseForm = ({ group }: GroupExpenseFormProps) => {
  const [formState, action] = useFormState(
    actions.createGroupExpense.bind(null, group?.uuid || ''),
    {
      errors: {},
    },
  );

  const [formData, setFormData] = useState({
    expenseAmount: 0,
    expenseSplitWith: [] as string[],
    splitAmounts: {} as Record<string, number>,
  });

  const handleExpenseAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newExpenseAmount = parseFloat(event.target.value);
    const selectedUsers = formData.expenseSplitWith;
    const evenSplitAmount = (newExpenseAmount / selectedUsers.length).toFixed(
      2,
    );
    setFormData({
      ...formData,
      expenseAmount: parseFloat(newExpenseAmount.toFixed(2)),
      splitAmounts: selectedUsers.reduce(
        (acc, userId) => ({ ...acc, [userId]: parseFloat(evenSplitAmount) }),
        {} as Record<string, number>,
      ),
    });
  };

  const handleSplitWithChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      expenseSplitWith: Array.from(
        e.target.selectedOptions,
        (option) => option.value,
      ),
    });
    const selectedUsers = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    const totalExpense = formData.expenseAmount || 0;
    const evenSplitAmount = (totalExpense / selectedUsers.length).toFixed(2);
    setFormData({
      ...formData,
      expenseSplitWith: selectedUsers,
      splitAmounts: selectedUsers.reduce(
        (acc, userId) => ({ ...acc, [userId]: parseFloat(evenSplitAmount) }),
        {} as Record<string, number>,
      ),
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

  if (!group) {
    return null;
  }

  return (
    <div>
      <h2>Group Expense Form</h2>
      <form action={action}>
        <div>
          <label htmlFor="expense-name">Expense Name</label>
          <input
            type="text"
            id="expense-name"
            name="expense-name"
            placeholder="Enter Expense Name"
          />
          {formState.errors.name ? (
            <span>{formState.errors.name?.join(', ')}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="expense-description">Expense Description</label>
          <textarea
            id="expense-description"
            name="expense-description"
            placeholder="Enter Expense Description"
          ></textarea>
          {formState.errors.description ? (
            <span>{formState.errors.description?.join(', ')}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="expense-date">Expense Date</label>
          <input
            type="date"
            id="expense-date"
            name="expense-date"
            placeholder="Enter Expense Date"
          />
          {formState.errors.date ? (
            <span>{formState.errors.date?.join(', ')}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="expense-amount">Expense Amount</label>
          <input
            type="number"
            id="expense-amount"
            name="expense-amount"
            placeholder="Enter Expense Amount"
            value={formData.expenseAmount}
            onChange={handleExpenseAmountChange}
          />
          {formState.errors.amount ? (
            <span>{formState.errors.amount?.join(', ')}</span>
          ) : null}
        </div>
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
                    value={formData.splitAmounts[member.user.id] ?? ''}
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
    </div>
  );
};

export default GroupExpenseForm;
