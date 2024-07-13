import { db } from "../db";

export const getClients = (userId: string) => {
  return db.query.clients.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.name),
  });
};
