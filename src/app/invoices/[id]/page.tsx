'use client';;
import { use } from "react";
import { FileDown, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '~/shared/components/button';
import { InvoiceForm, type InvoiceFormValues } from '~/widgets/invoice-form';
import { useInvoiceMutations, useInvoiceQuery } from '~/entities/invoice/model/api';
import { InvoiceSkeleton } from '~/features/invoice-skeleton';
import InvoiceNotFound from './not-found';
import { ConfirmRemoveInvoiceModal } from '~/features/confirm-remove-invoice-modal';
import { toast } from '~/shared/components/toast/use-toast';
import { InvoiceButton } from '~/features/invoice-button';
import { DOM_ID } from '~/shared/constants/dom-id.const';

type Props = { params: Promise<{ id: string }> };

export default function Invoice(props: Props) {
  const params = use(props.params);
  const router = useRouter();
  const { invoice, isLoading: isLoadingInvoice, error } = useInvoiceQuery(params.id);
  const { downloadPdf, deleteInvoice, updateInvoice } = useInvoiceMutations(params.id);

  const isLoading = downloadPdf.isPending || updateInvoice.isPending;

  if(isLoadingInvoice) return <InvoiceSkeleton />;

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
      id: detail.id,
    })),
  };

  const handleDeleteInvoice = async () => {
    try {
      await deleteInvoice.mutateAsync();

      router.push('/invoices');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInvoice = async (values: InvoiceFormValues) => {
    const response = await updateInvoice.mutateAsync(values);

    if(response?.ok) {
      toast({ title: "Invoice successfully updated!", variant: "success" });
    }

    return response;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 p-4 pb-0">
        <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice.invoice.invoiceNo ?? ""}</h1>
        <div className="flex space-x-2">
          <InvoiceButton action={DOM_ID.SAVE_NEW_INVOICE} title="Save Changes" disabled={isLoading} />
          <Button 
            onClick={() => downloadPdf.mutateAsync()} 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            disabled={isLoading}
          >
            {downloadPdf.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Export
          </Button>
          <ConfirmRemoveInvoiceModal invoiceNumber={invoice.invoice.invoiceNo} handleConfirm={handleDeleteInvoice}>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50"
              disabled={isLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </ConfirmRemoveInvoiceModal>
          
        </div>
      </div>
      
      <InvoiceForm
        submit={handleUpdateInvoice}
        defaultValues={defaultFormValues}
        shouldUnregister={false}
      />
    </div>
  );
}
