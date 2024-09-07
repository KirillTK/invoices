import { InvoiceButton } from '~/features/invoice-button';
import { InvoicesService } from '~/server/api/invoices';
import { DOM_ID } from '~/shared/constants/dom-id.const';

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

export default async function SelectedInvoiceLayout({ children, params }: Props) {
  const invoice = await InvoicesService.getInvoiceNameById(params.id);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice?.invoiceNo ?? ""}</h1>
        <InvoiceButton action={DOM_ID.EDIT_INVOICE} title="Edit Invoice" />
      </div>
      {children}
    </div>
  );
}
