export async function updateProfile({ fullName, currency }) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("User not found.");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName.trim(),
      currency,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}