import { createClient } from "@/lib/supabase/server";

export async function getActivity() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  // Get groups the current user belongs to
  const { data: memberships, error: membershipError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user.id);

  if (membershipError) throw membershipError;

  const groupIds = memberships.map((membership) => membership.group_id);

  if (groupIds.length === 0) {
    return [];
  }

  const [
    expensesResult,
    settlementsResult,
    membersResult,
  ] = await Promise.all([
    // Expenses
    supabase
      .from("expenses")
      .select(`
        id,
        description,
        amount,
        created_at,
        paid_by,
        groups (
          id,
          name
        ),
        payer:paid_by (
          id,
          full_name
        )
      `)
      .in("group_id", groupIds),

    // Settlements
    supabase
      .from("settlements")
      .select(`
        id,
        amount,
        created_at,
        from_user,
        to_user,
        groups (
          id,
          name
        ),
        from_profile:from_user (
          id,
          full_name
        ),
        to_profile:to_user (
          id,
          full_name
        )
      `)
      .in("group_id", groupIds),

    // Member joins
    supabase
      .from("group_members")
      .select(`
        user_id,
        joined_at,
        group_id,
        profiles (
          id,
          full_name
        ),
        groups (
          id,
          name
        )
      `)
      .in("group_id", groupIds),
  ]);

  if (expensesResult.error) throw expensesResult.error;
  if (settlementsResult.error) throw settlementsResult.error;
  if (membersResult.error) throw membersResult.error;

  const activities = [];

  // Expense activities
  for (const expense of expensesResult.data) {
    activities.push({
      id: `expense-${expense.id}`,
      type: "expense",
      createdAt: expense.created_at,

      groupId: expense.groups?.id,
      groupName: expense.groups?.name,

      userId: expense.paid_by,
      userName: expense.payer?.full_name,

      amount: Number(expense.amount),
      description: expense.description,
    });
  }

  // Settlement activities
  for (const settlement of settlementsResult.data) {
    activities.push({
      id: `settlement-${settlement.id}`,
      type: "settlement",
      createdAt: settlement.created_at,

      groupId: settlement.groups?.id,
      groupName: settlement.groups?.name,

      fromUserId: settlement.from_user,
      fromUserName: settlement.from_profile?.full_name,

      toUserId: settlement.to_user,
      toUserName: settlement.to_profile?.full_name,

      amount: Number(settlement.amount),
    });
  }

  // Member activities
  for (const member of membersResult.data) {
    activities.push({
      id: `member-${member.group_id}-${member.user_id}`,
      type: "member_joined",
      createdAt: member.joined_at,

      groupId: member.groups?.id,
      groupName: member.groups?.name,

      userId: member.user_id,
      userName: member.profiles?.full_name,
    });
  }

  // Newest first
  activities.sort(
    (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  );

  return activities;
}