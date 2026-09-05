"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthInput from "@/features/auth/components/auth-input";
import CreateGroupHeader from "@/features/groups/components/create-group-header";

import { groupSchema } from "@/features/groups/validations/group-schema";
import { createGroup } from "@/features/groups/services/group-client";

import { Controller } from "react-hook-form";
import GroupTypeSelector from "@/features/groups/components/groups-type-selector";

export default function CreateGroupForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      type: "general",
    },
  });

  const onSubmit = async (values) => {
    setServerError("");

    try {
      const group = await createGroup(values);

      router.push(`/groups/${group.id}`);
    } catch (error) {
      setServerError(error.message || "Something went wrong.");
    }
  };

  return (
    <>
      <CreateGroupHeader isSubmitting={isSubmitting} />

      <form
        id="create-group-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-5"
      >
        {/* Group Icon */}

        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border bg-muted text-3xl">
            👥
          </div>
        </div>

        {/* Group Name */}

        <div>
          <AuthInput
          id="name"
          label="Group Name"
          placeholder="Goa Trip"
          error={errors.name?.message}
          className='box-border'
          labelClassName='px-1'
          {...register("name")}
        />
        </div>
        

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <GroupTypeSelector
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Server Error */}

        {serverError && (
          <p className="text-center text-sm text-red-500">
            {serverError}
          </p>
        )}
      </form>
    </>
  );
}