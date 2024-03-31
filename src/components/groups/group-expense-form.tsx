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
  const [_formState, action] = useFormState(actions.createGroupExpense, {
    errors: {},
  });

  const [formData, setFormData] = useState({
    expenseSplitWith: [] as string[],
    splitType: 'amount' as 'amount' | 'percentage',
    splitAmounts: {} as Record<string, number>,
  });

  const splitAmountPlaceholder = {
    amount: 'Enter Split Amount',
    percentage: 'Enter Split Percentage',
  };

  const handleSplitTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      splitType: event.target.value as 'amount' | 'percentage',
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
        [userId]: parseFloat(e.target.value),
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
        </div>

        <div>
          <label htmlFor="expense-description">Expense Description</label>
          <textarea
            id="expense-description"
            name="expense-description"
            placeholder="Enter Expense Description"
          ></textarea>
        </div>
        {/* Expense Description */}

        {/* Expense Date */}
        <div>
          <label htmlFor="expense-date">Expense Date</label>
          <input
            type="date"
            id="expense-date"
            name="expense-date"
            placeholder="Enter Expense Date"
          />
        </div>

        <div>
          <label htmlFor="expense-amount">Expense Amount</label>
          <input
            type="number"
            id="expense-amount"
            name="expense-amount"
            placeholder="Enter Expense Amount"
          />
        </div>
        {/* Expense Amount */}

        {/* Expense Paid By Dropdown */}
        <div>
          <label htmlFor="expense-paid-by">Paid By</label>
          <select id="expense-paid-by" name="expense-paid-by">
            {group?.groupMemberships.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.firstName + ' ' + member.user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="expense-split-with">Split With</label>
          <select
            id="expense-split-with"
            name="expense-split-with"
            multiple
            size={group?.groupMemberships.length}
            value={formData.expenseSplitWith}
            onChange={(e) => {
              setFormData({
                ...formData,
                expenseSplitWith: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                ),
              });
            }}
          >
            {group?.groupMemberships.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.firstName + ' ' + member.user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="expense-split-type">Split Type</label>
          <div>
            <input
              type="radio"
              id="split-by-amount"
              name="split-type"
              value="amount"
              checked={formData.splitType === 'amount'}
              onChange={handleSplitTypeChange}
            />
            <label htmlFor="split-by-amount">Amount</label>
            <input
              type="radio"
              id="split-by-percentage"
              name="split-type"
              value="percentage"
              checked={formData.splitType === 'percentage'}
              onChange={handleSplitTypeChange}
            />
            <label htmlFor="split-by-percentage">Percentage</label>
          </div>
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
                    placeholder={splitAmountPlaceholder[formData.splitType]}
                    value={formData.splitAmounts[member.user.id] ?? ''}
                    onChange={(e) => handleSplitAmountChange(e, member.user.id)}
                  />
                </div>
              );
            })}
            <div></div>
          </div>
        </div>

        <FormButton>Create Expense</FormButton>
      </form>
    </div>
  );
};

export default GroupExpenseForm;
