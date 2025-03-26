import type { InvoiceModel } from '~/entities/invoice/model/invoice.model';
import { RevenueChart } from '~/features/revenue-chart';
import { RevenueTrendChart } from '~/features/revenue-trend-chart';
import { CardContent } from '~/shared/components/card/card';

import { Card, CardDescription, CardHeader, CardTitle } from '~/shared/components/card/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/shared/components/tabs';

export function DashboardCharts({ invoices }: { invoices: InvoiceModel[] }) {
  return (
    <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart invoices={invoices} />
            <RevenueTrendChart invoices={invoices} />
          </div>
        </TabsContent>
        
        <TabsContent value="invoices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Count</CardTitle>
                <CardDescription>Number of invoices per month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">Chart removed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status</CardTitle>
                <CardDescription>Distribution of invoice status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full">Chart removed</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Client</CardTitle>
                <CardDescription>Distribution of revenue across clients</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">Chart removed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Clients</CardTitle>
                <CardDescription>Clients by invoice volume</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">Chart removed</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
  );
}
