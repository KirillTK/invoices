import { type User } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { InvoicesService } from '~/server/routes/invoices/invoices.route';
import { authenticateUser, handleError } from '~/server/utils/api.utils';
import { invoiceDocumentSchemaWithOptionalDetailsId } from '~/shared/schemas/invoice.schema';
import { MathUtils } from '~/shared/utils/math';

export async function POST(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const data = await req.json() as { invoiceId: string };
  const { invoiceId } = data;

  if (!invoiceId) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  try {
    const copiedInvoiceId = await InvoicesService.copyInvoice(invoiceId, (user as User).id);
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

  const data = await req.json() as z.infer<typeof invoiceDocumentSchemaWithOptionalDetailsId>;

  const validationResult = invoiceDocumentSchemaWithOptionalDetailsId.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.errors,
      },
      { status: 400 },
    );
  }

  data.details = data.details.map(detail => ({
    ...detail,
    vat: detail.vat ? MathUtils.divide(detail.vat, 100) : 0,
  }));

  try {
    await InvoicesService.updateInvoice(invoiceId, data, (user as User).id);
    return NextResponse.json({ invoiceId });
  } catch (error) {
    return handleError(error);
  }
}