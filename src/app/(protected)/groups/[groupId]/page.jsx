import GroupHeader from "@/features/groups/components/group-header";
import MembersSection from "@/features/groups/components/members-section";
import ExpensesSection from "@/features/groups/components/expenses-section";
import {getGroupDetails,getGroupExpenses,} from "@/features/groups/services/group-server";
import { createClient } from "@/lib/supabase/server";
import BalancesSection from "@/features/groups/components/balances-section";
import { getGroupBalances, getGroupDebts} from "@/features/groups/services/balance-server";

export default async function GroupDetailsPage({ params }) {
  const { groupId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [groupDetails, expenses, balances, debts] =
  await Promise.all([
    getGroupDetails(groupId),
    getGroupExpenses(groupId),
    getGroupBalances(groupId),
    getGroupDebts(groupId),
  ]);

console.log("NET BALANCES:", balances);
console.log("DEBTS:", debts);

  const { group, members } = groupDetails;

  return (
    <div className="p-5">
      <GroupHeader group={group} />

      <MembersSection
        members={members}
        groupId={group.id}
      />

      <BalancesSection
        debts={debts}
        currentUserId={user.id}
        groupId={group.id}
      />

      <ExpensesSection
        groupId={group.id}
        expenses={expenses}
      />
    </div>
  );
}