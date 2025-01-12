import { auth } from '@clerk/nextjs/server';
import { YearlyIncomeChart } from '~/features/yearly-income-chart';
import { InvoicesService } from '~/server/routes/invoices/invoices.route';

export default async function ReportsPage() {
  const user = await auth();
  const invoices = await InvoicesService.getInvoiceList(user.userId!);
  
  return (
    <>
      <YearlyIncomeChart invoices={invoices} />
    </>
  );
}
