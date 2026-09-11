"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExpense } from "@/features/expenses/services/expense-client";

export default function AdvancedExpenseForm({
  groupId,
  members,
}) {
  const router = useRouter();

  const [splitType, setSplitType] =
    useState("equal");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [paidBy, setPaidBy] =
    useState("");

  const [customAmounts, setCustomAmounts] =
    useState({});

  const [percentages, setPercentages] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handlePercentageChange(
    userId,
    value
  ) {
    setPercentages((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  function handleCustomAmountChange(
    userId,
    value
  ) {
    setCustomAmounts((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  const percentageTotal = members.reduce(
    (total, member) =>
      total +
      Number(
        percentages[member.profiles.id] || 0
      ),
    0
  );

  const customTotal = members.reduce(
    (total, member) =>
      total +
      Number(
        customAmounts[member.profiles.id] || 0
      ),
    0
  );

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!description.trim()) {
      setError(
        "Please enter an expense description."
      );
      return;
    }

    const totalAmount = Number(amount);

    if (!totalAmount || totalAmount <= 0) {
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    if (!paidBy) {
      setError(
        "Please select who paid."
      );
      return;
    }

    if (
      splitType === "percentage" &&
      Math.abs(percentageTotal - 100) > 0.01
    ) {
      setError(
        "Percentages must add up to 100%."
      );
      return;
    }

    if (
      splitType === "custom" &&
      Math.abs(customTotal - totalAmount) > 0.01
    ) {
      setError(
        "Custom amounts must equal the expense amount."
      );
      return;
    }

    try {
      setLoading(true);

      const data = {
        description: description.trim(),
        amount: totalAmount,
        paid_by: paidBy,

        split_type: splitType,

        // All members are included
        split_between: members.map(
          (member) => member.profiles.id
        ),

        custom_amounts:
          splitType === "custom"
            ? customAmounts
            : {},

        percentages:
          splitType === "percentage"
            ? percentages
            : {},
      };

      await createExpense(
        groupId,
        data
      );

      router.push(
        `/groups/${groupId}`
      );

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
    <form
      onSubmit={handleSubmit}
      className="mt-6"
    >

      {/* Split Type */}

      <div className="flex rounded-xl bg-zinc-100 p-1">

        <button
          type="button"
          onClick={() =>
            setSplitType("equal")
          }
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            splitType === "equal"
              ? "bg-white shadow-sm"
              : "text-zinc-500"
          }`}
        >
          Equal
        </button>

        <button
          type="button"
          onClick={() =>
            setSplitType("percentage")
          }
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            splitType === "percentage"
              ? "bg-white shadow-sm"
              : "text-zinc-500"
          }`}
        >
          Percentage
        </button>

        <button
          type="button"
          onClick={() =>
            setSplitType("custom")
          }
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
            splitType === "custom"
              ? "bg-white shadow-sm"
              : "text-zinc-500"
          }`}
        >
          Custom
        </button>

      </div>


      {/* Form */}

      <div className="mt-6 space-y-5">

        {/* Description */}

        <div>
          <label className="text-sm font-medium">
            What was the expense?
          </label>

          <input
            type="text"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Dinner, groceries..."
            className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Amount */}

        <div>
          <label className="text-sm font-medium">
            How much?
          </label>

          <div className="mt-2 flex items-center rounded-xl border px-4">
            <span className="text-lg text-zinc-500">
              ₹
            </span>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="0"
              min="0"
              step="0.01"
              inputMode="decimal"
              className="w-full bg-transparent px-3 py-3 text-lg outline-none"
            />
          </div>
        </div>


        {/* Paid By */}

        <div>
          <label className="text-sm font-medium">
            Paid by
          </label>

          <select
            value={paidBy}
            onChange={(e) =>
              setPaidBy(
                e.target.value
              )
            }
            className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none"
          >
            <option value="">
              Select member
            </option>

            {members.map((member) => (
              <option
                key={
                  member.profiles.id
                }
                value={
                  member.profiles.id
                }
              >
                {
                  member.profiles
                    .full_name
                }
              </option>
            ))}
          </select>
        </div>

      </div>


      {/* Equal */}

      {splitType === "equal" && (
        <div className="mt-6 rounded-xl border p-4">

          <p className="font-medium">
            Split equally
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Between all{" "}
            {members.length}{" "}
            members
          </p>

        </div>
      )}


      {/* Percentage */}

      {splitType ===
        "percentage" && (
        <div className="mt-6">

          <div className="mb-3 flex justify-between">

            <p className="font-medium">
              Split by percentage
            </p>

            <p
              className={`text-sm ${
                Math.abs(
                  percentageTotal - 100
                ) <= 0.01
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {percentageTotal}%
            </p>

          </div>

          <div className="space-y-3">

            {members.map(
              (member) => (

                <div
                  key={
                    member.profiles.id
                  }
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
                >

                  <span className="font-medium">
                    {
                      member.profiles
                        .full_name
                    }
                  </span>

                  <div className="flex w-28 items-center rounded-lg border px-3">

                    <input
                      type="number"
                      value={
                        percentages[
                          member
                            .profiles
                            .id
                        ] || ""
                      }
                      onChange={(e) =>
                        handlePercentageChange(
                          member
                            .profiles
                            .id,
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className="w-full py-2 outline-none"
                    />

                    <span className="text-zinc-500">
                      %
                    </span>

                  </div>

                </div>
              )
            )}

          </div>

        </div>
      )}


      {/* Custom */}

      {splitType === "custom" && (
        <div className="mt-6">

          <div className="mb-3 flex justify-between">

            <p className="font-medium">
              Custom amounts
            </p>

            <p
              className={`text-sm ${
                Math.abs(
                  customTotal -
                    Number(amount || 0)
                ) <= 0.01
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ₹{customTotal.toFixed(2)}
            </p>

          </div>

          <div className="space-y-3">

            {members.map(
              (member) => (

                <div
                  key={
                    member.profiles.id
                  }
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
                >

                  <span className="font-medium">
                    {
                      member.profiles
                        .full_name
                    }
                  </span>

                  <div className="flex w-32 items-center rounded-lg border px-3">

                    <span className="text-zinc-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      value={
                        customAmounts[
                          member
                            .profiles
                            .id
                        ] || ""
                      }
                      onChange={(e) =>
                        handleCustomAmountChange(
                          member
                            .profiles
                            .id,
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className="w-full py-2 pl-2 outline-none"
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </div>
      )}


      {/* Error */}

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}


      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-blue-500 py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading
          ? "Adding Expense..."
          : "Add Expense"}
      </button>

    </form>
  );
}