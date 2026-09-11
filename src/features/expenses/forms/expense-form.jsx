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
  currentUserId,
  expense,
  mode = "create",
}) {
  const router = useRouter();

  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),

    defaultValues: isEdit
      ? {
          description: expense.description,
          amount: String(expense.amount),
          paid_by: expense.paid_by,

          // Preserve existing split type
          split_type: expense.split_type || "equal",

          // Preserve users involved in split
          split_between: expense.expense_splits.map(
            (split) => split.user_id
          ),

          // Preserve existing split amounts
          custom_amounts: Object.fromEntries(
            expense.expense_splits.map((split) => [
              split.user_id,
              String(split.amount),
            ])
          ),

          // Calculate percentages from existing amounts
          percentages: Object.fromEntries(
            expense.expense_splits.map((split) => [
              split.user_id,
              String(
                (
                  (Number(split.amount) /
                    Number(expense.amount)) *
                  100
                ).toFixed(2)
              ),
            ])
          ),
        }
      : {
          description: "",
          amount: "",
          paid_by: currentUserId,

          split_type: "equal",

          split_between: members.map(
            (member) => member.profiles.id
          ),

          custom_amounts: {},
          percentages: {},
        },
  }); // <-- THIS WAS MISSING

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

      router.refresh();
    } catch (error) {
      console.error(
        isEdit
          ? "Error updating expense:"
          : "Error creating expense:",
        error
      );
    }
  }

  function goToSplitPage(type) {
    return handleSubmit((values) => {
      const params = new URLSearchParams({
        type,
        description: values.description,
        amount: values.amount,
        paidBy: values.paid_by,
      });

      const splitPath = isEdit
        ? `/groups/${groupId}/expenses/${expense.id}/edit/split`
        : `/groups/${groupId}/expenses/new/split`;

      router.push(
        `${splitPath}?${params.toString()}`
      );
    });
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
          placeholder="Dinner, groceries..."
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
          How much?
        </label>

        <div className="flex items-center rounded-xl border px-4">
          <span className="text-lg text-zinc-500">
            ₹
          </span>

          <input
            {...register("amount")}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            inputMode="decimal"
            className="w-full bg-transparent px-3 py-3 text-lg outline-none"
            disabled={isSubmitting}
          />
        </div>

        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Paid By */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Paid by
        </label>

        <select
          {...register("paid_by")}
          className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {members.map((member) => (
            <option
              key={member.profiles.id}
              value={member.profiles.id}
            >
              {member.profiles.id === currentUserId
                ? "You"
                : member.profiles.full_name}
            </option>
          ))}
        </select>

        {errors.paid_by && (
          <p className="mt-1 text-sm text-red-500">
            {errors.paid_by.message}
          </p>
        )}
      </div>

      {/* Split info */}
      <p className="text-sm text-zinc-500">
        {expense?.split_type === "custom"
          ? "This expense currently uses a custom split."
          : expense?.split_type === "percentage"
          ? "This expense currently uses a percentage split."
          : `Split equally between all ${members.length} ${
              members.length === 1
                ? "member"
                : "members"
            }`}
      </p>

      {/* Other Split Options */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={goToSplitPage("percentage")}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border p-4 text-center transition hover:bg-zinc-50 disabled:opacity-50"
        >
          <span className="font-medium">
            Percentage
          </span>
        </button>

        <button
          type="button"
          onClick={goToSplitPage("custom")}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border p-4 text-center transition hover:bg-zinc-50 disabled:opacity-50"
        >
          <span className="font-medium">
            Custom amount
          </span>
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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