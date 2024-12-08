
import { type NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
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
    const invoice = await InvoicesService.getInvoice(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Set custom page size
    const { height } = page.getSize();
    const fontSize = 12;

    // Add Invoice Details section
    page.drawText('Invoice Details', {
      x: 50,
      y: height - 50,
      size: 16,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Invoice Date: ${invoice.invoiceDate}`, {
      x: 50,
      y: height - 80,
      size: fontSize,
    });

    page.drawText(`Due Date: ${invoice.dueDate}`, {
      x: 50,
      y: height - 100,
      size: fontSize,
    });

    page.drawText(`Invoice #: ${invoice.invoiceNo ?? ""}`, {
      x: 50,
      y: height - 120,
      size: fontSize,
    });

    // Add From (Your Information) section
    page.drawText('From (Your Information)', {
      x: 50,
      y: height - 160,
      size: 16,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Name: ${invoice.userName}`, {
      x: 50,
      y: height - 190,
      size: fontSize,
    });

    page.drawText(`NIP/VAT ID: ${invoice.userNip}`, {
      x: 50,
      y: height - 210,
      size: fontSize,
    });

    page.drawText(`Address: ${invoice.userAddress}`, {
      x: 50,
      y: height - 230,
      size: fontSize,
    });

    // Add To (Client Information) section
    page.drawText('To (Client Information)', {
      x: 300,
      y: height - 160,
      size: 16,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Name: ${invoice.clientId}`, {
      x: 300,
      y: height - 190,
      size: fontSize,
    });

    page.drawText(`NIP/VAT ID: ${invoice.clientNip}`, {
      x: 300,
      y: height - 210,
      size: fontSize,
    });

    page.drawText(`Address: ${invoice.clientAddress}`, {
      x: 300,
      y: height - 230,
      size: fontSize,
    });

    // Add Invoice Items section
    page.drawText('Invoice Items', {
      x: 50,
      y: height - 280,
      size: 16,
      color: rgb(0, 0, 0),
    });

    // Draw table headers
    const tableHeaders = ['ID', 'Description', 'Unit', 'Quantity', 'Unit net price', 'Total net price', 'VAT rate', 'VAT amount', 'Total gross price'];
    tableHeaders.forEach((header, index) => {
      page.drawText(header, {
        x: 50 + index * 60,
        y: height - 310,
        size: 10,
        color: rgb(0, 0, 0),
      });
    });

    // Draw invoice items
    invoice.details.forEach((item, index) => {
      const y = height - 330 - index * 20;
      page.drawText(`${index + 1}`, { x: 50, y, size: 10 });
      page.drawText(item.description, { x: 110, y, size: 10 });
    });
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBytes, {
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
