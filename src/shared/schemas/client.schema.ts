import { z  } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().max(50, 'Max length 50 symbols').min(1, "City is required"),
  country: z.string().max(50, 'Max length 50 symbols').min(1, "Country is required"),
  zip: z.string().max(50, 'Max length 50 symbols').min(1, "Zip is required"),
  address: z.string().max(50, 'Max length 50 symbols').min(1, "Address is required"),
  taxIndex: z.string().max(50, 'Max length 50 symbols').min(1, "Nip is required"),
  userId: z.string().min(1, 'userId is required'),
});
