import { InvoiceButton } from '~/features/invoice-button';
import { DOM_ID } from '~/shared/constants/dom-id.const';
import { InvoiceForm } from "~/widgets/invoice-form";

export default function CreateNewInvoicePage() {
  return (
    <section>
      <div className="flex justify-between items-center mb-6 p-4 pb-0">
        <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
        <InvoiceButton action={DOM_ID.SAVE_NEW_INVOICE} title="Save Invoice" />
      </div>
      <InvoiceForm />
    </section>
  );
}