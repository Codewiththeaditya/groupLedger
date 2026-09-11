import { createClient } from "@/lib/supabase/server";

export async function getGroups() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}


export async function getGroupDetails(groupId) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const [groupResult, membersResult] = await Promise.all([
    supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single(),

    supabase
      .from("group_members")
      .select(`
        role,
        joined_at,
        profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("group_id", groupId),
  ]);

  if (groupResult.error) throw groupResult.error;
  if (membersResult.error) throw membersResult.error;

  return {
    group: groupResult.data,
    members: membersResult.data,
  };
}


export async function getGroupExpenses(groupId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      description,
      amount,
      paid_by,
      created_by,
      created_at,
      profiles:paid_by (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("group_id", groupId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}


export async function getExpenseDetails(expenseId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      group_id,
      description,
      amount,
      paid_by,
      created_by,
      created_at,
      split_type,
      profiles:paid_by (
        id,
        full_name,
        avatar_url
      ),
      expense_splits (
        user_id,
        amount,
        profiles (
          id,
          full_name,
          avatar_url
        )
      )
    `)
    .eq("id", expenseId)
    .is("deleted_at", null)
    .single();

  if (error) throw error;

  return data;
}