import { revalidateTag, unstable_cache } from 'next/cache';
import { db } from '~/server/db';
import { type ClientModel, clients } from '~/server/db/schema';
import { authRequired } from '~/server/decorators/auth.decorator';
import { CacheTags } from '~/server/enums/cache';


export class ClientsService {
  @authRequired()
  static getClients(userId: string) {
    return db.query.clients.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
      orderBy: (model, { desc }) => desc(model.name),
    });
  };

  static getCachedClients(userId: string) {
    return unstable_cache(
      () => this.getClients(userId),
      [`${CacheTags.CLIENTS}:${userId}`],
    );
  }

  @authRequired()
  static async saveClient(client: ClientModel) {
    const res = await db.insert(clients).values(client);

    revalidateTag(`${CacheTags.CLIENTS}:${client.userId}`);
    return res;
  };
}
