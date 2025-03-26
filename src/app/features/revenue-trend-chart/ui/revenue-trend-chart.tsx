'use client'

import { XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import type { InvoiceModel } from '~/entities/invoice/model/invoice.model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/shared/components/card/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/components/chart';
import { FormatterUtils } from '~/shared/utils/formatter';

const revenueChartConfig = {
  revenue: {
    color: 'hsl(var(--chart-1))',
  },
};

export function RevenueTrendChart({ invoices }: { invoices: InvoiceModel[] }) {
  const revenueData = invoices.map((invoice) => ({
    name: FormatterUtils.formatDate(invoice.dueDate!),
    revenue: invoice.details?.reduce((acc, detail) => acc + (detail.totalGrossPrice ?? 0), 0) ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Revenue trend over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig} className="h-80">
          <LineChart data={revenueData}>
            <XAxis 
              dataKey="name" 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value: number) => `$${value.toLocaleString()}`}
              tickLine={false}
              axisLine={false}
            />
            <CartesianGrid vertical={false} />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              }
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--color-revenue)" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}