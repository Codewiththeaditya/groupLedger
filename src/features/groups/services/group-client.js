import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/* ----------------------- CREATE GROUP ----------------------- */

export async function createGroup(values) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: values.name,
      type: values.type,
      created_by: user.id,
    })
    .select()
    .single();

  if (groupError) throw groupError;

  const { error: memberError } = await supabase
    .from("group_members")
    .insert({
      group_id: group.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) throw memberError;

  return group;
}

/* ----------------------- ADD MEMBER ----------------------- */

export async function addGroupMember(groupId, userId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const { error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      user_id: userId,
      role: "member",
    });

  if (error) throw error;

  return true;
}

/* -------------------- SEARCH USER BY EMAIL -------------------- */

export async function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) throw error;

  return profile;
}