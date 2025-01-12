import Link from 'next/link';
import { type ColumnDef } from "@tanstack/react-table";
import { type InvoiceListModel } from '~/entities/invoice/model/invoice.model';
import { InvoiceTableActions } from '../components';
import { DateUtils } from '~/shared/utils/date';
import { FormatterUtils } from '~/shared/utils/formatter';

export const INVOICES_TABLE_COLUMNS: ColumnDef<InvoiceListModel>[] = [
  {
    id: "actions",
    header: 'Actions',
    cell: ({ row: { original: { id, invoiceNo } } }) => (
      <InvoiceTableActions invoiceId={id} invoiceNo={invoiceNo} />
    ),
  },
  {
    id: "invoiceNo",
    accessorKey: "invoiceNo",
    header: 'Invoice No',
    cell: ({ row: { original: { id, invoiceNo } } }) => (
      <Link href={`/invoices/${id}`}>{invoiceNo}</Link>
    ),
  },
  {
    id: "clientName",
    accessorKey: "clientName",
    header: 'Client',
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: 'Create Date',
    cell: ({ row: { original: { createdAt } } }) => (
      <p className="text-left">{DateUtils.formatDate(createdAt)}</p>
    ),
  },
  {
    id: "dueDate",
    accessorKey: "dueDate",
    header: 'Due Date',
    cell: ({ row: { original: { dueDate } } }) => (
      <p>{dueDate ? DateUtils.formatDate(dueDate) : "-"}</p>
    ),
  },
  {
    id: "totalNetPrice",
    accessorKey: "totalNetPrice",
    header: 'Total net price',
    cell: ({ row: { original: { totalNetPrice } } }) => (
      <p>{FormatterUtils.fromNumberToMoney(totalNetPrice)}</p>
    ),
  },
];