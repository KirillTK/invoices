'use client';;
import { use } from "react";
import { FileDown, Loader2, Trash2 } from 'lucide-react';
import { Button } from '~/shared/components/button';
import { InvoiceForm, type InvoiceFormValues } from '~/widgets/invoice-form';
import { useDownloadInvoiceMutation, useInvoiceDeleteMutation, useInvoiceQuery, useInvoiceUpdateMutation } from '~/entities/invoice/api/api';
import { InvoiceSkeleton } from '~/features/invoice-skeleton';
import InvoiceNotFound from './not-found';
import { ConfirmRemoveInvoiceModal } from '~/features/confirm-remove-invoice-modal';
import { InvoiceButton } from '~/features/invoice-button';
import { DOM_ID } from '~/shared/constants/dom-id.const';
import { MathUtils } from '~/shared/utils/math';

type Props = { params: Promise<{ id: string }> };

export default function Invoice(props: Props) {
  const params = use(props.params);
  const { invoice, isLoading: isLoadingInvoice, error } = useInvoiceQuery(params.id);
  const downloadPdf = useDownloadInvoiceMutation(params.id);
  const updateInvoice =  useInvoiceUpdateMutation(params.id);
  const deleteInvoice = useInvoiceDeleteMutation(params.id, '/invoices');
  const isLoading = downloadPdf.isPending || updateInvoice.isPending;

  if(isLoadingInvoice) return <InvoiceSkeleton />;

  if(error ?? !invoice) return <InvoiceNotFound />;

  const defaultFormValues: InvoiceFormValues = {
    invoice: {
      invoiceNo: invoice.invoiceNo,
      dueDate: new Date(invoice.dueDate!),
      invoiceDate: new Date(invoice.invoiceDate!),
      vatInvoice: invoice.vatInvoice!,
      userName: invoice.userName,
      userAddress: invoice.userAddress!,
      userNip: invoice.userNip!,
      clientId: invoice.clientId,
      clientAddress: invoice.clientAddress!,
      clientNip: invoice.clientNip!,
    },
    details: invoice.details.map((detail) => ({
      description: detail.description,
      unitId: detail.unitId,
      unitPrice: detail.unitPrice,
      quantity: detail.quantity,
      totalNetPrice: detail.totalNetPrice ?? 0,
      totalGrossPrice: detail.totalGrossPrice ?? 0,
      vat: MathUtils.toPercentageWithTwoDecimals(detail.vat ?? 0),
      vatAmount: detail.vatAmount ?? 0,
      id: detail.id,
    })),
  };

  console.log(defaultFormValues, 'defaultFormValues');

  const handleDeleteInvoice = async () => deleteInvoice.mutateAsync();

  const handleUpdateInvoice = async (values: InvoiceFormValues) => updateInvoice.mutateAsync(values);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 p-4 pb-0">
        <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice.invoiceNo ?? ""}</h1>
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
          <ConfirmRemoveInvoiceModal invoiceNumber={invoice.invoiceNo} handleConfirm={handleDeleteInvoice}>
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
