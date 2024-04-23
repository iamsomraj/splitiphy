'use client';
import * as actions from '@/actions';
import FormButton from '@/components/shared/form-button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoggedInUser } from '@/db/queries';
import constants from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import { useFormState } from 'react-dom';

type UserSettingsFormProps = {
  user: LoggedInUser;
};

export default function UserSettingsForm(props: UserSettingsFormProps) {
  const hiddenCurrencyRef = useRef<HTMLSelectElement>(null);
  const [formState, action] = useFormState(actions.updateUserSettings, {
    errors: {},
  });

  const handleCurrencyChange = (value: string) => {
    if (!hiddenCurrencyRef.current) {
      return;
    }
    hiddenCurrencyRef.current.value = value;
  };

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="currency"
          className={cn({
            'text-destructive': Boolean(formState?.errors?.currency || false),
          })}
        >
          Currency
        </Label>
        <Select
          name="currency"
          onValueChange={handleCurrencyChange}
          defaultValue={props.user?.currency || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {constants.currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} {currency.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <select
          ref={hiddenCurrencyRef}
          id="currency"
          className="hidden"
          name="currency"
        >
          {constants.currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code}
            </option>
          ))}
        </select>
        <div className="text-sm text-muted-foreground">
          This is the currency you will see on your groups and dashboard
        </div>
        {formState?.errors?.currency ? (
          <span className="text-sm font-medium text-destructive">
            {formState?.errors?.currency?.join(', ')}
          </span>
        ) : null}
      </div>
      {formState?.errors?._form ? (
        <span className="text-sm font-medium text-destructive">
          {formState?.errors?._form?.join(', ')}
        </span>
      ) : null}
      <FormButton>Save</FormButton>
    </form>
  );
}
