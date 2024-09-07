import { currentUser } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { InvoicesService } from "~/server/api/invoices";
import { isPostgresError } from "~/server/utils/db.utils";
import { invoiceDocumentSchema } from "~/shared/schemas/invoice.schema";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    const invoiceId = await InvoicesService.saveInvoice(user.id, data);

    return NextResponse.json({ invoiceId });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: isPostgresError(error) ? error.detail : "Internal Error",
      },
      { status: 500 },
    );
  }
}


export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: isPostgresError(error) ? error.detail : "Internal Error",
      },
      { status: 500 },
    );
  }
}
