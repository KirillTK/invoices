import { currentUser } from '@clerk/nextjs/server';
import { DashboardFilters } from '~/features/dashboard-filters';
import { StatisticCard } from '~/features/statistic-card';
import { ClientsService } from '~/server/routes/clients/clients.route';
import { DashboardCharts } from '~/widgets/dashboard-charts';
import type { Option } from '~/shared/types/form';
import { getDashboardChangesInPastYear, getDashboardInvoices } from '~/server/actions/dashboard.actions';
import { CURRENCY } from '~/shared/constants/currency.const';
import { FormatterUtils } from '~/shared/utils/formatter';

interface DashboardFiltersProps {
  searchParams: Promise<Partial<DashboardFilters>>
}

// Chart colors
const CHART_COLORS = {
  blue: 'rgba(59, 130, 246, 0.8)',
  blueLight: 'rgba(59, 130, 246, 0.2)',
  green: 'rgba(16, 185, 129, 0.8)',
  greenLight: 'rgba(16, 185, 129, 0.2)',
  purple: 'rgba(139, 92, 246, 0.8)',
  purpleLight: 'rgba(139, 92, 246, 0.2)',
  orange: 'rgba(249, 115, 22, 0.8)',
  orangeLight: 'rgba(249, 115, 22, 0.2)',
  red: 'rgba(239, 68, 68, 0.8)',
  redLight: 'rgba(239, 68, 68, 0.2)',
}

const PIE_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.red,
]

export default async function StatisticsDashboard({ searchParams }: DashboardFiltersProps) {
  const user = await currentUser();

  const { clientId, timePeriod } = await searchParams;

  if(!user?.id) {
    return <div>Unauthorized</div>;
  }

  const clients = await ClientsService.getClients(user.id, '');
  const { 
    invoicesCount, 
    totalRevenue, 
    averageInvoiceValue, 
    outstandingAmount,
    invoices,
  } = await getDashboardInvoices(user.id, clientId, timePeriod);
  
  const { 
    totalRevenue: totalRevenuePastYear, 
    invoicesCount: invoicesCountPastYear, 
    averageInvoiceValue: averageInvoiceValuePastYear, 
    outstandingAmount: outstandingAmountPastYear 
  } = await getDashboardChangesInPastYear(user.id);
  
  const clientsOptions: Option<string>[] = [
    { label: "All Clients", value: "all" },
    ...clients.map((client) => ({
      label: client.name,
      value: client.id,
    }))
  ];



  const summaryData = {
    totalRevenue: totalRevenue,
    invoicesIssued: invoicesCount,
    averageInvoiceValue: averageInvoiceValue,
    outstandingAmount: outstandingAmount,
    revenueChange: FormatterUtils.formatNumber(totalRevenue / totalRevenuePastYear),
    invoicesChange: FormatterUtils.formatNumber(invoicesCount / invoicesCountPastYear),
    averageChange: FormatterUtils.formatNumber(averageInvoiceValue / averageInvoiceValuePastYear),
    outstandingChange: FormatterUtils.formatNumber(outstandingAmount / outstandingAmountPastYear),
  };

  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Invoice Statistics</h1>
      </div>
      <DashboardFilters clientsOptions={clientsOptions} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatisticCard title="Total Revenue" value={summaryData.totalRevenue} change={summaryData.revenueChange} currency={CURRENCY.USD} />
        <StatisticCard title="Invoices Issued" value={summaryData.invoicesIssued} change={summaryData.invoicesChange} currency={undefined} />
        <StatisticCard title="Average Invoice Value" value={summaryData.averageInvoiceValue} change={summaryData.averageChange} currency={CURRENCY.USD} />
        <StatisticCard title="Outstanding Amount" value={summaryData.outstandingAmount} change={summaryData.outstandingChange} currency={CURRENCY.USD} />
      </div>
      
      <DashboardCharts invoices={invoices} />
    </div>
  )
}