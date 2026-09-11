import { getGroupDetails } from "@/features/groups/services/group-server";
import SplitExpenseForm from "@/features/expenses/forms/split-expense-form";

export default async function SplitExpensePage({
  params,
  searchParams,
}) {
  const { groupId } = await params;

  const {
    type,
    description,
    amount,
    paidBy,
  } = await searchParams;

  const { members } =
    await getGroupDetails(groupId);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">
        Split Expense
      </h1>

      <SplitExpenseForm
        groupId={groupId}
        members={members}
        type={type || "equal"}
        description={description || ""}
        amount={amount || ""}
        paidBy={paidBy || ""}
      />
    </div>
  );
}