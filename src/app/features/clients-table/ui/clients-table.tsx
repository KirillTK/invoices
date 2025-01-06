import {
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
  TableRow,
  TableBody,
  TableCell,
  Table,
  TableEmpty,
  UncontrolledBody,
  UncontrolledHeader,
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

  const rowsToDisplay = table.getRowModel().rows;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <UncontrolledHeader headers={table.getHeaderGroups()} />

          <TableBody>
            <UncontrolledBody rows={rowsToDisplay} />

            {rowsToDisplay.length === 0 && (
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
