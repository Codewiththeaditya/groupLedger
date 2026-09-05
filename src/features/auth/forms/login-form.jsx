"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import AuthInput from "@/features/auth/components/auth-input";
import PasswordInput from "@/features/auth/components/password-input";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/validations/login-schema";
import { signIn } from "../services/auth-client";
import { getProfile } from "@/features/onboarding/services/onboarding-service";

export default function Login(){
    const [authError, setAuthError] = useState("");
    const router = useRouter();

    //react hook form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    //onSubmit
    const onSubmit = async (values) => {
        setAuthError("");

        try {
            await signIn(values);
            const profile = await getProfile();

            if (!profile.full_name) {
                router.push("/signup/onboarding");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.log(error);
            setAuthError("Something went wrong.");
        }
    };

    return(
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="px-4">
                <div className="py-3 text-3xl font-bold">
                    <h1>Log in</h1>
                </div>

                <div className="mt-4">
                    <AuthInput id="email" label={"Email address"} labelClassName={"text-sm font-semibold"} type={"email"} autoComplete="email" {...register("email")} error={errors.email?.message} />
                </div>

                <div className="mt-4">
                    < PasswordInput id="password" label={"Password"} labelClassName={"text-sm font-semibold"} className={"outline-none border h-10 rounded-lg mt-1 p-2"} error={errors.password?.message} autoComplete="current-password" {...register("password")}/>
                </div>
                


                {authError && ( <p className="text-red-500 text-sm text-center mt-3"> {authError} </p> )}

                <div className="py-4">
                    <button className="w-full h-10 font-semibold bg-blue-400 rounded-lg" type="submit" disabled={isSubmitting}>
                        {isSubmitting ?"Logging in..." :"Log in"}
                    </button>
                </div>

                <div className="py-4 pb-1 text-center">
                    <Link href="#">Forget your password?</Link>
                </div>

                <div className="pt-1  text-center">
                    <Link href="/signup">Don't have an account?</Link>
                </div>
            </div>
        </form>
    )
}