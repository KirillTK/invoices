import { getInvoiceList } from '~/server/invoices';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/components/table/table";

export async function InvoicesTable() {
  const invoices = await getInvoiceList();  

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Bill</TableHead>
          <TableHead>Create Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.title}</TableCell>
            <TableCell>{invoice.client}</TableCell>
            <TableCell>{invoice.quantity}</TableCell>
            <TableCell className="text-right">{invoice.createdAt.toISOString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
