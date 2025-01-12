import { auth } from '@clerk/nextjs/server';
import { PlusIcon } from 'lucide-react';
import Link from "next/link";
import { InvoicesTable } from "~/features/invoices-table";
import { InvoicesService } from '~/server/routes/invoices/invoices.route';
import { Button } from "~/shared/components/button";

export default async function InvoicesPage() {
  const user = await auth();
  const invoices = await InvoicesService.getInvoiceList(user.userId!);
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
        <Button>
            <Link href="/invoices/new" className="flex"><PlusIcon className="mr-2 h-4 w-4" />New Invoice</Link>
        </Button>
      </div>
      <InvoicesTable invoices={invoices} />
    </>
  );
}
