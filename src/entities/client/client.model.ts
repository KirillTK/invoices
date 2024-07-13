import type { clients } from '~/server/db/schema';

export type ClientModel = typeof clients.$inferSelect;
