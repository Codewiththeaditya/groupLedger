"use client";

import { useState } from "react";
import { createExpense } from "../services/expense-client";
import { useRouter } from "next/navigation";

export default function SplitExpenseForm({
  groupId,
  members,
  type,
  description,
  amount,
  paidBy,
}) {
  const router = useRouter();

  const [splitType, setSplitType] = useState(type);

  // All members selected initially
  const [selectedMembers, setSelectedMembers] = useState(
    members.map((member) => member.profiles.id)
  );

  const [percentages, setPercentages] = useState(() => {
    const initial = {};

    members.forEach((member) => {
      initial[member.profiles.id] = "";
    });

    return initial;
  });

  const [customAmounts, setCustomAmounts] = useState(() => {
    const initial = {};

    members.forEach((member) => {
      initial[member.profiles.id] = "";
    });

    return initial;
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const totalAmount = Number(amount) || 0;

  function toggleMember(userId) {
    setSelectedMembers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }

      return [...prev, userId];
    });
  }

  // Only selected members
  const activeMembers = members.filter((member) =>
    selectedMembers.includes(member.profiles.id)
  );

  const percentageTotal = activeMembers.reduce(
    (total, member) =>
      total +
      Number(percentages[member.profiles.id] || 0),
    0
  );

  const customTotal = activeMembers.reduce(
    (total, member) =>
      total +
      Number(customAmounts[member.profiles.id] || 0),
    0
  );

  const isSplitValid =
    selectedMembers.length > 0 &&
    (splitType === "equal" ||
      (splitType === "percentage" &&
        Math.abs(percentageTotal - 100) < 0.001) ||
      (splitType === "custom" &&
        Math.abs(customTotal - totalAmount) < 0.01));

  function toggleMember(userId) {
    setSelectedMembers((previous) => {
      if (previous.includes(userId)) {
        return previous.filter((id) => id !== userId);
      }

      return [...previous, userId];
    });

    setError("");
  }

  function changeSplitType(newType) {
    setSplitType(newType);
    setError("");
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

        split_between: selectedMembers,

        percentages:
          splitType === "percentage"
            ? percentages
            : {},

        custom_amounts:
          splitType === "custom"
            ? customAmounts
            : {},
      };

      await createExpense(groupId, values);

      router.push(`/groups/${groupId}`);
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to create expense."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-6">

      {/* Split Type Tabs */}

      <div className="grid grid-cols-3 gap-2 rounded-xl border p-1">
        <button
          type="button"
          onClick={() => changeSplitType("equal")}
          className={`rounded-lg py-2 text-sm font-medium ${
            splitType === "equal"
              ? "bg-blue-500 text-white"
              : ""
          }`}
        >
          Equal
        </button>

        <button
          type="button"
          onClick={() =>
            changeSplitType("percentage")
          }
          className={`rounded-lg py-2 text-sm font-medium ${
            splitType === "percentage"
              ? "bg-blue-500 text-white"
              : ""
          }`}
        >
          Percentage
        </button>

        <button
          type="button"
          onClick={() => changeSplitType("custom")}
          className={`rounded-lg py-2 text-sm font-medium ${
            splitType === "custom"
              ? "bg-blue-500 text-white"
              : ""
          }`}
        >
          Custom
        </button>
      </div>

      {/* Expense Summary */}

      <div className="rounded-xl border p-4">
        <p className="font-medium">
          {description}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Total: ₹{totalAmount.toFixed(2)}
        </p>
      </div>

      {/* MEMBER SELECTION */}

      <div>
        <div className="mb-3">
          <p className="font-medium">
            Split between
          </p>

          <p className="text-sm text-zinc-500">
            Select members included in this expense
          </p>
        </div>

        <div className="space-y-2">
          {members.map((member) => {
            const userId = member.profiles.id;

            const isSelected =
              selectedMembers.includes(userId);

            return (
              <label
                key={userId}
                className="flex cursor-pointer items-center justify-between rounded-xl border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600">
                    {member.profiles.full_name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <p className="font-medium">
                    {member.profiles.full_name}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    toggleMember(userId)
                  }
                  className="h-5 w-5"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* EQUAL SPLIT */}

      {splitType === "equal" && (
        <div className="rounded-xl border p-4">
          <p className="font-medium">
            Split equally
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {selectedMembers.length === 0
              ? "Select at least one member"
              : `₹${(
                  totalAmount /
                  selectedMembers.length
                ).toFixed(2)} per person`}
          </p>
        </div>
      )}

      {/* PERCENTAGE SPLIT */}

      {splitType === "percentage" && (
        <div>
          <div className="mb-3 flex justify-between">
            <p className="font-medium">
              Percentage split
            </p>

            <p
              className={`text-sm ${
                Math.abs(percentageTotal - 100) <
                0.001
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {percentageTotal.toFixed(2)}% / 100%
            </p>
          </div>

          <div className="space-y-3">
            {activeMembers.map((member) => {
              const userId = member.profiles.id;

              return (
                <div
                  key={userId}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <p className="font-medium">
                    {member.profiles.full_name}
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={
                        percentages[userId] || ""
                      }
                      onChange={(e) =>
                        setPercentages({
                          ...percentages,
                          [userId]: e.target.value,
                        })
                      }
                      className="w-20 rounded-lg border px-2 py-2 text-right outline-none"
                    />

                    <span className="text-sm">
                      %
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CUSTOM SPLIT */}

      {splitType === "custom" && (
        <div>
          <div className="mb-3 flex justify-between">
            <p className="font-medium">
              Custom amounts
            </p>

            <p
              className={`text-sm ${
                Math.abs(
                  customTotal - totalAmount
                ) < 0.01
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{customTotal.toFixed(2)} / ₹
              {totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="space-y-3">
            {activeMembers.map((member) => {
              const userId = member.profiles.id;

              return (
                <div
                  key={userId}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <p className="font-medium">
                    {member.profiles.full_name}
                  </p>

                  <div className="flex items-center gap-2">
                    <span>₹</span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        customAmounts[userId] || ""
                      }
                      onChange={(e) =>
                        setCustomAmounts({
                          ...customAmounts,
                          [userId]: e.target.value,
                        })
                      }
                      className="w-24 rounded-lg border px-2 py-2 text-right outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error */}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Save */}

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !isSplitValid}
        className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Saving..."
          : "Save Expense"}
      </button>
    </div>
  );
}