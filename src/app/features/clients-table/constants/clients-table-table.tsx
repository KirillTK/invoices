import { type ColumnDef } from "@tanstack/react-table";
import { type ClientModel } from '~/entities/client/model/client.model';
import { TableHead } from '~/shared/components/table/ui/table';
import { ClientRowActions } from '../components/client-row-actions';

export const CLIENTS_TABLE_COLUMNS: ColumnDef<ClientModel>[] = [
  {
    id: "actions",
    header: () => <TableHead key="actions">Actions</TableHead>,
    cell: ({ row: { original: client } }) => (
      <ClientRowActions client={client} />
    ),
  },
  {
    id: "name",
    accessorKey: "name",
    header: () => <TableHead key="name">Name</TableHead>,
    cell: ({ row: { original: client } }) => (
      <p className="font-medium">{client.name}</p>
    ),
  },
  {
    id: "taxIndex",
    accessorKey: "taxIndex",
    header: () => <TableHead key="taxIndex">Tax Index</TableHead>,
  },
  {
    id: "country",
    accessorKey: "country",
    header: () => <TableHead key="country">Country</TableHead>,
  },
  {
    id: "city",
    accessorKey: "city",
    header: () => <TableHead key="city">City</TableHead>,
  },
];
