"use client";

import { useState } from "react";
import { createSettlement } from "@/features/groups/services/settlement-client";
import { useRouter } from "next/navigation";

export default function BalancesSection({
  debts,
  currentUserId,
  groupId,
}) {
  const router = useRouter();

  const [settlingDebt, setSettlingDebt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userDebts = debts.filter(
    (debt) =>
      debt.from === currentUserId ||
      debt.to === currentUserId
  );

  async function handleSettle(debt) {
    try {
      setLoading(true);
      setError("");

      await createSettlement(
        groupId,
        debt.expenseId,
        debt.from,
        debt.to,
        debt.amount
      );

      setSettlingDebt(null);

      // Re-run the Server Component queries
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to settle debt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">
        Balances
      </h2>

      {error && (
        <p className="mt-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {userDebts.length === 0 ? (
          <div className="rounded-2xl border p-4">
            <p className="font-medium">
              All settled up 🎉
            </p>
          </div>
        ) : (
          userDebts.map((debt) => {
            const youOwe = debt.from === currentUserId;

            const otherName = youOwe
              ? debt.toName
              : debt.fromName;

            return (
              <div
                key={`${debt.from}-${debt.to}`}
                className="rounded-2xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {youOwe
                        ? `You owe ${otherName}`
                        : `${otherName} owes you`}
                    </p>

                    <p className="text-lg font-semibold">
                      ₹{debt.amount.toFixed(2)}
                    </p>
                  </div>

                  {youOwe && (
                    <button
                      type="button"
                      onClick={() => setSettlingDebt(debt)}
                      className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                      Settle Up
                    </button>
                  )}
                </div>

                {settlingDebt === debt && (
                  <div className="mt-4 rounded-xl bg-gray-100 p-4">
                    <p className="text-sm">
                      Settle ₹{debt.amount.toFixed(2)} with{" "}
                      {otherName}?
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSettle(debt)}
                        disabled={loading}
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        {loading ? "Settling..." : "Confirm"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettlingDebt(null)}
                        disabled={loading}
                        className="rounded-xl border px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}