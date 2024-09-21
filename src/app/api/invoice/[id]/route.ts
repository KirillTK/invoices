import { type NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { InvoicesService } from '~/server/api/invoices';
import { authenticateUser, handleError } from '~/server/utils/api.utils';
import { invoiceDocumentSchemaWithDetailsId } from '~/shared/schemas/invoice.schema';

export async function POST(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const data = await req.json() as { invoiceId: string };
  const { invoiceId } = data;

  if (!invoiceId) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  try {
    const copiedInvoiceId = await InvoicesService.copyInvoice(invoiceId);
    return NextResponse.json({ invoiceId: copiedInvoiceId });
  } catch (error) {
    return handleError(error);
  }
}


export async function PATCH(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const invoiceId = req.url.split('/').pop();

  if (!invoiceId) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  const data = await req.json() as z.infer<typeof invoiceDocumentSchemaWithDetailsId>;

  const validationResult = invoiceDocumentSchemaWithDetailsId.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.errors,
      },
      { status: 400 },
    );
  }

  try {
    await InvoicesService.updateInvoice(invoiceId, data);
    return NextResponse.json({ invoiceId });
  } catch (error) {
    return handleError(error);
  }
}