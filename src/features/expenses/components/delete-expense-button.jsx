"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteExpense } from "../services/expense-client";

export default function DeleteExpenseButton({
  expenseId,
  groupId,
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteExpense(expenseId);

      router.push(`/groups/${groupId}`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting expense:", error);
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="flex-1 rounded-xl border border-red-500 px-4 py-3 font-semibold text-red-500 disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Expense"}
    </button>
  );
}