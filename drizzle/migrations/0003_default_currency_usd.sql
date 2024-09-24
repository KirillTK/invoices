ALTER TABLE "factura_invoices" ALTER COLUMN "currency_id" DROP DEFAULT;

UPDATE "factura_invoices" SET "currency_id" = (SELECT id FROM "factura_currencies" WHERE "code" = 'USD' LIMIT 1);