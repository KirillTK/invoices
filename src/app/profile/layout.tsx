import { InvoiceHeader } from '~/features/invoice-header';
import { Footer } from '~/shared/components/footer';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InvoiceHeader />
      <div className="flex flex-col h-screen bg-gray-100 p-8">
        {children}
        <Footer />
      </div>
    </>
  );
}