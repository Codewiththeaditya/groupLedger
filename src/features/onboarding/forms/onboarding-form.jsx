"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthInput from "@/features/auth/components/auth-input";

import { onboardingSchema } from "@/features/onboarding/validations/onboarding-schema";
import { completeOnboarding } from "@/features/onboarding/services/onboarding-service";

import { CURRENCIES } from "@/constants/currencies";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

export default function OnboardingForm() {
  const router = useRouter();

  const [authError, setAuthError] = useState("");

  const { register, control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      currency: "INR",
    },
  });

  const onSubmit = async (values) => {
    setAuthError("");

    try {
      await completeOnboarding(values);
      router.push("/dashboard");
    } catch (error) {
      setAuthError(error.message || "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 py-2"
    >
      {/* Heading */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Complete your profile
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Let's finish setting up your account.
        </p>
      </div>

      {/* Full Name */}

      <div className="mb-5">
        <AuthInput id="full_name" label="Full Name" placeholder="Enter your full name" error={errors.full_name?.message} {...register("full_name")} />
      </div>

      {/* Phone */}

      <div className="mb-5">
        <AuthInput id="phone" type="tel" label="Phone Number (Optional)" placeholder="+91 9876543210" error={errors.phone?.message} {...register("phone")} />
      </div>

      {/* Currency */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold">
          Preferred Currency
        </label>

        <Controller
          control={control}
          name="currency"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>

              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem
                    key={currency.code}
                    value={currency.code}
                  >
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.currency && (
          <p className="mt-2 text-sm text-red-500">
            {errors.currency.message}
          </p>
        )}
      </div>

      {/* Auth Error */}

      {authError && (
        <p className="mb-4 text-center text-sm text-red-500">
          {authError}
        </p>
      )}

      {/* Button */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full rounded-lg bg-blue-500 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}