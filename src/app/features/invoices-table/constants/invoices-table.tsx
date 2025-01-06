import Link from 'next/link';
import { type ColumnDef } from "@tanstack/react-table";
import { type InvoiceListModel } from '~/entities/invoice/model/invoice.model';
import { TableHead } from '~/shared/components/table/ui/table';
import { InvoiceTableActions } from '../components';
import { DateUtils } from '~/shared/utils/date';
import { FormatterUtils } from '~/shared/utils/formatter';

export const INVOICES_TABLE_COLUMNS: ColumnDef<InvoiceListModel>[] = [
  {
    id: "actions",
    header: () => <TableHead key="actions">Actions</TableHead>,
    cell: ({ row: { original: { id, invoiceNo } } }) => (
      <InvoiceTableActions invoiceId={id} invoiceNo={invoiceNo} />
    ),
  },
  {
    id: "invoiceNo",
    accessorKey: "invoiceNo",
    header: () => <TableHead key="invoiceNo">Invoice No</TableHead>,
    cell: ({ row: { original: { id, invoiceNo } } }) => (
      <Link href={`/invoices/${id}`}>{invoiceNo}</Link>
    ),
  },
  {
    id: "clientName",
    accessorKey: "clientName",
    header: () => <TableHead key="clientName">Client</TableHead>,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: () => <TableHead key="createdAt">Create Date</TableHead>,
    cell: ({ row: { original: { createdAt } } }) => (
      <p className="text-left">{DateUtils.formatDate(createdAt)}</p>
    ),
  },
  {
    id: "dueDate",
    accessorKey: "dueDate",
    header: () => <TableHead key="dueDate">Due Date</TableHead>,
    cell: ({ row: { original: { dueDate } } }) => (
      <p>{dueDate ? DateUtils.formatDate(dueDate) : "-"}</p>
    ),
  },
  {
    id: "totalNetPrice",
    accessorKey: "totalNetPrice",
    header: () => <TableHead key="totalNetPrice">Total net price</TableHead>,
    cell: ({ row: { original: { totalNetPrice } } }) => (
      <p>{FormatterUtils.fromNumberToMoney(totalNetPrice)}</p>
    ),
  },
];