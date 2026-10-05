'use client';

import { ExpenseCategorySelect } from '@/components/shared/expense-category-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExpenseFilters, hasActiveFilters } from '@/lib/expense-filters';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type GroupExpenseFiltersProps = {
  className?: string;
};

const SEARCH_DEBOUNCE_MS = 300;

const GroupExpenseFilters = ({ className }: GroupExpenseFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

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

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end',
        pending && 'opacity-70',
        className,
      )}
    >
      <div className="flex flex-col gap-2 lg:col-span-2">
        <Label htmlFor="expense-search">Search</Label>
        <Input
          id="expense-search"
          type="search"
          placeholder="Search by name or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Category</Label>
        <ExpenseCategorySelect
          value={filters.category || ''}
          onChange={(value) => updateFilters({ category: value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="expense-from">From</Label>
        <Input
          id="expense-from"
          type="date"
          value={filters.from}
          max={filters.to || undefined}
          onChange={(e) => updateFilters({ from: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="expense-to">To</Label>
        <div className="flex gap-2">
          <Input
            id="expense-to"
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => updateFilters({ to: e.target.value })}
          />
          {hasActiveFilters(filters) && (
            <Button variant="ghost" type="button" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupExpenseFilters;
