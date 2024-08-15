import { z } from "zod";

export const invoiceSchema = z.object({
  invoiceNo: z
    .string()
    .min(1, "Invoice # is required")
    .max(50, "Invoice # too long"),
  dueDate: z.string().date(),
  invoiceDate: z.string().date(),
  vatInvoice: z.boolean(),
  // user
  userId: z.string().min(1, "userId is required"),
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
  invoiceId: z.string().min(1, "invoice_id is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(256, "Invoice description too long"),
  unit: z.number().min(0.1, "Unit is required"),
  quantity: z.number().min(0.1, "Quantity is required"),
  unitPrice: z.number().min(0.1, "Unit price is required"),
});

export const invoiceDocumentSchema = z.object({
  invoice: invoiceSchema,
  details: invoiceDetailsSchema.array(),
});
