import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';
import type { ClientModel, InvoiceDetailsModel, InvoiceModel } from '~/server/db/schema';
import { InvoiceCalculationService } from '~/server/services/invoice-calculation.service';

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
  private static readonly PADDING_INSIDE_BLOCK = 5;
  private static readonly LINE_HEIGHT_INSIDE_BLOCK = 14;

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

    doc.setFillColor(240, 240, 240);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(this.FONT_SIZE);

    // Split text into lines if they exceed their respective widths
    const labelLines: string[] = doc.splitTextToSize(label, labelWidth) as string[];
    const valueLines: string[] = doc.splitTextToSize(value, valueWidth) as string[];

    // Calculate required height for the block
    const maxLines = Math.max(labelLines.length, valueLines.length);
    const extraHeight = 2;
    const blockHeight = Math.max(20, maxLines * (this.LINE_HEIGHT_INSIDE_BLOCK + extraHeight));
    
    // Draw the background rectangle
    doc.rect(x, y, blockWidth, blockHeight, 'F');

    // Draw label lines
    labelLines.forEach((line: string, index: number) => {
      doc.text(line, x + this.PADDING_INSIDE_BLOCK, y + (this.LINE_HEIGHT_INSIDE_BLOCK * (index + 1)));
    });

    // Draw value lines
    valueLines.forEach((line: string, index: number) => {
      const valueY = y + (this.LINE_HEIGHT_INSIDE_BLOCK * (labelLines.length + index + 1));
      doc.text(line, x + this.PADDING_INSIDE_BLOCK, valueY);
    });

    return blockHeight;
  }

  private static renderAddressBlock(doc: jsPDF, title: string, details: string[], { x, y }: Coordinates) {
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.rect(x, y, 200, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + this.PADDING_INSIDE_BLOCK, y + this.LINE_HEIGHT_INSIDE_BLOCK);
    
    doc.setFont('helvetica', 'normal');
    let yOffset = y + 30;
    details.forEach(line => {
      doc.text(line, x + this.PADDING_INSIDE_BLOCK, yOffset);
      yOffset += this.LINE_HEIGHT_INSIDE_BLOCK;
    });

    return yOffset - y;
  }

  private static renderTable(doc: jsPDF, details: InvoiceDetailsModel[], vatInvoice: boolean, startY: number) {
    const vatHeaders = ['VAT rate', 'VAT amount'];

    const tableHeaders = [
      '#',
      'Description', 
      'Unit',
      'Quantity',
      'Unit net price',
      'Total net price', 
      ...(vatInvoice ? vatHeaders : []),
      'Total gross price'
    ];

    const { totalNetPrice, totalVatAmount, totalGrossPrice } = this.getTotalPrice(details);
    
    // Create footer with proper alignment to columns
    const tableFooters = [
      'Total',
      '',
      '',
      details.reduce((sum, detail) => sum + detail.quantity, 0), // Total quantity
      '',
      totalNetPrice.toFixed(2),
      ...(vatInvoice ? [
        '', // VAT rate (empty in total)
        totalVatAmount.toFixed(2) // Total VAT amount
      ] : []),
      totalGrossPrice.toFixed(2)
    ];

    const tableRows = details.map((detail, index) => [
      index + 1,
      detail.description,
      'person hour',
      detail.quantity,
      detail.unitPrice?.toFixed(2),
      (detail.quantity * (detail.unitPrice ?? 0)).toFixed(2),
      detail.vat,
      ((detail.quantity * (detail.unitPrice ?? 0)) * 0.23).toFixed(2),
      ((detail.quantity * (detail.unitPrice ?? 0)) * 1.23).toFixed(2)
    ]);

    let tableHeight = 0;

    doc.autoTable({
      didDrawPage: (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        tableHeight = data?.cursor?.y ?? 0;
      },
      startY,
      head: [tableHeaders],
      foot: [tableFooters],
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
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });

    return tableHeight - startY;
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


  private static renderTextWithBottomLine(doc: jsPDF, text: string, value: string, { x, y }: Coordinates, blockWidth = 200) {
    doc.setFontSize(this.FONT_SIZE);

    // Set bold font for the text part
    doc.setFont('helvetica', 'bold');
    const textWidth = doc.getTextWidth(`${text}: `);
    doc.text(`${text}: `, x + this.PADDING_INSIDE_BLOCK, y + this.LINE_HEIGHT_INSIDE_BLOCK);
    
    // Set normal font for the value part
    doc.setFont('helvetica', 'normal');
    const valueX = x + this.PADDING_INSIDE_BLOCK + textWidth;
    
    // Split just the value to ensure proper wrapping
    const valueLines: string[] = doc.splitTextToSize(value, blockWidth - textWidth - this.PADDING_INSIDE_BLOCK) as string[];
    
    // Calculate required height for the block
    const lineHeight = this.LINE_HEIGHT_INSIDE_BLOCK;
    const padding = this.PADDING_INSIDE_BLOCK;
    
    let currentY = y + lineHeight;
    
    // Draw the first line of value (after the text)
    if (valueLines.length > 0) {
      doc.text(valueLines[0] ?? '', valueX, currentY);
    }
    
    // Draw any additional value lines with proper indentation
    for (let i = 1; i < valueLines.length; i++) {
      currentY += lineHeight;
      doc.text(valueLines[i] ?? '', x + padding, currentY);
    }
    
    // Add the line below the text
    const lineY = currentY + lineHeight/2;
    doc.line(x, lineY, x + blockWidth, lineY);
    
    // Calculate and return the total height used
    // Include the line in the total height calculation
    const totalHeight = (valueLines.length * lineHeight) + padding + lineHeight/2 + 1; // Adding 1 for the line thickness
    
    return totalHeight;
  }


  private static getNextY(elementHeight: number, padding = true) {
    // Space between blocks as percentage of page height
    const SPACING_BETWEEN_BLOCKS = 0.025; // 2.5% of page height
    return elementHeight + (this.PAGE_HEIGHT * (padding ? SPACING_BETWEEN_BLOCKS : 0));
  }

  private static getTotalPrice(details: InvoiceDetailsModel[]) {
    const totalNetPrice =  InvoiceCalculationService.getTotalNetPrice(details);
    const totalVatAmount = InvoiceCalculationService.getTotalVatAmount(details);
    const totalGrossPrice = InvoiceCalculationService.getTotalGrossPrice(details);

    return { totalNetPrice, totalVatAmount, totalGrossPrice };
  }

  static async getInvoicePdf(invoice: InvoiceModel & { details: InvoiceDetailsModel[] }, client: ClientModel) {
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

    currentY += this.getNextY(dateBlock1Height);

    // Due date
    const dueDateBlockHeight = this.renderDateBlock(
      doc,
      'Realization date of the order',
      this.formatDate(invoice.dueDate),
      { x: LEFT_BLOCK_POSITION, y: currentY }
    );
    currentY += this.getNextY(dueDateBlockHeight);

    // Seller address
    const addressHeight = this.renderAddressBlock(doc, 'Seller', [
      invoice.userName,
      `NIP/VAT ID: ${invoice.userNip}`,
      invoice.userAddress ?? '',
    ], { x: this.PADDING_X, y: currentY });

    // Buyer address
    this.renderAddressBlock(doc, 'Buyer', [
      client.name,
      `NIP/VAT ID: ${client.taxIndex}`,
      `${client.city}, ${client.country} ${client.zip}, ${client.address}`,
    ], { x: LEFT_BLOCK_POSITION, y: currentY });

    currentY += this.getNextY(addressHeight);

    const vatPrefix = !!invoice.vatInvoice ? 'VAT invoice' : '';

    // Invoice title
    const titleHeight = this.renderTitle(
      doc,
      `${vatPrefix} Invoice ${invoice.invoiceNo}`.trim(),
      '',
      currentY
    ); 
    currentY += this.getNextY(titleHeight);

    // Table with details
    const tableHeight = this.renderTable(doc, invoice.details, !!invoice.vatInvoice, currentY);
    currentY += this.getNextY(tableHeight);


    const afterTableY = currentY;

    // Payment details
    const methodPaymentHeight = this.renderTextWithBottomLine(doc, 'Method of payment', 'transfer', { x: this.PADDING_X, y: currentY });
    currentY += methodPaymentHeight;
    const dateOfPaymentHeight = this.renderTextWithBottomLine(doc, 'Date of payment', this.formatDate(invoice.dueDate), { x: this.PADDING_X, y: currentY });
    currentY += dateOfPaymentHeight;
    // TODO: add bank to DB
    this.renderTextWithBottomLine(doc, 'PKO, SWIFT: BPKOPLPW', 'PL06 1020 1068 0000 1202 0404 1760', { x: this.PADDING_X, y: currentY }, 300);

    currentY = afterTableY;

    const { totalNetPrice, totalVatAmount, totalGrossPrice } = this.getTotalPrice(invoice.details);

    // Amount Totals
    const totalNetPriceHeight = this.renderTextWithBottomLine(doc, 'Total net price', totalNetPrice.toFixed(2), { x: LEFT_BLOCK_POSITION, y: currentY });
    currentY += totalNetPriceHeight;

    if(!!invoice.vatInvoice) {
      const vatAmountHeight = this.renderTextWithBottomLine(doc, 'VAT amount', totalVatAmount.toFixed(2), { x: LEFT_BLOCK_POSITION, y: currentY });
      currentY += vatAmountHeight;
    }
    
    this.renderTextWithBottomLine(doc, 'Total due', totalGrossPrice.toFixed(2), { x: LEFT_BLOCK_POSITION, y: currentY });
    


    return doc.output('blob');
  }
}
