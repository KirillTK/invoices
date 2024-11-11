ALTER TABLE "factura_invoices" DROP CONSTRAINT "factura_invoices_currency_id_factura_currencies_id_fk";
--> statement-breakpoint
ALTER TABLE "factura_invoices" DROP COLUMN IF EXISTS "exchange_rate";--> statement-breakpoint
ALTER TABLE "factura_invoices" DROP COLUMN IF EXISTS "currency_id";