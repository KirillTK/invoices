import type { InvoiceModelWithClientAndDetails } from '~/entities/invoice/model/invoice.model';
import { InvoiceCountChart } from '~/features/invoice-count-chart';
import { RevenueByClientChart } from '~/features/revenue-by-client-chart';
import { RevenueChart } from '~/features/revenue-chart';
import { RevenueTrendChart } from '~/features/revenue-trend-chart';
import { TopClientsChart } from '~/features/top-clients-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/shared/components/tabs';

export function DashboardCharts({ invoices }: { invoices: InvoiceModelWithClientAndDetails[] }) {
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
          <div className="grid grid-cols-1">
            <InvoiceCountChart invoices={invoices} />
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <div className="grid g  rid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueByClientChart invoices={invoices} />
            <TopClientsChart invoices={invoices} />
          </div>
        </TabsContent>
      </Tabs>
  );
}
