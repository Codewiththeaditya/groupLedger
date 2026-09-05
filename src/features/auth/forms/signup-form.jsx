"use client";

import Link from "next/link";
import {useState} from "react";
import AuthInput from "@/features/auth/components/auth-input";
import PasswordInput from "@/features/auth/components/password-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/features/validations/signup-schema";
import { signUp } from "../services/auth-client";
import { useRouter } from "next/navigation";

export default function Signup(){
    const [authError, setAuthError] = useState("");
    const router = useRouter();


    const {register, handleSubmit, formState: {errors, isSubmitting},} = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values) => {
        setAuthError("");
        try {
            await signUp(values);
            router.push("/signup/onboarding");
        }catch(error){
            console.log(error);
            setAuthError("Something went wrong.");
        }
    };

    

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-4">
                <div className="py-3 text-3xl font-bold">
                    <h1>Sign up</h1>
                </div>

                <div className="mt-4">
                    <AuthInput id="email" label={"Email address"} labelClassName={"text-sm font-semibold"} type={"email"} autoComplete="email" error={errors.email?.message} {...register("email")}  />
                </div>

                <div className="mt-4">
                    < PasswordInput id="password" label={"Password"} labelClassName={"text-sm font-semibold"} autoComplete="new-password" className={"outline-none border h-10 rounded-lg mt-1 p-2 box-border"} error={errors.password?.message} {...register("password")}/>
                </div>

                {authError && (<p className="text-red-500 text-center mt-2">{authError}</p>)}

                <div className="py-4">
                    <button type="submit" disabled={isSubmitting} className="w-full h-10 font-semibold bg-blue-400 rounded-lg" >
                        {isSubmitting ? "Signing up ..." : "Signup"}
                    </button>
                </div>

                <div className="py-4 flex justify-center">
                    <Link href="/login">Already have an account?</Link>
                </div>
            </div>
        </form>
    )
}