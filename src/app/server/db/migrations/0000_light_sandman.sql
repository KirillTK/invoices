DO $$ BEGIN
 CREATE TYPE "public"."invoice_unit" AS ENUM('PER_HOURS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"country" varchar(50) NOT NULL,
	"zip" varchar(50) NOT NULL,
	"address" varchar(50) NOT NULL,
	"tax_index" varchar(50) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	CONSTRAINT "factura_clients_name_unique" UNIQUE("name"),
	CONSTRAINT "factura_clients_tax_index_unique" UNIQUE("tax_index")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura_currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"symbol" varchar(50) NOT NULL,
	"code" varchar(50) NOT NULL,
	CONSTRAINT "factura_currencies_name_unique" UNIQUE("name"),
	CONSTRAINT "factura_currencies_code_unique" UNIQUE("code")
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_no" varchar(50) NOT NULL,
	"due_date" date,
	"invoice_date" date,
	"vat_invoice" boolean DEFAULT false,
	"user_id" varchar(256) NOT NULL,
	"user_name" varchar(50) NOT NULL,
	"user_address" varchar(250),
	"userNip" varchar(50),
	"client_id" uuid NOT NULL,
	"client_address" varchar(250),
	"client_nip" varchar(50),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp,
	CONSTRAINT "factura_invoices_invoice_no_unique" UNIQUE("invoice_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura_invoice_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" varchar(256) NOT NULL,
	"unit" "invoice_unit" NOT NULL,
	"unit_price" double precision NOT NULL,
	"quantity" double precision NOT NULL,
	"total_net_price" double precision DEFAULT 0,
	"vat" double precision DEFAULT 0,
	"vat_amount" double precision DEFAULT 0,
	"total_gross_price" double precision DEFAULT 0,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "factura_users" (
	"id" uuid,
	"name" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"country" varchar(50) NOT NULL,
	"zip" varchar(50) NOT NULL,
	"address" varchar(50) NOT NULL,
	"tax_index" varchar(50) NOT NULL,
	CONSTRAINT "factura_users_name_unique" UNIQUE("name"),
	CONSTRAINT "factura_users_tax_index_unique" UNIQUE("tax_index")
);

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factura_invoices" ADD CONSTRAINT "factura_invoices_client_id_factura_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."factura_clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "factura_invoice_details" ADD CONSTRAINT "factura_invoice_details_invoice_id_factura_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."factura_invoices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
