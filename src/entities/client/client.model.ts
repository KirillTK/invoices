import type { InferSelectModel } from 'drizzle-orm';
import type { clients } from '~/server/db/schema';

export type ClientModel = InferSelectModel<typeof clients>;
