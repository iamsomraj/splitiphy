'use client';

import { ExpenseCategorySelect } from '@/components/shared/expense-category-select';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import useMediaQuery from '@/hooks/use-media-query';
import constants from '@/lib/constants';
import { ExpenseFilters } from '@/lib/expense-filters';
import { cn } from '@/lib/utils';
import {
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type GroupExpenseFiltersProps = {
  className?: string;
};

type DateRange = Pick<ExpenseFilters, 'from' | 'to'>;

const SEARCH_DEBOUNCE_MS = 300;
const ISO_DAY = 'yyyy-MM-dd';

const toDay = (date: Date) => format(date, ISO_DAY);

/** Quick ranges, computed on render so "this month" is always current. */
const datePresets = (): { label: string; range: DateRange }[] => {
  const today = new Date();
  const lastMonth = subMonths(today, 1);
  return [
    {
      label: 'This month',
      range: { from: toDay(startOfMonth(today)), to: toDay(endOfMonth(today)) },
    },
    {
      label: 'Last month',
      range: {
        from: toDay(startOfMonth(lastMonth)),
        to: toDay(endOfMonth(lastMonth)),
      },
    },
    {
      label: '30 days',
      range: { from: toDay(subDays(today, 29)), to: toDay(today) },
    },
    { label: 'All time', range: { from: '', to: '' } },
  ];
};

const describeRange = ({ from, to }: DateRange) => {
  const preset = datePresets().find(
    ({ range }) => (from || to) && range.from === from && range.to === to,
  );
  if (preset) {
    return preset.label;
  }
  const day = (value: string) => format(parseISO(value), 'd MMM');
  if (from && to) return `${day(from)} – ${day(to)}`;
  if (from) return `From ${day(from)}`;
  return `Until ${day(to || '')}`;
};

type FilterPanelProps = {
  filters: ExpenseFilters;
  onChange: (updates: Partial<ExpenseFilters>) => void;
  onClear: () => void;
  onDone: () => void;
};

const FilterPanel = ({
  filters,
  onChange,
  onClear,
  onDone,
}: FilterPanelProps) => (
  <div className="flex flex-col gap-5">
    <div className="flex flex-col gap-2">
      <Label>Category</Label>
      <ExpenseCategorySelect
        value={filters.category || ''}
        onChange={(value) => onChange({ category: value })}
      />
    </div>
    <div className="flex flex-col gap-3">
      <Label>Date</Label>
      <div className="grid grid-cols-4 gap-1.5">
        {datePresets().map(({ label, range }) => {
          const selected =
            range.from === (filters.from || '') &&
            range.to === (filters.to || '');
          return (
            <Button
              key={label}
              type="button"
              size="sm"
              variant={selected ? 'default' : 'outline'}
              className="h-8 rounded-full px-1 text-xs"
              onClick={() => onChange(range)}
            >
              {label}
            </Button>
          );
        })}
      </div>
      <div className="rounded-2xl border">
        <p className="border-b px-4 py-2.5 text-sm text-muted-foreground">
          {filters.from || filters.to
            ? describeRange(filters)
            : 'Tap a start day, then an end day'}
        </p>
        <Calendar
          mode="range"
          className="mx-auto"
          defaultMonth={filters.from ? parseISO(filters.from) : undefined}
          selected={{
            from: filters.from ? parseISO(filters.from) : undefined,
            to: filters.to ? parseISO(filters.to) : undefined,
          }}
          onSelect={(range) =>
            onChange({
              from: range?.from ? toDay(range.from) : '',
              to: range?.to ? toDay(range.to) : '',
            })
          }
          classNames={{
            day: 'relative size-10 p-0 text-center text-sm sm:size-9',
            day_button: cn(
              buttonVariants({ variant: 'ghost' }),
              'size-10 rounded-full p-0 font-normal sm:size-9',
            ),
            weekday:
              'w-10 text-[0.8rem] font-normal text-muted-foreground sm:w-9',
            // Continuous emerald band between the two ends of the range
            selected: 'bg-accent text-accent-foreground',
            range_start:
              'rounded-l-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
            range_end:
              'rounded-r-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary',
            range_middle: '[&>button]:hover:bg-transparent',
          }}
        />
      </div>
    </div>
    <div className="sticky bottom-0 -mb-1 flex gap-2 bg-background pt-2 pb-1">
      <Button
        type="button"
        variant="ghost"
        className="flex-1"
        onClick={onClear}
      >
        Clear all
      </Button>
      <Button type="button" className="flex-1" onClick={onDone}>
        Done
      </Button>
    </div>
  </div>
);

const GroupExpenseFilters = ({ className }: GroupExpenseFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const filters: ExpenseFilters = {
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
  };

  const [query, setQuery] = useState(filters.q || '');

  const updateFilters = (updates: Partial<ExpenseFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  };

  // Debounce free-text search so we don't navigate on every keystroke.
  useEffect(() => {
    if (query === (searchParams.get('q') || '')) {
      return;
    }
    const timeout = setTimeout(
      () => updateFilters({ q: query.trim() }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const clearFilters = () => {
    setQuery('');
    updateFilters({ q: '', category: '', from: '', to: '' });
  };

  const panelFilterCount =
    (filters.category ? 1 : 0) + (filters.from || filters.to ? 1 : 0);

  const chips = [
    filters.q && {
      key: 'q',
      label: `“${filters.q}”`,
      clear: () => {
        setQuery('');
        updateFilters({ q: '' });
      },
    },
    filters.category && {
      key: 'category',
      label:
        constants.expensesCategories.find(
          (category) => category.key === filters.category,
        )?.name || 'Category',
      clear: () => updateFilters({ category: '' }),
    },
    (filters.from || filters.to) && {
      key: 'date',
      label: describeRange(filters),
      clear: () => updateFilters({ from: '', to: '' }),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className="relative shrink-0 gap-2 px-3"
      aria-label="Filters"
    >
      <SlidersHorizontal className="h-4 w-4" />
      <span className="hidden sm:inline">Filters</span>
      {panelFilterCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {panelFilterCount}
        </span>
      )}
    </Button>
  );

  const panel = (
    <FilterPanel
      filters={filters}
      onChange={updateFilters}
      onClear={clearFilters}
      onDone={() => setPanelOpen(false)}
    />
  );

  return (
    <div
      className={cn('flex flex-col gap-3', pending && 'opacity-70', className)}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search expenses"
            placeholder="Search expenses"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {isDesktop ? (
          <Popover open={panelOpen} onOpenChange={setPanelOpen}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
              align="end"
              className="max-h-(--radix-popover-content-available-height) w-96 overflow-y-auto rounded-2xl bg-background p-5"
            >
              {panel}
            </PopoverContent>
          </Popover>
        ) : (
          <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent
              side="bottom"
              aria-describedby={undefined}
              className="max-h-[85dvh] overflow-y-auto rounded-t-3xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            >
              <div className="mx-auto -mt-2 mb-2 h-1.5 w-10 rounded-full bg-muted" />
              <SheetHeader className="mb-2 text-left">
                <SheetTitle>Filter expenses</SheetTitle>
              </SheetHeader>
              {panel}
            </SheetContent>
          </Sheet>
        )}
      </div>
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="flex items-center gap-1 rounded-full bg-accent py-1 pr-2 pl-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/70"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          {chips.length > 1 && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupExpenseFilters;
