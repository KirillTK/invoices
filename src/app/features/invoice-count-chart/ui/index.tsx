'use client'

import { XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import type { InvoiceModel } from '~/entities/invoice/model/invoice.model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/shared/components/card/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/components/chart';
import { groupInvoicesByMonth } from '../helper';

const invoiceCountChartConfig = {
  count: {
    color: 'hsl(var(--chart-1))',
  },
};

export function InvoiceCountChart({ invoices }: { invoices: InvoiceModel[] }) {
  const invoicesByMonth = groupInvoicesByMonth(invoices);

  const chartData = Object.entries(invoicesByMonth).map(([month, count]) => ({
    name: month,
    count: count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Count</CardTitle>
        <CardDescription>Number of invoices per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={invoiceCountChartConfig} className="h-80 w-full">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value: number) => value.toLocaleString()}
              tickLine={false}
              axisLine={false}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => value.toLocaleString()}
                />
              }
            />
            <Bar 
              dataKey="count" 
              fill="var(--color-count)" 
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
