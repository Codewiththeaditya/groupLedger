import { createClient } from "@/lib/supabase/server";

export async function getGroupBalances(groupId) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const [
    expensesResult,
    membersResult,
    settlementsResult,
  ] = await Promise.all([
    supabase
      .from("expenses")
      .select(`
        id,
        amount,
        paid_by,
        expense_splits (
          user_id,
          amount
        )
      `)
      .eq("group_id", groupId),

    supabase
      .from("group_members")
      .select(`
        user_id,
        profiles (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("group_id", groupId),

    supabase
      .from("settlements")
      .select(`
        from_user,
        to_user,
        amount
      `)
      .eq("group_id", groupId),
  ]);

  if (expensesResult.error) throw expensesResult.error;
  if (membersResult.error) throw membersResult.error;
  if (settlementsResult.error) {
    throw settlementsResult.error;
  }

  /* ---------------- BALANCES ---------------- */

  const balances = {};

  for (const member of membersResult.data) {
    balances[member.user_id] = {
      userId: member.user_id,
      name: member.profiles?.full_name,
      avatarUrl: member.profiles?.avatar_url,
      balance: 0,
    };
  }

  /* ---------------- EXPENSES ---------------- */

  for (const expense of expensesResult.data) {
    const payer = expense.paid_by;

    const totalAmount = Number(expense.amount);

    if (balances[payer]) {
      balances[payer].balance += totalAmount;
    }

    for (const split of expense.expense_splits) {
      const userId = split.user_id;
      const splitAmount = Number(split.amount);

      if (balances[userId]) {
        balances[userId].balance -= splitAmount;
      }
    }
  }

  /* ---------------- SETTLEMENTS ---------------- */

  for (const settlement of settlementsResult.data) {
    const fromUser = settlement.from_user;
    const toUser = settlement.to_user;
    const amount = Number(settlement.amount);

    /*
      fromUser paid toUser.

      Therefore:

      fromUser:
        debt decreases
        balance increases

      toUser:
        credit decreases
        balance decreases
    */

    if (balances[fromUser]) {
      balances[fromUser].balance += amount;
    }

    if (balances[toUser]) {
      balances[toUser].balance -= amount;
    }
  }

  /* ---------------- ROUND ---------------- */

  for (const userId of Object.keys(balances)) {
    balances[userId].balance = Number(
      balances[userId].balance.toFixed(2)
    );
  }

  return Object.values(balances);
}


/* ----------------------- DEBTS ----------------------- */

export async function getGroupDebts(groupId) {
  const supabase = await createClient();

  const [
    expensesResult,
    membersResult,
    settlementsResult,
  ] = await Promise.all([
    // ---------------- EXPENSES ----------------
    supabase
      .from("expenses")
      .select(`
        id,
        paid_by,
        expense_splits (
          user_id,
          amount
        )
      `)
      .eq("group_id", groupId),

    // ---------------- MEMBERS ----------------
    supabase
      .from("group_members")
      .select(`
        user_id,
        profiles (
          id,
          full_name
        )
      `)
      .eq("group_id", groupId),

    // ---------------- SETTLEMENTS ----------------
    supabase
      .from("settlements")
      .select(`
        from_user,
        to_user,
        amount
      `)
      .eq("group_id", groupId),
  ]);

  if (expensesResult.error) throw expensesResult.error;
  if (membersResult.error) throw membersResult.error;
  if (settlementsResult.error) throw settlementsResult.error;

  /* ---------------- USER NAMES ---------------- */

  const memberNames = {};

  for (const member of membersResult.data) {
    memberNames[member.user_id] =
      member.profiles?.full_name || "Unknown User";
  }

  /* ---------------- DEBT ENGINE ---------------- */

  const debts = {};

  function addDebt(from, to, amount) {
    if (from === to || amount <= 0) {
      return;
    }

    const key = `${from}_${to}`;
    const reverseKey = `${to}_${from}`;

    // If opposite debt already exists,
    // cancel it first.
    if (debts[reverseKey]) {
      const cancelAmount = Math.min(
        amount,
        debts[reverseKey].amount
      );

      debts[reverseKey].amount -= cancelAmount;
      amount -= cancelAmount;

      if (amount <= 0) {
        return;
      }
    }

    // Add remaining debt
    if (!debts[key]) {
      debts[key] = {
        from,
        fromName: memberNames[from],
        to,
        toName: memberNames[to],
        amount: 0,
      };
    }

    debts[key].amount += amount;
  }

  /* ---------------- EXPENSES ---------------- */

  for (const expense of expensesResult.data) {
    const payer = expense.paid_by;

    for (const split of expense.expense_splits) {
      const debtor = split.user_id;
      const amount = Number(split.amount);

      // Payer doesn't owe themselves
      if (debtor === payer) {
        continue;
      }

      addDebt(
        debtor,
        payer,
        amount
      );
    }
  }

  /* ---------------- SETTLEMENTS ---------------- */

  for (const settlement of settlementsResult.data) {
    const fromUser = settlement.from_user;
    const toUser = settlement.to_user;
    const amount = Number(settlement.amount);

    /*
      Settlement:

      fromUser → toUser

      means the existing debt:

      fromUser → toUser

      should be reduced.

      Therefore we add the opposite direction:

      toUser → fromUser
    */

    addDebt(
      toUser,
      fromUser,
      amount
    );
  }

  /* ---------------- FINAL RESULT ---------------- */

  return Object.values(debts)
    .filter(
      (debt) => debt.amount > 0.01
    )
    .map((debt) => ({
      ...debt,
      amount: Number(
        debt.amount.toFixed(2)
      ),
    }));
}

export async function getDashboardDebts() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  // Get all groups of current user
  const { data: groupMembers, error: groupError } = await supabase
    .from("group_members")
    .select(`
      group_id,
      groups (
        id,
        name
      )
    `)
    .eq("user_id", user.id);

  if (groupError) throw groupError;

  if (!groupMembers?.length) {
    return [];
  }

  const allDebts = [];

  // Get debts group by group
  for (const group of groupMembers) {
    const debts = await getGroupDebts(group.group_id);

    for (const debt of debts) {
      if (debt.to === user.id) {
        allDebts.push({
          groupId: group.group_id,
          groupName: group.groups?.name || "Unknown Group",
          userId: debt.from,
          name: debt.fromName,
          amount: debt.amount,
          direction: "owes_you",
        });
      } else if (debt.from === user.id) {
        allDebts.push({
          groupId: group.group_id,
          groupName: group.groups?.name || "Unknown Group",
          userId: debt.to,
          name: debt.toName,
          amount: -debt.amount,
          direction: "you_owe",
        });
      }
    }
  }

  /*
    Combine by person.

    Example:

    Aditya:
      Trip       +₹1300
      Dinner      -₹600

    Net:
      +₹700
  */

  const people = {};

  for (const debt of allDebts) {
    if (!people[debt.userId]) {
      people[debt.userId] = {
        userId: debt.userId,
        name: debt.name,
        balance: 0,
        groups: {},
      };
    }

    people[debt.userId].balance += debt.amount;

    if (!people[debt.userId].groups[debt.groupId]) {
      people[debt.userId].groups[debt.groupId] = {
        groupId: debt.groupId,
        groupName: debt.groupName,
        amount: 0,
      };
    }

    people[debt.userId].groups[debt.groupId].amount += debt.amount;
  }

  /*
    Convert into final UI structure.

    Only keep people with a non-zero NET balance.
  */

  return Object.values(people)
    .map((person) => {
      const balance = Number(person.balance.toFixed(2));

      const groups = Object.values(person.groups)
        .map((group) => ({
          ...group,
          amount: Number(group.amount.toFixed(2)),
        }))
        .filter((group) => Math.abs(group.amount) > 0.01);

      return {
        userId: person.userId,
        name: person.name,
        amount: Math.abs(balance),
        status: balance > 0 ? "owes_you" : "you_owe",
        groups,
      };
    })
    .filter((person) => person.amount > 0.01);
}

export async function getGroupsWithBalance() {
  const supabase = await createClient();

  /* ---------------- AUTH ---------------- */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("User not found.");
  }

  /* ---------------- FETCH GROUPS ---------------- */

  const { data: memberships, error: groupsError } =
    await supabase
      .from("group_members")
      .select(`
        group_id,
        groups (
          id,
          name,
          created_by
        )
      `)
      .eq("user_id", user.id);

  if (groupsError) {
    throw groupsError;
  }

  const groups = memberships
  .map((membership) => membership.groups)
  .filter(Boolean);

  if (groups.length === 0) {
    return [];
  }

  const groupIds = groups.map((group) => group.id);

  /* ---------------- FETCH EXPENSES ---------------- */

  const { data: expenses, error: expensesError } =
    await supabase
      .from("expenses")
      .select(`
        group_id,
        amount,
        paid_by,
        expense_splits (
          user_id,
          amount
        )
      `)
      .in("group_id", groupIds);

  if (expensesError) {
    throw expensesError;
  }

  /* ---------------- FETCH SETTLEMENTS ---------------- */

  const { data: settlements, error: settlementsError } =
    await supabase
      .from("settlements")
      .select(`
        group_id,
        from_user,
        to_user,
        amount
      `)
      .in("group_id", groupIds);

  if (settlementsError) {
    throw settlementsError;
  }

  /* ---------------- INITIALIZE BALANCES ---------------- */

  const groupBalances = {};

  for (const group of groups) {
    groupBalances[group.id] = 0;
  }

  /* ---------------- EXPENSE ACCOUNTING ---------------- */

  for (const expense of expenses || []) {
    const groupId = expense.group_id;

    /*
      If current user paid:
      + full expense amount
    */

    if (expense.paid_by === user.id) {
      groupBalances[groupId] += Number(expense.amount);
    }

    /*
      If current user has a split:
      - their split amount
    */

    for (const split of expense.expense_splits || []) {
      if (split.user_id === user.id) {
        groupBalances[groupId] -= Number(split.amount);
      }
    }
  }

  /* ---------------- SETTLEMENT ACCOUNTING ---------------- */

  for (const settlement of settlements || []) {
    const groupId = settlement.group_id;
    const amount = Number(settlement.amount);

    /*
      Current user paid someone:
      debt decreases
      balance increases
    */

    if (settlement.from_user === user.id) {
      groupBalances[groupId] += amount;
    }

    /*
      Current user received money:
      credit decreases
      balance decreases
    */

    if (settlement.to_user === user.id) {
      groupBalances[groupId] -= amount;
    }
  }

  /* ---------------- RETURN GROUP STATUS ---------------- */

  return groups.map((group) => {
    const balance = Number(
      groupBalances[group.id].toFixed(2)
    );

    let status = "settled";

    if (balance > 0.01) {
      status = "owed";
    }

    if (balance < -0.01) {
      status = "owe";
    }

    return {
      ...group,
      balance: Math.abs(balance),
      status,
    };
  });
}