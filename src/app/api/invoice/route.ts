import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { InvoicesService } from "~/server/api/invoices";
import { InvoiceDetailsModel, InvoiceModel } from "~/server/db/schema";
import { isPostgresError } from '~/server/utils/db.utils';
import { invoiceDocumentSchema } from "~/shared/schemas/invoice.shema";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = (await req.json()) as {
    invoice: InvoiceModel;
    details: InvoiceDetailsModel[];
  };

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
    const resp = await InvoicesService.saveInvoice(
      user.id,
      data.invoice,
      data.details,
    );
    
    return NextResponse.json(resp);
  } catch (error) {
    return NextResponse.json(
      {
        message: isPostgresError(error) ? error.detail : "Internal Error",
      },
      { status: 500 },
    );
  }
}
