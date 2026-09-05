import {z} from "zod";

export const profileSchema = z.object({
    full_name: z   
        .string()
        .trim()
        .min(2,"Full name must be atleast 2 characters.")
        .max(50,"Full name cannot exceed 50 characters."),

    currency: z
        .string()
        .min(1,"Please select a currency."),
});