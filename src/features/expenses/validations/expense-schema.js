import { z } from "zod";

export const expenseSchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(100, "Description is too long"),

    amount: z
      .coerce
      .number()
      .positive("Amount must be greater than 0"),

    paid_by: z
      .string()
      .uuid("Invalid payer"),

    split_type: z.enum(["equal", "custom", "percentage"]),

    split_between: z
      .array(z.string().uuid())
      .min(1, "Select at least one member"),

    custom_amounts: z.record(
      z.string().uuid(),
      z.coerce.number().min(0)
    ),

    percentages: z.record(
      z.string().uuid(),
      z.coerce.number().min(0).max(100)
    ),
  })
  .superRefine((data, ctx) => {
    if (data.split_type === "custom") {
      const total = data.split_between.reduce(
        (sum, userId) =>
          sum + (Number(data.custom_amounts[userId]) || 0),
        0
      );

      if (Math.abs(total - data.amount) > 0.001) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["custom_amounts"],
          message: `Custom amounts must add up to ₹${data.amount.toFixed(2)}`,
        });
      }
    }

    if (data.split_type === "percentage") {
      const totalPercentage = data.split_between.reduce(
        (sum, userId) =>
          sum + (Number(data.percentages[userId]) || 0),
        0
      );

      if (Math.abs(totalPercentage - 100) > 0.001) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["percentages"],
          message: "Percentages must add up to 100%",
        });
      }
    }
  });