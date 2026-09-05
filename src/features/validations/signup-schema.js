import {z} from "zod";

export const signupSchema = z
    .object({
        email: z
            .email("Please enter a valid email address")
            .trim()
            .toLowerCase(),
        
        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    })