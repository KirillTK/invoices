import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/card/card";
import {
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  Table,
  TableEmpty,
} from "~/shared/components/table/ui/table";
import {  
  useClientQuery,
} from "~/entities/client/api/client.api";
import { TableFilterUtils } from "~/shared/components/table";
import { SkeletonClientsTable } from "../components/skeleton-clients-table";
import { CLIENTS_TABLE_COLUMNS } from '../constants/clients-table-table';

type Props = {
  query: string;
  setGlobalFilter: (filter: string) => void;
};

export const ClientsTable = ({ query, setGlobalFilter }: Props) => {
  const { clients, isLoading } = useClientQuery();

  const table = useReactTable({
    data: clients,
    columns: CLIENTS_TABLE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: query,
    },
    getRowId: (row) => row.id,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value, addMeta) => TableFilterUtils.globalSearch(row, columnId, value, addMeta),
  });

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
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id + 'clients-table-header'}>
                {headerGroup.headers.map((header) => (
                  flexRender(header.column.columnDef.header, header.getContext())
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id + 'clients-table-row'}>
                {row.getVisibleCells().map((cell) => (
                     <TableCell key={cell.id + 'clients-table-cell'}>{flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}</TableCell>   
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
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
