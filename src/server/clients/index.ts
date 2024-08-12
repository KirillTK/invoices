import { db } from "../db";
import { clients } from '../db/schema';
import type { ClientModel } from '../db/schema';

export const getClients = (userId: string) => {
  return db.query.clients.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.name),
  });
};

export const saveClient = (client: ClientModel) => {
  return db.insert(clients).values(client);
};
