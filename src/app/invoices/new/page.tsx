'use client';
import { useInvoiceMutations } from '~/entities/invoice/model/api';
import { InvoiceButton } from '~/features/invoice-button';
import { toast } from '~/shared/components/toast/use-toast';
import { DOM_ID } from '~/shared/constants/dom-id.const';
import { InvoiceForm, type InvoiceFormValues } from "~/widgets/invoice-form";

export default function CreateNewInvoicePage() {
  const { createInvoice } = useInvoiceMutations();

  const handleSubmit = async (values: InvoiceFormValues) => {
    const response = await createInvoice.mutateAsync(values);

    if(response?.ok) {
      toast({ title: "Invoice successfully saved!", variant: "success" });
    }

    return response;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6 p-4 pb-0">
        <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
        <InvoiceButton action={DOM_ID.SAVE_NEW_INVOICE} title="Save Invoice" />
      </div>
      <InvoiceForm submit={handleSubmit} />
    </section>
  );
}
