import { type InferSelectModel } from 'drizzle-orm';
import { createTable } from "../utils/createTable";
import { integer, varchar } from "drizzle-orm/pg-core";


export const unitTypeCategories = createTable("unit_type_categories", {
  id: integer().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});


export const unitTypes = createTable("unit_types", {
  id: integer().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  abbreviation: varchar("abbreviation", { length: 10 }).notNull(),
  typeId: integer("type_id")
    .references(() => unitTypeCategories.id, { onDelete: "cascade" })
    .notNull(),
});

export type UnitTypeModel = InferSelectModel<typeof unitTypes>;
export type UnitTypeCategoryModel = InferSelectModel<typeof unitTypeCategories>;