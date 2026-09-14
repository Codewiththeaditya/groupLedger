import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

function buildSplits(expenseId, values) {
  const selectedMembers = values.split_between;

  if (!selectedMembers || selectedMembers.length === 0) {
    throw new Error("At least one member is required.");
  }

  const totalPaise = Math.round(Number(values.amount) * 100);

  // =========================
  // PERCENTAGE SPLIT
  // =========================
  if (values.split_type === "percentage") {
    const percentageTotal = selectedMembers.reduce(
      (total, userId) => {
        return (
          total +
          Number(values.percentages?.[userId] || 0)
        );
      },
      0
    );

    if (Math.abs(percentageTotal - 100) > 0.001) {
      throw new Error(
        "Percentages must add up to 100%."
      );
    }

    const splits = selectedMembers.map((userId) => {
      const percentage = Number(
        values.percentages?.[userId] || 0
      );

      const amountPaise = Math.round(
        (totalPaise * percentage) / 100
      );

      return {
        expense_id: expenseId,
        user_id: userId,
        amount: amountPaise / 100,
      };
    });

    // Fix any paise rounding difference
    const calculatedTotalPaise = splits.reduce(
      (total, split) => {
        return total + Math.round(split.amount * 100);
      },
      0
    );

    const difference =
      totalPaise - calculatedTotalPaise;

    if (difference !== 0) {
      const lastSplit = splits[splits.length - 1];

      lastSplit.amount =
        (Math.round(lastSplit.amount * 100) +
          difference) /
        100;
    }

    return splits;
  }

  // =========================
  // CUSTOM AMOUNT SPLIT
  // =========================
  if (values.split_type === "custom") {
    const splits = selectedMembers.map((userId) => {
      const amountPaise = Math.round(
        Number(values.custom_amounts?.[userId] || 0) *
          100
      );

      return {
        expense_id: expenseId,
        user_id: userId,
        amount: amountPaise / 100,
      };
    });

    const splitTotalPaise = splits.reduce(
      (total, split) => {
        return total + Math.round(split.amount * 100);
      },
      0
    );

    if (splitTotalPaise !== totalPaise) {
      throw new Error(
        "Custom split amounts must equal the expense amount."
      );
    }

    return splits;
  }

  // =========================
  // EQUAL SPLIT
  // =========================
  const memberCount = selectedMembers.length;

  const basePaise = Math.floor(
    totalPaise / memberCount
  );

  const remainderPaise =
    totalPaise % memberCount;

  return selectedMembers.map((userId, index) => {
    const amountPaise =
      basePaise +
      (index < remainderPaise ? 1 : 0);

    return {
      expense_id: expenseId,
      user_id: userId,
      amount: amountPaise / 100,
    };
  });
}


// ========================================
// CREATE EXPENSE
// ========================================

export async function createExpense(groupId, values) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("User not found.");
  }

  // Validate split BEFORE creating expense
  buildSplits("validation", values);

  const { data: expense, error: expenseError } =
    await supabase
      .from("expenses")
      .insert({
        group_id: groupId,
        description: values.description,
        amount: values.amount,
        paid_by: values.paid_by,
        created_by: user.id,
        split_type: values.split_type,
      })
      .select()
      .single();

  if (expenseError) throw expenseError;

  const splits = buildSplits(
    expense.id,
    values
  );

  const { error: splitError } =
    await supabase
      .from("expense_splits")
      .insert(splits);

  if (splitError) throw splitError;

  return expense;
}


// ========================================
// UPDATE EXPENSE
// ========================================

export async function updateExpense(
  expenseId,
  values
) {
  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("User not found.");
  }

  // Update expense
  const {
    data: expense,
    error: expenseError,
  } = await supabase
    .from("expenses")
    .update({
      description: values.description,
      amount: values.amount,
      paid_by: values.paid_by,
      split_type: values.split_type,
    })
    .eq("id", expenseId)
    .select()
    .single();

  if (expenseError) throw expenseError;

  // Build new splits
  const splits = buildSplits(
    expense.id,
    values
  );

  // Delete old splits
  const { error: deleteError } =
    await supabase
      .from("expense_splits")
      .delete()
      .eq("expense_id", expenseId);

  if (deleteError) throw deleteError;

  // Insert new splits
  const { error: splitError } =
    await supabase
      .from("expense_splits")
      .insert(splits);

  if (splitError) throw splitError;

  return expense;
}


// ========================================
// DELETE EXPENSE
// ========================================

export async function deleteExpense(expenseId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);

  if (error) throw error;

  return true;
}