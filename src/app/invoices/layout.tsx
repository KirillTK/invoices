import { InvoiceHeader } from '~/features/invoice-header';
import InvoiceSidebar from '~/features/invoice-sidebar/invoice-sidebar';
import { Footer } from '~/shared/components/footer';

export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InvoiceHeader />
      <div className="flex h-screen bg-gray-100">
        <InvoiceSidebar />
        <div className="flex-1 p-8 overflow-auto space-y-4">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}