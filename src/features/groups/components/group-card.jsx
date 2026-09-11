"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGroup } from "@/features/groups/services/group-client";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getCurrencySymbol } from "@/constants/currencies";

export default function GroupCard({
  group,
  currency,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [startX, setStartX] = useState(null);
  const [offset, setOffset] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleTouchStart(event) {
    setStartX(event.touches[0].clientX);
  }

  function handleTouchMove(event) {
    if (startX === null) return;

    const currentX = event.touches[0].clientX;
    const difference = currentX - startX;

    // Only allow swipe left
    if (difference < 0) {
      setOffset(Math.max(difference, -80));
    }
  }

  function handleTouchEnd() {
    // If swiped enough, keep delete button open
    if (offset < -40) {
      setOffset(-80);
    } else {
      setOffset(0);
    }

    setStartX(null);
  }

  async function handleDelete() {
    try {
      setLoading(true);

      await deleteGroup(group.id);

      setShowConfirm(false);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete group:", error);

      alert(
        error.message || "Failed to delete group."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl">
      
      {/* Delete Action Behind Card */}
      <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500">
        <button
          type="button"
          className="flex h-full w-full items-center justify-center text-white"
          onClick={() => {
            setShowConfirm(true);
          }}
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Swipeable Group Card */}
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${offset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/groups/${group.id}`}
          className="block"
        >
          <div className="flex items-center justify-between rounded-2xl bg-blue-700 p-4">
            
            {/* Group Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-400">
                {group.name.slice(0, 1).toUpperCase()}
              </div>

              <div>
                {group.name}
              </div>
            </div>

            {/* Balance */}
            <div className="flex flex-col items-end">
              {group.status === "owed" && (
                <>
                  <p className="text-xs text-green-200">
                    You are owed
                  </p>

                  <p className="font-semibold text-green-300">
                    {getCurrencySymbol(currency)}
                    {group.balance}
                  </p>
                </>
              )}

              {group.status === "owe" && (
                <>
                  <p className="text-xs text-red-200">
                    You owe
                  </p>

                  <p className="font-semibold text-red-300">
                    {getCurrencySymbol(currency)}
                    {group.balance}
                  </p>
                </>
              )}

              {group.status === "settled" && (
                <p className="text-sm text-white/50">
                  Settled up 🎉
                </p>
              )}
            </div>

          </div>
        </Link>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50">
          <div className="w-full rounded-t-3xl bg-white p-5">
            
            <h2 className="text-lg font-semibold">
              Delete group?
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              This group will be removed from your groups list.
              Financial records will be preserved.
            </p>

            <div className="mt-5 flex gap-3">
              
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 rounded-xl border py-3 font-medium disabled:opacity-50 bg-blue-400"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-500 py-3 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}