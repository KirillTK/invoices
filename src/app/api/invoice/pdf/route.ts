
import { type User } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import { InvoicePdfService } from '~/server/routes/invoice-pdf/invoice-pdf.route';
import { InvoicesService } from "~/server/routes/invoices/invoices.route";
import { authenticateUser, handleError } from '~/server/utils/api.utils';

export async function POST(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get('invoiceId');

  if (!invoiceId) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  try {
    const invoice = await InvoicesService.getInvoice(invoiceId, (user as User).id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const pdf = await InvoicePdfService.getInvoicePdf(invoice);
    
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice_${invoice.invoiceNo}.pdf"`,
      },
    });
   
  } catch (error) {
    return handleError(error);
  }
}
