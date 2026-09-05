import Link from "next/link";
import { Plus } from "lucide-react";

export default function ExpensesSection({ groupId, expenses }) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Expenses
        </h2>

        <Link
          href={`/groups/${groupId}/expenses/new`}
          className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Add Expense
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed p-8 text-center">
          <p className="font-medium">
            No expenses yet
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Add your first expense to start tracking balances.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {expenses.map((expense) => (
            <Link
              key={expense.id}
              href={`/groups/${groupId}/expenses/${expense.id}`}
              className="flex items-center justify-between rounded-2xl border p-4 transition hover:bg-zinc-50"
            >
              <div>
                <p className="font-medium">
                  {expense.description}
                </p>

                <p className="text-sm text-zinc-500">
                  Paid by {expense.profiles?.full_name}
                </p>
              </div>

              <p className="font-semibold">
                ₹{Number(expense.amount).toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}