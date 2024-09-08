'use client'
import { Copy, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useInvoiceMutations } from '~/entities/invoice/api'
import { Button } from '~/shared/components/button'
import { toast } from '~/shared/components/toast/use-toast'


type Props = {
  invoiceId: string
}

export const InvoiceTableActions = ({ invoiceId }: Props) => {
  const router = useRouter();
  const { copyInvoice, deleteInvoice, isLoading } = useInvoiceMutations(invoiceId);

  const handleDelete = async () => {
    try {
      await deleteInvoice();
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
      await copyInvoice();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invoice. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={handleDuplicate} disabled={isLoading}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleDelete} disabled={isLoading}>
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}
