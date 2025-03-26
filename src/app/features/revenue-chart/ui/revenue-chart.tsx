
'use client'
import { XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import type { InvoiceModel } from '~/entities/invoice/model/invoice.model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/shared/components/card/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/components/chart';
import { FormatterUtils } from '~/shared/utils/formatter';

const revenueChartConfig = {
  revenue: {
    color: 'hsl(var(--chart-1))',
  },
};

export function RevenueChart({ invoices }: { invoices: InvoiceModel[] }) {
  const chartData = invoices.map((invoice) => ({
    name: FormatterUtils.formatDate(invoice.dueDate!),
    revenue: invoice.details.reduce((acc, detail) => acc + (detail.totalGrossPrice ?? 0), 0),
  }));


  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Revenue generated per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig} className="h-80">
          <BarChart data={chartData}>
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
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}