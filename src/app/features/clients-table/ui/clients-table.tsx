import { Edit2, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/card/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableEmpty,
} from "~/shared/components/table/table";
import { Button } from "~/shared/components/button";
import {
  useClientDeleteMutation,
  useClientQueryWithFilter,
} from "~/entities/client/api/client.api";
import { SkeletonClientsTable } from "../components/skeleton-clients-table";
import { ConfirmRemoveModal } from "~/features/confirm-remove-modal";
import { ClientModal } from "~/features/client-combobox/components/client-modal";

type Props = {
  query: string;
};

export const ClientsTable = ({ query }: Props) => {
  const { clients, isLoading } = useClientQueryWithFilter(query);
  const deleteClient = useClientDeleteMutation(query);

  if (isLoading) return <SkeletonClientsTable />;

  const noItemsText = !query ? "No clients" : "No clients found";

  const noItemsDescription = !query
    ? "Get started by adding a new client."
    : "No clients found with the current filter.";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tax Index</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex space-x-2">
                    <ClientModal buttonClassName="bg-blue-600 hover:bg-blue-700 text-white" client={client}>
                      <Button variant="outline" size="icon">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </ClientModal>

                    <ConfirmRemoveModal
                      message={
                        "Are you sure you want to remove this client? This action cannot be undone. This will also remove all related invoices."
                      }
                      handleConfirm={() => deleteClient.mutateAsync(client.id)}
                    >
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </ConfirmRemoveModal>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.taxIndex}</TableCell>
                <TableCell>{client.country}</TableCell>
                <TableCell>{client.city}</TableCell>
              </TableRow>
            ))}

            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <TableEmpty
                    noItemsText={noItemsText}
                    noItemsDescription={noItemsDescription}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
