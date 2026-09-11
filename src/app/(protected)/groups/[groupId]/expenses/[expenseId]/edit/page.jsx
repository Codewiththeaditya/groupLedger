import {
  getExpenseDetails,
  getGroupDetails,
} from "@/features/groups/services/group-server";

import ExpenseForm from "@/features/expenses/forms/expense-form";
import { createClient } from "@/lib/supabase/server";

export default async function EditExpensePage({ params }) {
  const { groupId, expenseId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ group, members }, expense] = await Promise.all([
    getGroupDetails(groupId),
    getExpenseDetails(expenseId),
  ]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Edit Expense
      </h1>

      <p className="mt-1 text-sm text-zinc-500">
        {group.name}
      </p>

      <ExpenseForm
        groupId={groupId}
        members={members}
        currentUserId={user.id}
        expense={expense}
        mode="edit"
      />
    </div>
  );
}