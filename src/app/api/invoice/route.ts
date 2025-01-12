import { type User } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { InvoicesService } from "~/server/routes/invoices/invoices.route";
import { authenticateUser, handleError } from '~/server/utils/api.utils';
import { invoiceDocumentSchema } from "~/shared/schemas/invoice.schema";

export async function POST(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const data = (await req.json()) as z.infer<typeof invoiceDocumentSchema>;
  const validationResult = invoiceDocumentSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.errors,
      },
      { status: 400 },
    );
  }

  try {
    const invoiceId = await InvoicesService.saveInvoice((user as User).id, data);
    return NextResponse.json({ invoiceId });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
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
    return NextResponse.json(invoice);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const data = await req.json() as { invoiceId: string };
  const { invoiceId } = data;

  if (!invoiceId) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  try {
    const deletedInvoice = await InvoicesService.deleteInvoice(invoiceId);
    return NextResponse.json({ deletedInvoice });
  } catch (error) {
    return handleError(error);
  }
}
