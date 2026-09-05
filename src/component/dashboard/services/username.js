"use client"
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function username(){
    const { data: { user }, } = await supabase.auth.getUser();

    if (user) {
        const { data, error } = await supabase
            .from("profile")
            .select("full_name")
            .eq("id", user.id)
            .single();

        if (error) {
            console.error(error);
        } else {
            console.log(data.full_name);
        }
    }
}