import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function createSettlement(
  groupId,
  fromUser,
  toUser,
  amount
) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("User not found.");
  }

  const settlementAmount = Number(amount);

  if (!settlementAmount || settlementAmount <= 0) {
    throw new Error(
      "Settlement amount must be greater than zero."
    );
  }

  if (fromUser === toUser) {
    throw new Error(
      "Users cannot settle with themselves."
    );
  }

  const { data, error } = await supabase
    .from("settlements")
    .insert({
      group_id: groupId,
      from_user: fromUser,
      to_user: toUser,
      amount: settlementAmount,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}