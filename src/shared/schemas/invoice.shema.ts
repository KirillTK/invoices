import { z } from "zod";

export const invoiceSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  client_id: z.string().min(1, "client_id is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  due_date: z.string().min(1, "Due date is required"),
  realizationDate: z.string().min(1, "Realization date is required"),
  vatInvoice: z.boolean(),
});

export const invoiceDetailsSchema = z.object({
  invoice_id: z.string().min(1, "invoice_id is required"),
  description: z.string().min(1, "Description is required"),
  unit: z.number().min(0.1, "Unit is required"),
  unitPrice: z.number().min(0.1, "Unit price is required"),
  quantity: z.number().min(0.1, "Quantity is required"),
});

export const invoiceDocumentSchema = z.object({
  invoice: invoiceSchema,
  details: invoiceDetailsSchema.array(),
});
