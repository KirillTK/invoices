import { auth } from "@clerk/nextjs/server";
import { InvoicesTable } from "~/features/invoices-table";

export default function InvoicesPage() {
  const user = auth();

  return (
    <>
      <InvoicesTable />
    </>
  );
}
