import { CreateInvoiceHeader } from "~/features/create-invoice-header";
import { InvoiceForm } from "~/features/invoice-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/shared/components/command";

import { Separator } from "~/shared/components/separator";

export default function CreateNewInvoicePage() {
  return (
    <section>
      <CreateInvoiceHeader />
      <Separator className="my-4" />
      <InvoiceForm />
    </section>
  );
}
