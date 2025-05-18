'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import type { InvoiceModelWithClientAndDetails } from '~/entities/invoice/model/invoice.model';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/shared/components/card/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/components/chart';
import { getCountInvoicesByClient } from '../helper';

const topClientsChartConfig = {
  clients: {
    color: 'hsl(var(--chart-3))',
  },
};



export function TopClientsChart({ invoices }: { invoices: InvoiceModelWithClientAndDetails[] }) {
  const invoicesByClient = getCountInvoicesByClient(invoices);

  const chartData = Object.entries(invoicesByClient)
    .map(([client, count]) => ({
      name: client,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Limit to top 10 clients

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Clients</CardTitle>
        <CardDescription>Clients by invoice volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={topClientsChartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
