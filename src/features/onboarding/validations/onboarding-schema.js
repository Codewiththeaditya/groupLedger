import { z } from "zod";

export const onboardingSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(50, "Full name cannot exceed 50 characters."),

  phone: z
    .string()
    .trim()
    .optional(),

  currency: z
    .string()
    .min(1, "Please select a currency."),
});