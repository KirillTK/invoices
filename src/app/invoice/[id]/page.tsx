import { InvoicesService } from "~/server/api/invoices";
import { InvoiceForm, type InvoiceFormValues } from "~/widgets/invoice-form";

type Props = { params: { id: string } };

export default async function Invoice({ params }: Props) {
  const invoice = await InvoicesService.getInvoice(params.id);

  if (!invoice) return <div>No invoice found</div>;

  const defaultFormValues: InvoiceFormValues = {
    invoice: {
      invoiceNo: invoice.invoice.invoiceNo,
      dueDate: new Date(invoice.invoice.dueDate!),
      invoiceDate: new Date(invoice.invoice.invoiceDate!),
      vatInvoice: invoice.invoice.vatInvoice!,
      userName: invoice.invoice.userName,
      userAddress: invoice.invoice.userAddress!,
      userNip: invoice.invoice.userNip!,
      clientId: invoice.invoice.clientId,
      clientAddress: invoice.invoice.clientAddress!,
      clientNip: invoice.invoice.clientNip!,
    },
    details: invoice.details.map((detail) => ({
      description: detail.description,
      unit: detail.unit,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
      totalNetPrice: detail.totalNetPrice ?? 0,
      totalGrossPrice: detail.totalGrossPrice ?? 0,
      vat: detail.vat ?? 0,
      vatAmount: detail.vatAmount ?? 0,
    })),
  };

  return (
    <div>
      <InvoiceForm defaultValues={defaultFormValues} />
    </div>
  );
}
