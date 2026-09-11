"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateExpense } from "../services/expense-client";

export default function EditSplitForm({
  groupId,
  expense,
  members,
  splitType,
  description,
  amount,
  paidBy,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =============================
  // EXISTING SPLIT VALUES
  // =============================

  const existingCustomAmounts = Object.fromEntries(
    expense.expense_splits.map((split) => [
      split.user_id,
      String(split.amount),
    ])
  );

  const existingPercentages = Object.fromEntries(
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
  );

  const [splitValues, setSplitValues] = useState(
    splitType === "percentage"
      ? existingPercentages
      : existingCustomAmounts
  );

  function handleChange(userId, value) {
    setSplitValues((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  async function handleSave() {
    try {
      setLoading(true);
      setError("");

      const values = {
        description,
        amount,
        paid_by: paidBy,

        split_type: splitType,

        split_between: members.map(
          (member) => member.profiles.id
        ),

        custom_amounts:
          splitType === "custom"
            ? splitValues
            : {},

        percentages:
          splitType === "percentage"
            ? splitValues
            : {},
      };

      await updateExpense(
        expense.id,
        values
      );

      router.push(
        `/groups/${groupId}/expenses/${expense.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update expense."
      );
    } finally {
      setLoading(false);
    }
  }

  const total = Object.values(splitValues).reduce(
    (sum, value) => {
      return sum + Number(value || 0);
    },
    0
  );

  return (
    <div className="mt-6">
      {/* Error */}

      {error && (
        <p className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Expense amount */}

      <div className="mb-6 rounded-xl border p-4">
        <p className="text-sm text-zinc-500">
          Total Expense
        </p>

        <p className="text-xl font-semibold">
          ₹{Number(amount).toFixed(2)}
        </p>
      </div>

      {/* Split members */}

      <div className="space-y-3">
        {members.map((member) => {
          const userId = member.profiles.id;

          return (
            <div
              key={userId}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                  {member.profiles.full_name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <p className="font-medium">
                  {member.profiles.full_name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={splitValues[userId] || ""}
                  onChange={(e) =>
                    handleChange(
                      userId,
                      e.target.value
                    )
                  }
                  className="w-24 rounded-lg border px-3 py-2 text-right outline-none focus:ring-2 focus:ring-blue-500"
                />

                <span className="text-sm text-zinc-500">
                  {splitType === "percentage"
                    ? "%"
                    : "₹"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-zinc-500">
          {splitType === "percentage"
            ? "Total percentage"
            : "Total split"}
        </span>

        <span
          className={`font-semibold ${
            splitType === "percentage"
              ? Math.abs(total - 100) < 0.001
                ? "text-green-500"
                : "text-red-500"
              : Math.abs(
                  total - Number(amount)
                ) < 0.01
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {splitType === "percentage"
            ? `${total.toFixed(2)}%`
            : `₹${total.toFixed(2)}`}
        </span>
      </div>

      {/* Save */}

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </button>
    </div>
  );
}