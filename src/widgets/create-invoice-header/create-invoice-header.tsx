import { InvoiceButton } from "~/features/invoice-button";
import { InvoiceHeader } from "~/features/invoice-header";
import { DOM_ID } from "~/shared/constants/dom-id.const";

export function CreateInvoiceHeader() {
  return (
    <InvoiceHeader title="Create Invoice">
      <InvoiceButton action={DOM_ID.SAVE_NEW_INVOICE} title="Save Invoice" />
    </InvoiceHeader>
  );
}
