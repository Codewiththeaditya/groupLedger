"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/features/auth/actions/profile-actions";

export default function EditProfileForm({ profile }) {
  const router = useRouter();

  const [fullName, setFullName] = useState(
    profile?.full_name || ""
  );

  const [currency, setCurrency] = useState(
    profile?.currency || "INR"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setLoading(true);

      await updateProfile({
        fullName,
        currency,
      });

      router.refresh();
    } catch (error) {
      setError(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-300">
          Name
        </label>

        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mt-1 p-3 rounded-xl bg-blue-700 outline-none"
        />
      </div>

      <div>
        <label className="text-sm text-gray-300">
          Currency
        </label>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full mt-1 p-3 rounded-xl bg-blue-700 outline-none"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
          <option value="GBP">£ GBP</option>
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 rounded-xl bg-green-500 text-black font-semibold disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}