import { Separator } from "~/shared/components/separator";
import { CreateInvoiceHeader } from "~/widgets/create-invoice-header";

export default function InvoiceLayout2({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CreateInvoiceHeader />
      <Separator className="my-4" />
      {children}
    </div>
  );
}
