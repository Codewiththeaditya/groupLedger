import GroupHeader from "@/features/groups/components/group-header";
import ExpensesSection from "@/features/groups/components/expenses-section";
import {
  getGroupDetails,
  getGroupExpenses,
} from "@/features/groups/services/group-server";
import { createClient } from "@/lib/supabase/server";
import {
  getGroupBalances,
  getGroupDebts,
} from "@/features/groups/services/balance-server";
import MembersBalanceSection from "@/features/groups/components/MemberBalanceSection";

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

  const { group, members } = groupDetails;

  // Current user's net balance in this group
  const currentUserBalance = balances.find(
    (balance) => balance.userId === user.id
  );

  return (
    <div className="p-5">
      <GroupHeader group={group} 
        members={members}
        groupId={group.id}
      />

      <MembersBalanceSection
        members={members}
        groupId={group.id}
        currentUserId={user.id}
        debts={debts}
        overallBalance={
          currentUserBalance?.balance || 0
        }
      />

      <ExpensesSection
        groupId={group.id}
        expenses={expenses}
      />
    </div>
  );
}