import Link from "next/link";
import { type InvoiceListModel } from "~/entities/invoice/model/invoice.model";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/shared/components/card/card";
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
import { FormatterUtils } from "~/shared/utils/formatter";
import { EmptyInvoiceItems, InvoiceTableActions } from "../components";

export async function InvoicesTable({
  invoices,
}: {
  invoices: InvoiceListModel[];
}) {
  const totalsAmount = invoices.reduce(
    (accum, item) => accum + item.totalNetPrice,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actions</TableHead>
              <TableHead>Invoice No</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total net price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(
              ({
                invoiceNo,
                clientName,
                totalNetPrice,
                createdAt,
                dueDate,
                id,
              }) => (
                <TableRow key={id}>
                  <TableCell>
                    <InvoiceTableActions invoiceId={id} invoiceNo={invoiceNo} />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/invoices/${id}`}>{invoiceNo}</Link>
                  </TableCell>
                  <TableCell>{clientName}</TableCell>
                  <TableCell className="text-left">
                    {DateUtils.formatDate(createdAt)}
                  </TableCell>
                  <TableCell>
                    {dueDate ? DateUtils.formatDate(dueDate) : "-"}
                  </TableCell>
                  <TableCell>
                    {FormatterUtils.fromNumberToMoney(totalNetPrice)}
                  </TableCell>
                </TableRow>
              ),
            )}

            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyInvoiceItems />
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {invoices.length > 0 && (
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
      </CardContent>
    </Card>
  );
}
