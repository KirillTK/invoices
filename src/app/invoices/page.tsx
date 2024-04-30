import Link from "next/link";
import { InvoicesTable } from "~/features/invoices-table";
import { Button } from "~/shared/components/button";

export default function InvoicesPage() {
  return (
    <>
      <Button asChild>
        <Link href="/invoice/new">Add Invoice</Link>
      </Button>
      <InvoicesTable />
    </>
  );
}
