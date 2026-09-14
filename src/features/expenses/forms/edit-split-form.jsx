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

  const totalAmount = Number(amount) || 0;

  // =============================
  // EXISTING CUSTOM AMOUNTS
  // =============================

  const existingCustomAmounts = Object.fromEntries(
    expense.expense_splits.map((split) => [
      split.user_id,
      String(split.amount),
    ])
  );

  // =============================
  // EXISTING PERCENTAGES
  // =============================

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

  // =============================
  // SPLIT VALUES
  // =============================

  const [splitValues, setSplitValues] = useState(() => {
    if (splitType === "percentage") {
      return existingPercentages;
    }

    if (splitType === "custom") {
      return existingCustomAmounts;
    }

    return {};
  });

  function handleChange(userId, value) {
    setSplitValues((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  // =============================
  // TOTAL
  // =============================

  const total = Object.values(splitValues).reduce(
    (sum, value) => {
      return sum + Number(value || 0);
    },
    0
  );

  // =============================
  // VALIDATION
  // =============================

  const isValid =
    splitType === "equal" ||
    (splitType === "percentage" &&
      Math.abs(total - 100) < 0.001) ||
    (splitType === "custom" &&
      Math.abs(total - totalAmount) < 0.01);

  // =============================
  // SAVE
  // =============================

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

      await updateExpense(expense.id, values);

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
          ₹{totalAmount.toFixed(2)}
        </p>
      </div>

      {/* EQUAL SPLIT */}

      {splitType === "equal" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              Split equally between
            </p>

            <p className="text-sm text-zinc-500">
              {selectedMembers.length} selected
            </p>
          </div>

          <div className="space-y-2">
            {members.map((member) => {
              const userId = member.profiles.id;

              const isSelected =
                selectedMembers.includes(userId);

              return (
                <button
                  key={userId}
                  type="button"
                  onClick={() => {
                    setSelectedMembers((prev) => {
                      if (prev.includes(userId)) {
                        return prev.filter(
                          (id) => id !== userId
                        );
                      }

                      return [...prev, userId];
                    });
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
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

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-zinc-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-xs text-white">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-zinc-500">
              Each selected member pays
            </p>

            <p className="mt-1 text-xl font-semibold">
              ₹
              {selectedMembers.length > 0
                ? (
                    totalAmount /
                    selectedMembers.length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      )}

      {/* PERCENTAGE / CUSTOM SPLIT */}

      {splitType !== "equal" && (
        <>
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
                isValid
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {splitType === "percentage"
                ? `${total.toFixed(2)}%`
                : `₹${total.toFixed(2)}`}
            </span>
          </div>
        </>
      )}

      {/* Save */}

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !isValid}
        className="mt-6 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </button>
    </div>
  );
}