import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Group name must be at least 2 characters.")
    .max(50, "Group name cannot exceed 50 characters."),

  type: z.enum([
    "trip",
    "home",
    "couple",
    "general",
  ]),
});