
import { uuid, varchar } from "drizzle-orm/pg-core";
import { createTable } from '../utils/createTable';
import { type InferSelectModel } from 'drizzle-orm';

export const currency = createTable("currencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
}); 

export type CurrencyModel = InferSelectModel<typeof currency>;
