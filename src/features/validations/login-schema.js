import {z} from "zod";

export const loginSchema = z.object({
    email: z
        .email("Please enter a valid email address")
        .trim()
        .toLowerCase(),

    password: z
    .string()
    .min(6, "password must be atleat 6 characters"),
});