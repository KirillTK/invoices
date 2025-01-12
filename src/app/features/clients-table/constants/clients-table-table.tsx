import { type ColumnDef } from "@tanstack/react-table";
import { type ClientModel } from '~/entities/client/model/client.model';
import { ClientRowActions } from '../components/client-row-actions';

export const CLIENTS_TABLE_COLUMNS: ColumnDef<ClientModel>[] = [
  {
    id: "actions",
    header: 'Actions',
    cell: ({ row: { original: client } }) => (
      <ClientRowActions client={client} />
    ),
  },
  {
    id: "name",
    accessorKey: "name",
    header: 'Name',
    cell: ({ row: { original: client } }) => (
      <p className="font-medium">{client.name}</p>
    ),
  },
  {
    id: "taxIndex",
    accessorKey: "taxIndex",
    header: 'Tax Index',
  },
  {
    id: "country",
    accessorKey: "country",
    header: 'Country',
  },
  {
    id: "city",
    accessorKey: "city",
    header: 'City',
  },
];
