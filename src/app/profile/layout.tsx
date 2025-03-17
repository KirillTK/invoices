import { InvoiceHeader } from '~/features/invoice-header';
import { Footer } from '~/shared/components/footer';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InvoiceHeader />
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="p-8 overflow-auto space-y-4 w-2/3 mx-auto">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}