import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import type { z } from 'zod';
import { db } from "~/server/db";
import { type ClientModel, clients } from "~/server/db/schema";
import { authRequired } from "~/server/decorators/auth.decorator";
import { CacheTags } from "~/server/enums/cache";
import type { clientSchema } from "~/shared/schemas/client.schema";

export class ClientsService {
  @authRequired()
  static getClients(userId: string, query: string) {
    return db.query.clients.findMany({
      where: (model, { eq, and, ilike, or }) =>
        and(
          eq(model.userId, userId),
          or(
            ilike(model.name, `%${query}%`),
            ilike(model.taxIndex, `%${query}%`),
            ilike(model.country, `%${query}%`),
            ilike(model.city, `%${query}%`),
          ),
        ),
      orderBy: (model, { desc }) => desc(model.name),
    });
  }

  @authRequired()
  static async saveClient(client: ClientModel) {
    const res = await db.insert(clients).values(client);

    revalidateTag(`${CacheTags.CLIENTS}:${client.userId}`);
    return res;
  }

  @authRequired()
  static async deleteClient(userId: string, clientId: string) {
    const res = await db
      .delete(clients)
      .where(and(eq(clients.userId, userId), eq(clients.id, clientId)));

    revalidateTag(`${CacheTags.CLIENTS}:${userId}`);
    return res;
  }

  @authRequired()
  static async updateClient(
    userId: string,
    clientId: string,
    client: z.infer<typeof clientSchema>,
  ) {
    const res = await db
      .update(clients)
      .set({
        ...client,
        userId,
        id: clientId,
      })
      .where(and(eq(clients.userId, userId), eq(clients.id, clientId)));

    revalidateTag(`${CacheTags.CLIENTS}:${userId}`);
    return res;
  }
}
