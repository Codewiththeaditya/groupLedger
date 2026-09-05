"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function CreateGroupHeader({
  title = "Create Group",
  isSubmitting,
}) {
  const router = useRouter();

  return (
    <header className="grid grid-cols-3 items-center border-b pb-3">
      <Button
        type="button"
        variant="ghost"
        className="justify-self-start p-0 text-md font-semibold text-blue-500 hover:bg-transparent"
        onClick={() => router.back()}
      >
        Cancel
      </Button>

      <h1 className="justify-self-center font-semibold">
        {title}
      </h1>

      <Button
        type="submit"
        form="create-group-form"
        variant="ghost"
        disabled={isSubmitting}
        className="justify-self-end p-0 text-blue-500 text-md font-semibold hover:bg-transparent"
      >
        {isSubmitting ? "Creating..." : "Done"}
      </Button>
    </header>
  );
}