import { NoFoundPanel } from "~/features/no-found-panel/ui/no-found";

export default function InvoiceNotFound() {
  return (
    <NoFoundPanel
      title="Invoice Not Found"
      description="We couldn't find the invoice you're looking for. It may have been deleted or the link might be incorrect."
      redirectButton={{ label: "View All Invoices", href: "/invoices" }}
    />
  );
}
