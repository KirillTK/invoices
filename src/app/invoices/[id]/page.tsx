'use client';
import { FileDown, Loader2, Trash2 } from 'lucide-react';
import { Button } from '~/shared/components/button';
import { InvoiceForm, type InvoiceFormValues } from "~/widgets/invoice-form";
import { useInvoiceMutations, useInvoiceQuery } from '~/entities/invoice/api';
import { InvoiceSkeleton } from '~/features/invoice-skeleton';
import InvoiceNotFound from './not-found';

type Props = { params: { id: string } };

export default function Invoice({ params }: Props) {
  const { invoice, isLoading, error } = useInvoiceQuery(params.id);
  const { downloadPdf, isLoading: isDownloadingPdf } = useInvoiceMutations(params.id);

  if(isLoading) return <InvoiceSkeleton />;

  if(error ?? !invoice) return <InvoiceNotFound />;

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
      <div className="flex justify-between items-center mb-6 p-4 pb-0">
        <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice.invoice.invoiceNo ?? ""}</h1>
        <div className="flex space-x-2">
          <Button disabled={isDownloadingPdf}>Save Changes</Button>
          <Button 
            onClick={downloadPdf} 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            disabled={isDownloadingPdf}
          >
            {isDownloadingPdf ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <Button 
            variant="outline" 
            className="border-red-600 text-red-600 hover:bg-red-50"
            disabled={isDownloadingPdf}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <InvoiceForm
        defaultValues={defaultFormValues}
      />
    </div>
  );
}
