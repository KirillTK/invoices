import { z } from 'zod';

const optionalTextInput = (schema: z.ZodString) =>
  z
    .union([z.string(), z.undefined()])
    .refine((val) => !val || schema.safeParse(val).success);

export const userSchema = z.object({
  email: optionalTextInput(z.string().email()),
  name: z.string().max(256, "Name too long").optional(),
  country: z.string().max(50, "Country too long").optional(),
  city: z.string().max(50, "City too long").optional(),
  address: z.string().max(256, "Address too long").optional(),
  zip: z.string().max(50, "ZIP code too long").optional(),
  taxIndex: z.string().max(50, "Tax index too long").optional(),
  bankAccount: z.string().max(50, "Bank account too long").optional(),
});
