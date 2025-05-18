'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import type { InvoiceModelWithClientAndDetails } from '~/entities/invoice/model/invoice.model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/shared/components/card/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/components/chart';
import { groupRevenueByClient } from '../helper';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
];

const revenueByClientChartConfig = {
  revenue: {
    color: 'hsl(var(--chart-1))',
  },
};

export function RevenueByClientChart({ invoices }: { invoices: InvoiceModelWithClientAndDetails[] }) {
  const revenueByClient = groupRevenueByClient(invoices);

  const chartData = Object.entries(revenueByClient)
    .map(([client, revenue]) => ({
      name: client,
      value: revenue,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Client</CardTitle>
        <CardDescription>Distribution of revenue across clients</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueByClientChartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
