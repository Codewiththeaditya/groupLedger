import { getGroupDetails } from "@/features/groups/services/group-server";
import ExpenseForm from "@/features/expenses/forms/expense-form";

export default async function NewExpensePage({ params }) {
  const { groupId } = await params;

  const { group, members } = await getGroupDetails(groupId);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Add Expense
      </h1>

      <p className="mt-1 text-sm text-zinc-500">
        {group.name}
      </p>

      <ExpenseForm groupId={groupId} members={members}/>
    </div>
  );
}