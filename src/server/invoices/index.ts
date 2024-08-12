import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import { invoiceDetails } from "../db/schema";
import { withAuth } from "../utils/auth.guard";

export const getInvoiceList = withAuth(async (userId) => {
  return await db.query.invoice.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });
});


export const saveInvoice = async () => {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  // await db.insert(invoiceDetails).values();
};
