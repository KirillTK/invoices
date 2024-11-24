import { pgEnum } from "drizzle-orm/pg-core";

export const unitEnum = pgEnum("invoice_unit", ["PER_HOURS"]); 
