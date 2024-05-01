import { Button } from '~/shared/components/button';

export function CreateInvoiceHeader() {
  return (
    <div className="flex items-center justify-between">
      <p>Create New Invoice</p>
      <Button variant="outline">Save Invoice</Button>
    </div>
  );
}
