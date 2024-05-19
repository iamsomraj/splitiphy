'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={expenses}>
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
