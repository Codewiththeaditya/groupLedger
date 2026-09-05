import { createClient } from "@/lib/supabase/client";
import { Currency } from "lucide-react";

const supabase = createClient();

export async function getProfile(userId){
    const {data, error} = await supabase.from("profiles").select("*").eq("id",userId).single();

    if(error){
        throw error;
    }

    return data;
}


export async function updateProfile(userId, values){
    const {data, error} = await supabase.from("profiles").update({
        full_name: values.full_name,
        currency: values.currency,
        updated_at: new Date().toISOString(),
    })
    .eq("id",userId)
    .select()
    .single();

    if (error){
        throw error;
    }

    return data;
}