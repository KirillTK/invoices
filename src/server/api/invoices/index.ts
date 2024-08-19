import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { authRequired } from "../../decorators/auth.decorator";
import type { z } from "zod";
import { invoice, invoiceDetails, unitEnum } from "~/server/db/schema";
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
    return await db.transaction(async (tx) => {
      try {
        const { details, invoice: invoiceInfo } = invoiceData;

        const [savedInvoice] = await tx
          .insert(invoice)
          .values({
            ...invoiceInfo,
            userId,
            dueDate: invoiceInfo.dueDate as unknown as string,
            invoiceDate: invoiceInfo.invoiceDate as unknown as string,
            vatInvoice: false,
          })
          .returning({ invoiceId: invoice.id });

        if (!savedInvoice?.invoiceId) {
          tx.rollback();
          return;
        }

        await tx.insert(invoiceDetails).values(
          details.map((detail) => {
            return {
              invoice: savedInvoice.invoiceId,
              description: detail.description,
              unit: unitEnum.enumValues[0],
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
            };
          }),
        );

        return savedInvoice.invoiceId;
      } catch (error) {
        tx.rollback();
        return error;
      }
    });
  }
}
