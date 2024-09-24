ALTER TABLE "factura_invoices" ADD COLUMN "exchange_rate" double precision DEFAULT 1;--> statement-breakpoint
ALTER TABLE "factura_invoices" ADD COLUMN "currency_id" uuid; -- No NOT NULL constraint yet

-- Populate the new column with a default currency id
UPDATE "factura_invoices" SET "currency_id" = (SELECT id FROM "factura_currencies" LIMIT 1);

-- Now, alter the column to add the NOT NULL constraint
ALTER TABLE "factura_invoices" ALTER COLUMN "currency_id" SET NOT NULL;

DO $$ BEGIN
 ALTER TABLE "factura_invoices" ADD CONSTRAINT "factura_invoices_currency_id_factura_currencies_id_fk" FOREIGN KEY ("currency_id") REFERENCES "public"."factura_currencies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
