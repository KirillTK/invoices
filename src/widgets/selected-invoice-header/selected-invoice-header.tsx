import { InvoiceButton } from "~/features/invoice-button";
import { InvoiceHeader } from "~/features/invoice-header";
import { InvoicesService } from "~/server/api/invoices";
import { DOM_ID } from "~/shared/constants/dom-id.const";

interface Props {
  invoiceId: string;
}

export async function SelectedInvoiceHeader({ invoiceId }: Props) {
  const invoice = await InvoicesService.getInvoiceNameById(invoiceId);

  return (
    <InvoiceHeader title={`Invoice ${invoice?.invoiceNo ?? ""}`}>
      <>
        <InvoiceButton action={DOM_ID.EDIT_INVOICE} title="Edit Invoice" />
        <InvoiceButton action={DOM_ID.SAVE_NEW_INVOICE} title="Save Invoice" />
      </>
    </InvoiceHeader>
  );
}
