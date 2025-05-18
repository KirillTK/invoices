import { InvoiceHeader } from '~/features/invoice-header';
import { Footer } from '~/shared/components/footer';

export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InvoiceHeader />
      <div className="bg-gray-100 h-full">
        <div className="flex flex-col justify-between h-full p-8 overflow-auto space-y-4">
          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}