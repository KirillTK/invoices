// import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';
import type { InvoiceDetailsModel, InvoiceModel } from '~/server/db/schema';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

// Augment jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

type Coordinates = { x: number; y: number };

export class InvoicePdfService {
  private static readonly PAGE_WIDTH = 595.28; // A4 width in points
  private static readonly PAGE_HEIGHT = 841.89; // A4 height in points
  private static readonly FONT_SIZE = 10;
  private static readonly HEADER_FONT_SIZE = 12;
  private static readonly PADDING_X = this.PAGE_WIDTH * 0.05; // 5% of page width
  private static readonly PADDING_Y = this.PAGE_HEIGHT * 0.05; // 5% of page height

  // TODO: move to utils
  private static formatDate(date: Date | string | null | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  private static renderDateBlock(doc: jsPDF, label: string, value: string, { x, y }: Coordinates) {
    // Fixed dimensions
    const blockWidth = 200;
    const labelWidth = 190;
    const valueWidth = 190;
    const padding = 5;
    const lineHeight = 14;

    doc.setFillColor(240, 240, 240);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(this.FONT_SIZE);

    // Split text into lines if they exceed their respective widths
    const labelLines: string[] = doc.splitTextToSize(label, labelWidth) as string[];
    const valueLines: string[] = doc.splitTextToSize(value, valueWidth) as string[];

    // Calculate required height for the block
    const maxLines = Math.max(labelLines.length, valueLines.length);
    const blockHeight = Math.max(20, (maxLines * lineHeight) + (padding * 2));

    // Draw the background rectangle
    doc.rect(x, y, blockWidth, blockHeight, 'F');

    // Draw label lines
    labelLines.forEach((line: string, index: number) => {
      doc.text(line, x + padding, y + padding + (lineHeight * (index + 1)));
    });
    // Draw value lines
    valueLines.forEach((line: string, index: number) => {
      const valueY = y + padding + (lineHeight * (labelLines.length + index + 1));
      doc.text(line, x + padding, valueY);
    });

    return blockHeight;
  }

  private static renderAddressBlock(doc: jsPDF, title: string, details: string[], { x, y }: Coordinates) {
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.rect(x, y, 200, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + 5, y + 14);
    
    doc.setFont('helvetica', 'normal');
    let yOffset = y + 30;
    details.forEach(line => {
      doc.text(line, x + 5, yOffset);
      yOffset += 15;
    });
  }

  private static renderTable(doc: jsPDF, details: InvoiceDetailsModel[], startY: number) {
    const tableColumns = [
      { header: 'Lp.', dataKey: 'index' },
      { header: 'Description', dataKey: 'description' },
      { header: 'Unit', dataKey: 'unit' },
      { header: 'Quantity', dataKey: 'quantity' },
      { header: 'Unit net price', dataKey: 'unitPrice' },
      { header: 'Total net price', dataKey: 'totalNet' },
      { header: 'VAT rate', dataKey: 'vatRate' },
      { header: 'VAT amount', dataKey: 'vatAmount' },
      { header: 'Total gross price', dataKey: 'totalGross' }
    ];

    const tableRows = details.map((detail, index) => ({
      index: index + 1,
      description: detail.description,
      unit: 'person hour',
      quantity: detail.quantity,
      unitPrice: detail.unitPrice?.toFixed(2),
      totalNet: (detail.quantity * (detail.unitPrice ?? 0)).toFixed(2),
      vatRate: '23%',
      vatAmount: ((detail.quantity * (detail.unitPrice ?? 0)) * 0.23).toFixed(2),
      totalGross: ((detail.quantity * (detail.unitPrice ?? 0)) * 1.23).toFixed(2)
    }));

    doc.autoTable({
      startY,
      head: [tableColumns.map(col => col.header)],
      body: tableRows,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
  }

  private static renderTitle(doc: jsPDF, primaryTitle: string, secondaryTitle: string, y: number) {
    const maxWidth = (this.PAGE_WIDTH - this.PADDING_X * 2)  * 0.8; // 80% of page width for wider text
    const centerX = (this.PAGE_WIDTH - this.PADDING_X * 2) / 2;
    const lineSpacing = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(this.HEADER_FONT_SIZE);

    // Split titles if they exceed max width
    const primaryLines: string[] = doc.splitTextToSize(primaryTitle, maxWidth) as string[];
    const secondaryLines: string[] = doc.splitTextToSize(secondaryTitle, maxWidth) as string[];

    let currentY = y;

    // Render primary title lines
    primaryLines.forEach((line: string) => {
      const textWidth = doc.getTextWidth(line);
      const xPos = centerX - (textWidth / 2);
      doc.text(line, xPos, currentY);
      currentY += lineSpacing;
    });

    // Render secondary title lines
    secondaryLines.forEach((line: string) => {
      const textWidth = doc.getTextWidth(line);
      const xPos = centerX - (textWidth / 2);
      doc.text(line, xPos, currentY);
      currentY += lineSpacing;
    });

    // Return the total height used
    return  currentY - y;
  }

  static async getInvoicePdf(invoice: InvoiceModel & { details: InvoiceDetailsModel[] }) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    const BLOCK_WIDTH = 200;
    const LEFT_BLOCK_POSITION = this.PAGE_WIDTH - this.PADDING_X - BLOCK_WIDTH;

    let currentY = this.PADDING_Y;

    // Date of issue
    const dateBlock1Height = this.renderDateBlock(
      doc,
      'Data wystawienia/Date of issue',
      this.formatDate(invoice.invoiceDate),
      { x: LEFT_BLOCK_POSITION, y: currentY }
    );

    // Space between blocks as percentage of page height
    const SPACING_BETWEEN_BLOCKS = 0.025; // 2.5% of page height

    currentY += dateBlock1Height + (this.PAGE_HEIGHT * SPACING_BETWEEN_BLOCKS);

    // Due date
    const dueDateBlockHeight = this.renderDateBlock(
      doc,
      'Termin realizacji zamówienia/Realization date of the order',
      this.formatDate(invoice.dueDate),
      { x: LEFT_BLOCK_POSITION, y: currentY }
    );

    currentY += dueDateBlockHeight + (this.PAGE_HEIGHT * SPACING_BETWEEN_BLOCKS);

    // Seller address
    this.renderAddressBlock(doc, 'Sprzedawca/Seller', [
      'KIRYL TKACHOU',
      'NIP/VAT ID: PL5213995825',
      'Jaktorowska 5 / 80',
      '01-202 Warszawa'
    ], { x: this.PADDING_X, y: currentY });

    // Buyer address
    this.renderAddressBlock(doc, 'Nabywca/Buyer', [
      'Itransition Sp. Z o.o',
      'NIP/VAT ID: PL5213782733',
      'Al. Jerozolimskie 123a',
      '02-017 Warszawa'
    ], { x: LEFT_BLOCK_POSITION, y: currentY });

    currentY += 100; // Add space before title

    // Invoice title
    const titleHeight = this.renderTitle(
      doc,
      // 'Faktura VAT wewnętrzna Factura 01/01/2025',
      'Internal VAT invoice Factura 01/01/2025',
      'Internal VAT invoice Factura 01/01/2025',
      currentY
    );

    currentY += titleHeight + (this.PAGE_HEIGHT * SPACING_BETWEEN_BLOCKS);

    // Table with details
    this.renderTable(doc, invoice.details, currentY);

    // Payment details
    doc.setFontSize(this.FONT_SIZE);
    doc.setFont('helvetica', 'normal');
    const paymentY = 650;
    doc.text('Data płatności/Date of payment: 10-02-2025', 100, paymentY);
    doc.text('Sposób płatności/Method of payment: przelew/transfer', 100, paymentY + 20);
    doc.text('PKO, SWIFT: BPKOPLPW', 100, paymentY + 40);
    doc.text('PL06 1020 1068 0000 1202 0404 1760', 100, paymentY + 60);

    return doc.output('blob');
  }
}
