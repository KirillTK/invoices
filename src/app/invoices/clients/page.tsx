import { currentUser } from "@clerk/nextjs/server";
import ClientsNotFound from "./no-found";
import { ClientsTableWithFilter } from "~/widgets/clients-table-with-filter/ui/clients-table-with-filter";
import { NewClientModal } from "~/features/client-combobox/components/new-client-modal";
import { Button } from "~/shared/components/button/button";
import { PlusIcon } from "@radix-ui/react-icons";

export default async function ClientsPage() {
  const user = await currentUser();

  if (!user) return <ClientsNotFound />;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <NewClientModal buttonClassName="bg-blue-600 hover:bg-blue-700 text-white">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </NewClientModal>
      </div>
      
      <ClientsTableWithFilter />
    </div>
  );
}
