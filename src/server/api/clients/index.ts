import { db } from '~/server/db';
import { type ClientModel, clients } from '~/server/db/schema';
import { authRequired } from '~/server/decorators/auth.decorator';


export class ClientsService {
  // @authRequired()
  static getClients(userId: string) {
    return db.query.clients.findMany({
      where: (model, { eq }) => eq(model.userId, userId),
      orderBy: (model, { desc }) => desc(model.name),
    });
  };

  @authRequired()
  static saveClient(client: ClientModel) {
    return db.insert(clients).values(client);
  };
}
