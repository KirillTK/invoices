import InvoiceSidebar from '~/features/invoice-sidebar/invoice-sidebar';


export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <InvoiceSidebar />
      <div className="flex-1 p-8 overflow-auto space-y-4">
        {children}
      </div>
    </div>
  );
}