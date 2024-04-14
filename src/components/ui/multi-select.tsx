import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="w-full text-left text-muted-foreground">
            {placeholder}
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
