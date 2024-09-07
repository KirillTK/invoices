
import { type NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import { InvoicesService } from "~/server/api/invoices";
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
    const invoice = await InvoicesService.getInvoice(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Add content to the PDF
    page.drawText(`Invoice #${invoice.invoice.invoiceNo ?? ""}`, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize * 2,
      color: rgb(0, 0, 0),
    });

    // Add more invoice details...
    page.drawText(`Date: ${invoice.invoice.invoiceDate}`, {
      x: 50,
      y: height - 8 * fontSize,
      size: fontSize,
    });

    page.drawText(`Due Date: ${invoice.invoice.dueDate}`, {
      x: 50,
      y: height - 10 * fontSize,
      size: fontSize,
    });

    page.drawText(`Client: ${invoice.invoice.clientId}`, {
      x: 50,
      y: height - 12 * fontSize,
      size: fontSize,
    });

    // Add more fields as needed...

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice_${invoice.invoice.invoiceNo}.pdf"`,
      },
    });

  } catch (error) {
    return handleError(error);
  }
}
