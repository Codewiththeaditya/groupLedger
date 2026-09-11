import {
  getExpenseDetails,
  getGroupDetails,
} from "@/features/groups/services/group-server";

import EditSplitForm from "@/features/expenses/forms/edit-split-form";

export default async function EditSplitPage({ params, searchParams }) {
  const { groupId, expenseId } = await params;

  const {
    type,
    description,
    amount,
    paidBy,
  } = await searchParams;

  const [{ members }, expense] = await Promise.all([
    getGroupDetails(groupId),
    getExpenseDetails(expenseId),
  ]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Edit Split
      </h1>

      <p className="mt-1 text-sm text-zinc-500">
        Choose how this expense should be split
      </p>

      <EditSplitForm
        groupId={groupId}
        expense={expense}
        members={members}
        splitType={type || expense.split_type}
        description={description || expense.description}
        amount={amount || String(expense.amount)}
        paidBy={paidBy || expense.paid_by}
      />
    </div>
  );
}