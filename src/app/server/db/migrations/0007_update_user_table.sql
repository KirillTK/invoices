ALTER TABLE "factura_users" DROP CONSTRAINT "factura_users_name_unique";--> statement-breakpoint
ALTER TABLE "factura_users" DROP CONSTRAINT "factura_users_tax_index_unique";--> statement-breakpoint
ALTER TABLE "factura_users" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "id" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "zip" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "address" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ALTER COLUMN "tax_index" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "factura_users" ADD COLUMN "email" varchar(256);--> statement-breakpoint
ALTER TABLE "factura_users" ADD COLUMN "bank_account" varchar(50);--> statement-breakpoint
ALTER TABLE "factura_users" ADD COLUMN "metadata" json DEFAULT '{}'::json;--> statement-breakpoint
DO $$ BEGIN
    INSERT INTO "factura_users" (id)
    SELECT DISTINCT user_id FROM "factura_invoices"
    ON CONFLICT (id) DO NOTHING;
END $$;
DO $$ BEGIN
 ALTER TABLE "factura_invoices" ADD CONSTRAINT "factura_invoices_user_id_factura_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."factura_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "factura_users" ADD CONSTRAINT "factura_users_email_unique" UNIQUE("email");--> statement-breakpoint
DROP TYPE "public"."invoice_unit";