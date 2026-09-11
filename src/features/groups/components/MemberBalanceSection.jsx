"use client";

import { useState } from "react";
import { createSettlement } from "@/features/groups/services/settlement-client";
import { useRouter } from "next/navigation";

export default function MembersBalanceSection({
  members,
  debts,
  currentUserId,
  groupId,
  overallBalance,
}) {
  const router = useRouter();

  const [settlingDebt, setSettlingDebt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSettle(debt) {
    try {
      setLoading(true);
      setError("");

      await createSettlement(
        groupId,
        debt.from,
        debt.to,
        debt.amount
      );

      setSettlingDebt(null);

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Failed to settle debt."
      );
    } finally {
      setLoading(false);
    }
  }

  function getMemberDebt(memberId) {
    return debts.find(
      (debt) =>
        (debt.from === currentUserId &&
          debt.to === memberId) ||
        (debt.to === currentUserId &&
          debt.from === memberId)
    );
  }

  const isOwed = overallBalance > 0.01;
  const isOwe = overallBalance < -0.01;
  const isSettled = !isOwed && !isOwe;

  return (
    <section className="mt-6">

      {/* Header */}

      {error && (
        <p className="mb-3 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* ONE BALANCE + MEMBERS CARD */}

      <div className="rounded-2xl border">

        {/* Overall status */}

        <div className="p-4">
          <p className="text-xs text-zinc-500">
            Overall Balance
          </p>

          {isOwed && (
            <p className="mt-1 font-semibold text-green-500">
              You are owed ₹{overallBalance.toFixed(2)}
            </p>
          )}

          {isOwe && (
            <p className="mt-1 font-semibold text-red-500">
              You owe ₹{Math.abs(overallBalance).toFixed(2)}
            </p>
          )}

          {isSettled && (
            <p className="mt-1 font-semibold text-zinc-500">
              All settled up 🎉
            </p>
          )}
        </div>

        {/* Divider */}

        <div className="border-t" />

        {/* Members */}

        <div>
          {members
            .filter(
              (member) =>
                member.profiles.id !== currentUserId
            )
            .filter((member) => getMemberDebt(member.profiles.id))
            .map((member) => {
              const memberId = member.profiles.id;

              const debt = getMemberDebt(memberId);

              const youOwe =
                debt?.from === currentUserId;

              return (
                <div
                  key={memberId}
                  className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                >
                  {/* Member */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                      {member.profiles.full_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium">
                        {member.profiles.full_name}
                      </p>

                      {!debt && (
                        <p className="text-xs text-zinc-400">
                          Settled up
                        </p>
                      )}

                      {debt && youOwe && (
                        <p className="text-xs text-red-500">
                          You owe
                        </p>
                      )}

                      {debt && !youOwe && (
                        <p className="text-xs text-green-500">
                          Owes you
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount */}

                  {debt && (
                    <button
                      type="button"
                      onClick={() => {
                        if (youOwe) {
                          setSettlingDebt(debt);
                        }
                      }}
                      className={`font-semibold ${
                        youOwe
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      ₹{debt.amount.toFixed(2)}
                    </button>
                  )}

                  {!debt && (
                    <span className="text-sm text-zinc-400">
                      —
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        {/* Settlement confirmation inside same card */}

        {settlingDebt && (
          <div className="border-t p-4">
            <p className="text-sm">
              Settle ₹{settlingDebt.amount.toFixed(2)}?
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSettle(settlingDebt)
                }
                disabled={loading}
                className="flex-1 rounded-xl bg-green-600 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading
                  ? "Settling..."
                  : "Confirm"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setSettlingDebt(null)
                }
                disabled={loading}
                className="flex-1 rounded-xl border py-2 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      
    </section>
  );
}