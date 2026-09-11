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

  const [splitType, setSplitType] =
    useState(type);

  const [percentages, setPercentages] =
    useState(() => {
      const initial = {};

      members.forEach((member) => {
        initial[member.profiles.id] =
          splitType === "percentage"
            ? ""
            : 0;
      });

      return initial;
    });

  const [customAmounts, setCustomAmounts] =
    useState(() => {
      const initial = {};

      members.forEach((member) => {
        initial[member.profiles.id] =
          "";
      });

      return initial;
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const totalAmount = Number(amount) || 0;

  const percentageTotal = Object.values(
    percentages
  ).reduce(
    (total, value) =>
      total + Number(value || 0),
    0
  );

  const customTotal = Object.values(
    customAmounts
  ).reduce(
    (total, value) =>
      total + Number(value || 0),
    0
  );

  const isSplitValid =
    splitType === "equal" ||
    (splitType === "percentage" &&
        Math.abs(percentageTotal - 100) < 0.001) ||
    (splitType === "custom" &&
        Math.abs(customTotal - totalAmount) < 0.01);

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

        split_between: members.map(
          (member) => member.profiles.id
        ),

        percentages,
        custom_amounts: customAmounts,
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
          onClick={() =>
            changeSplitType("equal")
          }
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
          onClick={() =>
            changeSplitType("custom")
          }
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

      {/* EQUAL SPLIT */}

      {splitType === "equal" && (
        <div className="rounded-xl border p-4">
          <p className="font-medium">
            Split equally
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Each member will pay ₹
            {members.length > 0
              ? (
                  totalAmount /
                  members.length
                ).toFixed(2)
              : "0.00"}
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
                Math.abs(
                  percentageTotal - 100
                ) < 0.001
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {percentageTotal}% / 100%
            </p>
          </div>

          <div className="space-y-3">
            {members.map((member) => {
              const userId =
                member.profiles.id;

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
                          [userId]:
                            e.target.value,
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
            {members.map((member) => {
              const userId =
                member.profiles.id;

              return (
                <div
                  key={userId}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <p className="font-medium">
                    {member.profiles.full_name}
                  </p>

                  <div className="flex items-center gap-2">
                    <span>
                      ₹
                    </span>

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
                          [userId]:
                            e.target.value,
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
        {loading ? "Saving..." : "Save Expense"}
        </button>
    </div>
  );
}