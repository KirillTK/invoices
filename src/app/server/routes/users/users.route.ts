import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { type UserModel, users } from '~/server/db/schema/schemas/users';
import { authRequired } from '~/server/decorators/auth.decorator';

export class UsersService {
  @authRequired()
  static getUser(userId: string) {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

  @authRequired()
  static createUser(user: Partial<UserModel> & { id: string }) {
    return db.insert(users).values(user);
  }

  @authRequired()
  static updateUser(user: Partial<UserModel> & { id: string }) {
    return db.update(users).set(user).where(eq(users.id, user.id));
  }
}