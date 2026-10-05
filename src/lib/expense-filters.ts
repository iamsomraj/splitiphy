export type ExpenseFilters = {
  q?: string;
  category?: string;
  from?: string;
  to?: string;
};

type FilterableGroupExpense = {
  expense: {
    name: string;
    description: string;
    category: string | null;
    date: Date;
  };
};

const startOfDay = (value: string) => new Date(`${value}T00:00:00`);
const endOfDay = (value: string) => new Date(`${value}T23:59:59.999`);
const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

export const hasActiveFilters = (filters: ExpenseFilters) =>
  Boolean(filters.q || filters.category || filters.from || filters.to);

/** Narrows a group's expenses by text, category and an inclusive date range. */
export function filterGroupExpenses<T extends FilterableGroupExpense>(
  groupExpenses: T[],
  filters: ExpenseFilters,
): T[] {
  const query = filters.q?.trim().toLowerCase();
  const from = filters.from ? startOfDay(filters.from) : null;
  const to = filters.to ? endOfDay(filters.to) : null;

  return groupExpenses.filter(({ expense }) => {
    if (
      query &&
      !expense.name.toLowerCase().includes(query) &&
      !expense.description.toLowerCase().includes(query)
    ) {
      return false;
    }
    if (filters.category && expense.category !== filters.category) {
      return false;
    }
    if (from && isValidDate(from) && expense.date < from) {
      return false;
    }
    if (to && isValidDate(to) && expense.date > to) {
      return false;
    }
    return true;
  });
}
