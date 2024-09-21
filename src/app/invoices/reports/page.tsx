import { YearlyIncomeChart } from '~/features/yearly-income-chart';
import { InvoicesService } from '~/server/api/invoices';

export default async function ReportsPage() {
  const invoices = await InvoicesService.getInvoiceList();
  
  return (
    <>
      <YearlyIncomeChart invoices={invoices} />
    </>
  );
}
