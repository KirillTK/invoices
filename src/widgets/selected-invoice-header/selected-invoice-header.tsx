import { InvoiceHeader } from "~/features/invoice-header";
import { SaveInvoiceButton } from "~/features/save-invoice-button/save-invoice-header";

export function SelectedInvoiceHeader() {
  return (
    <InvoiceHeader title="Invoice No">
      <SaveInvoiceButton />
    </InvoiceHeader>
  );
}
