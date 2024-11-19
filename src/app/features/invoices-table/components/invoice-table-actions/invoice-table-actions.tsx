'use client'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useInvoiceDeleteMutation, useInvoiceCopyMutation } from '~/entities/invoice/api/api'
import { ConfirmRemoveInvoiceModal } from '~/features/confirm-remove-invoice-modal'
import { Button } from '~/shared/components/button'

type Props = {
  invoiceId: string
  invoiceNo: string;
}

export const InvoiceTableActions = ({ invoiceId, invoiceNo }: Props) => {
  const router = useRouter();
  const deleteInvoice = useInvoiceDeleteMutation(invoiceId);
  const copyInvoice = useInvoiceCopyMutation(invoiceId);

  const handleDelete = () => deleteInvoice.mutateAsync();

  const handleDuplicate = async () => {
    await copyInvoice.mutateAsync();
    router.refresh();
  }

  const isLoading = deleteInvoice.isPending || copyInvoice.isPending;

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={() => router.push(`/invoices/${invoiceId}`)} disabled={isLoading}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleDuplicate} disabled={isLoading}>
        <Copy className="h-4 w-4" />
      </Button>
      <ConfirmRemoveInvoiceModal invoiceNumber={invoiceNo} handleConfirm={handleDelete}>
        <Button variant="outline" size="icon" disabled={isLoading}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </ConfirmRemoveInvoiceModal>
    </div>
  )
}
