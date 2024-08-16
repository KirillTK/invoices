import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { authRequired } from "../../decorators/auth.decorator";
import type { z } from "zod";
import {
  invoice,
  invoiceDetails,
  type InvoiceModel,
  type InvoiceDetailsModel,
} from "~/server/db/schema";
import type { invoiceDocumentSchema } from "~/shared/schemas/invoice.schema";

export class InvoicesService {
  @authRequired()
  static async getInvoiceList() {
    const user = auth();

    return await db.query.invoice.findMany({
      where: (model, { eq }) => eq(model.userId, user.userId!),
      orderBy: (model, { desc }) => desc(model.createdAt),
    });
  }

  @authRequired()
  static async saveInvoice(
    userId: string,
    invoiceData: z.infer<typeof invoiceDocumentSchema>,
  ) {
    await db.transaction(async (tx) => {
      try {
        const { details, invoice: invoiceInfo } = invoiceData;
        const [savedInvoice] = await tx
          .insert(invoice)
          .values({
            ...invoiceInfo,
            userId,
            dueDate: invoiceInfo.dueDate.toUTCString(),
            invoiceDate: invoiceInfo.invoiceDate.toUTCString(),
          })
          .returning({ invoiceId: invoice.id });

        if (!savedInvoice?.invoiceId) {
          tx.rollback();
          return;
        }

        await tx.insert(invoiceDetails).values(
          details.map((detail) => ({
            ...detail,
            invoice: savedInvoice.invoiceId,
          })),
        );

        return savedInvoice.invoiceId;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }
}
