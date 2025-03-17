import { z } from "zod";

const NumberOrStringNumber = z.union([z.number(), z.string()]).optional().transform((val) => {
  // Convert string to number if it's a string
  if (typeof val === 'string') {
    return Number(val);
  }
  return val; // Return the number as is
});


export const invoiceSchema = z.object({
  invoiceNo: z
    .string()
    .min(1, "Invoice # is required")
    .max(50, "Invoice # too long"),
  dueDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  invoiceDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  vatInvoice: z.boolean().default(false),
  // user
  userName: z.string().min(1, "User name is required").max(50, "Name too long"),
  userAddress: z
    .string()
    .min(1, "User address is required")
    .max(250, "User address too long"),
  userNip: z.string().min(1, "User Nip is required").max(50, "Nip too long"),
  // client
  clientId: z.string().min(1, "client_id is required"),
  clientAddress: z
    .string()
    .min(1, "User address is required")
    .max(250, "User address too long"),
  clientNip: z.string().min(1, "User Nip is required").max(50, "Nip too long"),
});

export const invoiceDetailsSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(256, "Invoice description too long"),
  unitId: NumberOrStringNumber,
  unitPrice: z.coerce.number().min(0.1, "Unit price is required"),
  quantity: z.coerce.number().min(0.1, "Quantity is required"),
  totalNetPrice: z.number().optional(),
  vat: NumberOrStringNumber,
  vatAmount: z.number().optional(),
  totalGrossPrice: z.number().optional(),
});

export const invoiceDetailsSchemaWithOptionalId = invoiceDetailsSchema.extend({
  id: z.string().optional(),
});

export const invoiceDetailsSchemaWithId = invoiceDetailsSchema.extend({
  id: z.string().min(1, "Id is required"),
});

export const invoiceDocumentSchema = z.object({
  invoice: invoiceSchema,
  details: invoiceDetailsSchema.array(),
});


export const invoiceDocumentSchemaWithOptionalDetailsId = invoiceDocumentSchema.extend({
  details: invoiceDetailsSchemaWithOptionalId.array(),
});
