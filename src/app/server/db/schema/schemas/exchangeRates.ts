import { createTable } from "../utils/createTable";
import { uuid, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { currency } from "./currencies";
import { sql } from 'drizzle-orm';

export const exchange_rate = createTable("exchange_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  currencyId: uuid("currency_id").references(() => currency.id, { onDelete: "cascade" }).notNull(),
  value: doublePrecision("value").default(0.01),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
}); 