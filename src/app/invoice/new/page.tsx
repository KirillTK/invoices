import { CreateInvoiceHeader } from "~/features/create-invoice-header";
import { InvoiceForm } from "~/widgets/invoice-form";

import { Separator } from "~/shared/components/separator";

export default function CreateNewInvoicePage() {
  return (
    <section>
      <CreateInvoiceHeader />
      <Separator className="my-4" />
      <InvoiceForm />
    </section>
  );
}
