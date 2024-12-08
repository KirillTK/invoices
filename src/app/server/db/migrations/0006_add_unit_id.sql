ALTER TABLE "factura_invoice_details" ADD COLUMN "unit_id" integer NOT NULL DEFAULT 19;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factura_invoice_details" ADD CONSTRAINT "factura_invoice_details_unit_id_factura_unit_types_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."factura_unit_types"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "factura_invoice_details" DROP COLUMN IF EXISTS "unit";