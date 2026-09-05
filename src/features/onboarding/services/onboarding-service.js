import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function completeOnboarding(values) {
  // Current logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("User not found.");
  }

  // Update profile
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: values.full_name,
      phone: values.phone || null,
      currency: values.currency,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getProfile() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) throw error;

    return data;
}