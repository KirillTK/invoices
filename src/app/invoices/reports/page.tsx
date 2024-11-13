import { YearlyIncomeChart } from '~/features/yearly-income-chart';
import { InvoicesService } from '~/server/routes/invoices/invoices.route';

export default async function ReportsPage() {
  const invoices = await InvoicesService.getInvoiceList();
  
  return (
    <>
      <YearlyIncomeChart invoices={invoices} />
    </>
  );
}
