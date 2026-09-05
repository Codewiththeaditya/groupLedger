"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createExpense,
  updateExpense,
} from "../services/expense-client";
import { expenseSchema } from "../validations/expense-schema";
import { useRouter } from "next/navigation";

export default function ExpenseForm({
  groupId,
  members,
  expense,
  mode = "create",
}) {
  const router = useRouter();

  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),

    defaultValues: isEdit
      ? {
          description: expense.description,
          amount: String(expense.amount),
          paid_by: expense.paid_by,
          split_type: "equal",
          split_between: expense.expense_splits.map(
            (split) => split.user_id
          ),
          custom_amounts: {},
          percentages: {},
        }
      : {
          description: "",
          amount: "",
          paid_by: "",
          split_type: "equal",
          split_between: [],
          custom_amounts: {},
          percentages: {},
        },
  });

  const splitType = watch("split_type");
  const selectedMembers = watch("split_between") || [];
  const amount = Number(watch("amount")) || 0;

  const customAmounts = watch("custom_amounts") || {};
  const percentages = watch("percentages") || {};

  const customTotal = selectedMembers.reduce(
    (total, userId) => {
      return total + (Number(customAmounts[userId]) || 0);
    },
    0
  );

  const percentageTotal = selectedMembers.reduce(
    (total, userId) => {
      return total + (Number(percentages[userId]) || 0);
    },
    0
  );

  async function onSubmit(values) {
    try {
      if (isEdit) {
        await updateExpense(expense.id, values);

        router.push(
          `/groups/${groupId}/expenses/${expense.id}`
        );
      } else {
        await createExpense(groupId, values);

        router.push(`/groups/${groupId}`);
      }
    } catch (error) {
      console.error(
        isEdit
          ? "Error updating expense:"
          : "Error creating expense:",
        error
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-5"
    >
      {/* Description */}
      <div>
        <label className="text-sm font-semibold">
          Description
        </label>

        <input
          {...register("description")}
          type="text"
          placeholder="Dinner"
          className="mt-1 h-10 w-full rounded-lg border p-2 outline-none"
          disabled={isSubmitting}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="text-sm font-semibold">
          Amount
        </label>

        <input
          {...register("amount")}
          type="number"
          step="0.01"
          placeholder="1200"
          className="mt-1 h-10 w-full rounded-lg border p-2 outline-none"
          disabled={isSubmitting}
        />

        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Paid By */}
      <div>
        <label className="text-sm font-semibold">
          Paid by
        </label>

        <select
          {...register("paid_by")}
          className="mt-1 h-10 w-full rounded-lg border p-2 outline-none"
          disabled={isSubmitting}
        >
          <option value="">
            Select member
          </option>

          {members.map((member) => (
            <option
              key={member.profiles.id}
              value={member.profiles.id}
            >
              {member.profiles.full_name}
            </option>
          ))}
        </select>

        {errors.paid_by && (
          <p className="mt-1 text-sm text-red-500">
            {errors.paid_by.message}
          </p>
        )}
      </div>

      {/* Split Type */}
      <div>
        <label className="text-sm font-semibold">
          Split type
        </label>

        <div className="mt-3 flex flex-wrap gap-6">
          {/* Equal */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="equal"
              {...register("split_type")}
              disabled={isSubmitting}
            />

            <span>Equal</span>
          </label>

          {/* Custom */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="custom"
              {...register("split_type")}
              disabled={isSubmitting}
            />

            <span>Custom</span>
          </label>

          {/* Percentage */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="percentage"
              {...register("split_type")}
              disabled={isSubmitting}
            />

            <span>Percentage</span>
          </label>
        </div>

        {errors.split_type && (
          <p className="mt-1 text-sm text-red-500">
            {errors.split_type.message}
          </p>
        )}
      </div>

      {/* Split Between */}
      <div>
        <label className="text-sm font-semibold">
          Split between
        </label>

        <div className="mt-3 space-y-3">
          {members.map((member) => {
            const userId = member.profiles.id;

            return (
              <div key={userId}>
                {/* Member checkbox */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    value={userId}
                    {...register("split_between")}
                    disabled={isSubmitting}
                  />

                  <span>
                    {member.profiles.full_name}
                  </span>
                </label>

                {/* Custom Amount */}
                {splitType === "custom" &&
                  selectedMembers.includes(userId) && (
                    <div className="ml-7 mt-2">
                      <input
                        {...register(
                          `custom_amounts.${userId}`
                        )}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Amount"
                        className="h-9 w-32 rounded-lg border p-2 outline-none"
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                {/* Percentage */}
                {splitType === "percentage" &&
                  selectedMembers.includes(userId) && (
                    <div className="ml-7 mt-2 flex items-center gap-2">
                      <input
                        {...register(
                          `percentages.${userId}`
                        )}
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Percentage"
                        className="h-9 w-32 rounded-lg border p-2 outline-none"
                        disabled={isSubmitting}
                      />

                      <span className="text-sm text-zinc-500">
                        %
                      </span>
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {errors.split_between && (
          <p className="mt-1 text-sm text-red-500">
            {errors.split_between.message}
          </p>
        )}

        {/* Custom Total */}
        {splitType === "custom" && (
          <div className="mt-4 rounded-lg border p-3 text-sm">
            <div className="flex justify-between">
              <span>Total expense</span>

              <span className="font-semibold">
                ₹{amount.toFixed(2)}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span>Split total</span>

              <span className="font-semibold">
                ₹{customTotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-2">
              {Math.abs(customTotal - amount) < 0.001 ? (
                <p className="font-medium text-green-600">
                  Amounts match ✓
                </p>
              ) : (
                <p className="font-medium text-red-500">
                  Amounts must add up to ₹
                  {amount.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        )}

        {errors.custom_amounts && (
          <p className="mt-1 text-sm text-red-500">
            {errors.custom_amounts.message}
          </p>
        )}

        {/* Percentage Total */}
        {splitType === "percentage" && (
          <div className="mt-4 rounded-lg border p-3 text-sm">
            <div className="flex justify-between">
              <span>Total percentage</span>

              <span className="font-semibold">
                {percentageTotal.toFixed(2)}%
              </span>
            </div>

            <div className="mt-2">
              {Math.abs(percentageTotal - 100) < 0.001 ? (
                <p className="font-medium text-green-600">
                  Percentages match ✓
                </p>
              ) : (
                <p className="font-medium text-red-500">
                  Percentages must add up to 100%
                </p>
              )}
            </div>
          </div>
        )}

        {errors.percentages && (
          <p className="mt-1 text-sm text-red-500">
            {errors.percentages.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full rounded-lg bg-blue-500 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? isEdit
            ? "Saving..."
            : "Adding..."
          : isEdit
          ? "Save Changes"
          : "Add Expense"}
      </button>
    </form>
  );
}