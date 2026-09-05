import Link from "next/link";
import { getExpenseDetails } from "@/features/groups/services/group-server";
import DeleteExpenseButton from "@/features/expenses/components/delete-expense-button";

export default async function ExpenseDetailsPage({ params }) {
  const { groupId, expenseId } = await params;

  const expense = await getExpenseDetails(expenseId);

  return (
    <div className="p-5 pb-24">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/groups/${groupId}`}
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Back to group
        </Link>

        <h1 className="mt-4 text-2xl font-bold">
          {expense.description}
        </h1>

        <p className="mt-1 text-3xl font-bold">
          ₹{Number(expense.amount).toFixed(2)}
        </p>
      </div>

      {/* Expense information */}
      <div className="rounded-2xl border p-5">
        <p className="text-sm text-zinc-500">
          Paid by
        </p>

        <p className="mt-1 font-medium">
          {expense.profiles?.full_name}
        </p>

        <p className="mt-4 text-sm text-zinc-500">
          Added
        </p>

        <p className="mt-1 text-sm">
          {new Date(expense.created_at).toLocaleString()}
        </p>
      </div>

      {/* Splits */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">
          Split between
        </h2>

        <div className="mt-3 space-y-2">
          {expense.expense_splits.map((split) => (
            <div
              key={split.user_id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <p className="font-medium">
                {split.profiles?.full_name}
              </p>

              <p className="font-semibold">
                ₹{Number(split.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/groups/${groupId}/expenses/${expenseId}/edit`}
            className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-center font-semibold text-white"
          >
            Edit Expense
          </Link>

          <DeleteExpenseButton
            expenseId={expenseId}
            groupId={groupId}
          />
        </div>
      </div>
    </div>
  );
}