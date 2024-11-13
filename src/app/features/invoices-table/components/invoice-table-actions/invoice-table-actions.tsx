'use client'
import { Copy, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useInvoiceMutations } from '~/entities/invoice/model/api'
import { ConfirmRemoveInvoiceModal } from '~/features/confirm-remove-invoice-modal'
import { Button } from '~/shared/components/button'
import { toast } from '~/shared/components/toast/use-toast'


type Props = {
  invoiceId: string
  invoiceNo: string;
}

export const InvoiceTableActions = ({ invoiceId, invoiceNo }: Props) => {
  const router = useRouter();
  const { copyInvoice, deleteInvoice } = useInvoiceMutations(invoiceId);

  const handleDelete = async () => {
    try {
      await deleteInvoice.mutateAsync();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleDuplicate = async () => {
    try {
      await copyInvoice.mutateAsync();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invoice. Please try again.",
        variant: "destructive",
      });
    }
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
