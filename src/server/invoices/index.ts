import { auth } from "@clerk/nextjs/server";
import { db } from '../db';

export const getInvoiceList = async () => {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  return await db.query.invoice.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.createdAt),
  });
}
