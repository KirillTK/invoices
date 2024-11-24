CREATE TABLE IF NOT EXISTS "factura_unit_type_categories" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "factura_unit_type_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura_unit_types" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"abbreviation" varchar(10) NOT NULL,
	"type_id" integer NOT NULL,
	CONSTRAINT "factura_unit_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factura_unit_types" ADD CONSTRAINT "factura_unit_types_type_id_factura_unit_type_categories_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."factura_unit_type_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


DO $$ BEGIN
 INSERT INTO "factura_unit_type_categories" (id, name) VALUES
    (1, 'count'),
		(2, 'weight'),
		(3, 'volume'),
		(4, 'length'),
		(5, 'area'),
		(6, 'service');
END $$;

DO $$ BEGIN
 INSERT INTO "factura_unit_types" (id, name, abbreviation, type_id) VALUES
	(1, 'Piece', 'pcs', 1),
	(2, 'Box', 'box', 1),
	(3, 'Set', 'set', 1),
	(4, 'Pack', 'pack', 1),
	(5, 'Kilogram', 'kg', 2),
	(6, 'Gram', 'g', 2),
	(7, 'Pound', 'lb', 2),
	(8, 'Ounce', 'oz', 2),
	(9, 'Liter', 'l', 3),
	(10, 'Milliliter', 'ml', 3),
	(11, 'Gallon', 'gal', 3),
	(12, 'Meter', 'm', 4),
	(13, 'Centimeter', 'cm', 4),
	(14, 'Millimeter', 'mm', 4),
	(15, 'Inch', 'in', 4),
	(16, 'Foot', 'ft', 4),
	(17, 'Square Meter', 'sqm', 5),
	(18, 'Square Foot', 'sqft', 5),
	(19, 'Hour', 'hour', 6),
	(20, 'Day', 'day', 6),
	(21, 'Task', 'task', 6),
	(22, 'Session', 'session', 6);
END $$;