'use client';

import { getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { type InvoiceListModel } from '~/entities/invoice/model/invoice.model';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/components/card/card';
import { Table, TableBody, TableCell, TableFooter, TableRow, UncontrolledBody, UncontrolledHeader } from '~/shared/components/table/ui/table';
import { EmptyInvoiceItems } from '../components';
import { INVOICES_TABLE_COLUMNS } from '../constants/invoices-table';
import { FormatterUtils } from '~/shared/utils/formatter';
import { PAGINATION_DEFAULT_STATE, PaginationTable } from '~/shared/components/pagination';
import { useState } from 'react';

export function InvoicesTable({ invoices }: { invoices: InvoiceListModel[] }) {
  const [pagination, setPagination] = useState(PAGINATION_DEFAULT_STATE);

  const table = useReactTable({
    data: invoices,
    columns: INVOICES_TABLE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    },
    getRowId: (row) => row.id,
  });

  const rowsToDisplay = table.getRowModel().rows;

  const totalsAmount = rowsToDisplay.reduce((accum, item) => accum + item.original.totalNetPrice, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <UncontrolledHeader headers={table.getHeaderGroups()} />

          <TableBody>
            <UncontrolledBody rows={rowsToDisplay} />

            {rowsToDisplay.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyInvoiceItems />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {rowsToDisplay.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-left">
                  {FormatterUtils.fromNumberToMoney(totalsAmount)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
        <PaginationTable tableInstance={table} />
      </CardContent>
    </Card>
  );
}
