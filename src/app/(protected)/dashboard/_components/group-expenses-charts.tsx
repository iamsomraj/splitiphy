'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import constants from '@/lib/constants';
const { monthNameMap, monthIndexMap } = constants;

type GroupExpensesChartsProps = {
  expenses: {
    name: string;
    expense: number;
  }[];
} & React.HTMLAttributes<HTMLDivElement>;

export default function GroupExpensesCharts({
  expenses,
  ...props
}: GroupExpensesChartsProps) {
  const [filter, setFilter] = useState('last-year');

  const filteredExpenses = expenses.filter((expense) => {
    const monthIndex =
      monthNameMap[expense.name.slice(0, 3) as keyof typeof monthNameMap];

    if (filter === 'current-month') {
      return monthIndex >= new Date().getMonth();
    }

    if (filter === 'last-3-months') {
      return monthIndex >= new Date().getMonth() - 2;
    }

    if (filter === 'last-year') {
      return monthIndex >= new Date().getMonth() - 11;
    }

    return true;
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>Expenses</div>
          <div className="w-1/2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {[
                  {
                    label: 'From this month',
                    value: 'current-month',
                  },
                  {
                    label: 'From last 3 months',
                    value: 'last-3-months',
                  },
                  {
                    label: 'This year',
                    value: 'last-year',
                  },
                ].map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={filteredExpenses}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                return Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(value);
              }}
            />
            <Line
              dataKey="expense"
              fill="currentColor"
              className="fill-primary"
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
