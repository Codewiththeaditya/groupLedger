import { createClient } from "@/lib/supabase/server";

export async function getProfile() {
const supabase = await createClient();

  const {data : {user}, error: authError} = await supabase.auth.getUser();

  if(authError) throw authError;
  if(!user) throw new Error("User not found.");

  const {data: profile, error} = await supabase.from('profiles')
                                                .select('*')
                                                .eq('id',user.id)
                                                .single();

  if (error) throw error;

  return profile;
}


