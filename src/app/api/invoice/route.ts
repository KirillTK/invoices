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
