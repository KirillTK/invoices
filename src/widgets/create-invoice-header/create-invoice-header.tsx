import { SaveInvoiceButton } from "~/features/save-invoice-button";
import { InvoiceHeader } from "~/features/invoice-header";

export function CreateInvoiceHeader() {
  return (
    <InvoiceHeader title="Create Invoice">
      <SaveInvoiceButton />
    </InvoiceHeader>
  );
}
