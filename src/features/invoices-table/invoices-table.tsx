import Link from "next/link";
import { InvoicesService } from "~/server/api/invoices";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/table/table";
import { DateUtils } from "~/shared/utils/date";
import { MoneyUtils } from "~/shared/utils/money";

export async function InvoicesTable() {
  const invoices = await InvoicesService.getInvoiceList();

  const totalsAmount = invoices.reduce(
    (accum, item) => accum + item.totalNetPrice,
    0,
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice No</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Create Date</TableHead>
          <TableHead>Total net price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(
          ({ invoiceNo, clientName, totalNetPrice, createdAt, id }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">
                <Link href={`/invoice/${id}`}> {invoiceNo}</Link>
              </TableCell>
              <TableCell>{clientName}</TableCell>
              <TableCell className="text-left">
                {DateUtils.formatDate(createdAt)}
              </TableCell>
              <TableCell>
                {MoneyUtils.fromNumberToMoney(totalNetPrice)}
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-left">
            {MoneyUtils.fromNumberToMoney(totalsAmount)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
