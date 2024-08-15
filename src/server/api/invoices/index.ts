import { auth } from "@clerk/nextjs/server";
import { db } from "../../db";
import { authRequired } from "../../decorators/auth.decorator";

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
  static async saveInvoice() {
    return;
  }
}
