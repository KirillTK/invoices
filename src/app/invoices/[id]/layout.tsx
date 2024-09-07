import { Separator } from "~/shared/components/separator";
import { SelectedInvoiceHeader } from "~/widgets/selected-invoice-header";

interface Props {
  children: React.ReactNode;
  params: { id: string };
}

export default function SelectedInvoiceLayout({ children, params }: Props) {
  return (
    <div>
      <SelectedInvoiceHeader invoiceId={params.id} />
      <Separator className="my-4" />
      {children}
    </div>
  );
}
