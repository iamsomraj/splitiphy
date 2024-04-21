import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import constants from '@/lib/constants';
import { cn } from '@/lib/utils';
import * as RadixIcons from '@radix-ui/react-icons';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export const CategoryIcon = ({ icon }: { icon: string }) => {
  const Icon = (RadixIcons?.[icon as keyof typeof RadixIcons] ||
    null) as React.ElementType;
  if (!Icon) {
    return <RadixIcons.MagicWandIcon className="mr-2 h-4 w-4" />;
  }
  return <Icon className="mr-2 h-4 w-4" />;
};

interface ExpenseCategorySelect {
  value: string;
  onChange: (value: string) => void;
}

export const ExpenseCategorySelect = ({
  value,
  onChange,
}: ExpenseCategorySelect) => {
  const options = constants.expensesCategories.map((category) => ({
    label: category.name,
    value: category.key,
    icon: category.icon,
  }));
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue === value ? '' : selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <CategoryIcon
                icon={
                  constants.expensesCategories.find(
                    (category) => category.key === value,
                  )?.icon || constants.expenseCategoryIcons.MAGIC_WAND_ICON
                }
              />
              {options.find((option) => option.value === value)?.label}
            </span>
          ) : (
            'Select a category'
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={search}
            onValueChange={(value) => setSearch(value)}
          />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            <CommandList className="scrollbar-none">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <CategoryIcon icon={option.icon} />
                  {option.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
