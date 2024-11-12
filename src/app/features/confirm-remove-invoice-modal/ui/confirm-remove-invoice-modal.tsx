import { Button } from '~/shared/components/button';
import { DialogHeader, DialogFooter, DialogTrigger, DialogTitle, Dialog, DialogContent, DialogDescription } from '~/shared/components/dialog';
import { useState } from 'react';

interface Props {
  children?: React.ReactNode;
  invoiceNumber: string;
  handleConfirm: () => void;
}

export const ConfirmRemoveInvoiceModal = ({ children, invoiceNumber, handleConfirm }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onConfirm = () => {
    handleConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Invoice #{invoiceNumber}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}