import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/shared/components/button";
import { TableEmpty } from '~/shared/components/table/table';

export function EmptyInvoiceItems() {
  return (
    <TableEmpty
      noItemsText="No invoice items"
      noItemsDescription="Get started by adding a new item to your invoice."
    >
      <Button>
        <Link href="/invoices/new" className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add invoice item
        </Link>
      </Button>
    </TableEmpty>
  );
}
