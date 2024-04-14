import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import * as React from 'react';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type MultiSelectProps = {
  placeholder: string;
  options: Option[];
  value: string[];
  onChange: (selectedValues: string[]) => void;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value);

  const handleCheckedChange = (newValue: boolean, optionValue: string) => {
    let updatedSelectedValues: string[];

    if (newValue) {
      updatedSelectedValues = [...selectedValues, optionValue];
    } else {
      updatedSelectedValues = selectedValues.filter(
        (val) => val !== optionValue,
      );
    }

    setSelectedValues(updatedSelectedValues);
    onChange(updatedSelectedValues);
  };

  const selectedLabels = selectedValues
    .map((val) => options.find((option) => option.value === val)?.label)
    .filter(Boolean)
    .join(', ');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span
            className={cn(
              'w-full text-left',
              selectedValues.length === 0 && 'text-muted-foreground',
            )}
          >
            {selectedValues.length ? selectedLabels : placeholder}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(newValue) =>
              handleCheckedChange(newValue, option.value)
            }
            disabled={option.disabled}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
