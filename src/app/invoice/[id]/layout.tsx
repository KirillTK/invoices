import { Separator } from "~/shared/components/separator";
import { SelectedInvoiceHeader } from '~/widgets/selected-invoice-header';

export default function InvoiceLayout2({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SelectedInvoiceHeader />
      <Separator className="my-4" />
      {children}
    </div>
  );
}
