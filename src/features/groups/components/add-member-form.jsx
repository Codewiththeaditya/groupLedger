"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  findUserByEmail,
  addGroupMember,
} from "../services/group-client";

export default function AddMemberForm({
  groupId,
  onSuccess,
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSearch(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setUser(null);

    if (!email.trim()) {
      setError("Enter an email address.");
      return;
    }

    try {
      setLoading(true);

      const profile = await findUserByEmail(email);

      if (!profile) {
        setError("No user found with this email.");
        return;
      }

      setUser(profile);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember() {
    if (!user) return;

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      await addGroupMember(groupId, user.id);

      setSuccess(`${user.full_name} added successfully.`);

      setEmail("");
      setUser(null);

      router.refresh();

      setTimeout(() => {
        onSuccess?.();
      }, 500);
    } catch (error) {
      console.error(error);

      if (error.code === "23505") {
        setError("This user is already a member of the group.");
      } else {
        setError("Failed to add member.");
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearch}
        className="flex gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="min-w-0 flex-1 rounded-xl border px-3 py-2 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-500 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600">
          {success}
        </p>
      )}

      {user && (
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-3">
          <div>
            <p className="font-medium">
              {user.full_name}
            </p>

            <p className="text-sm text-zinc-500">
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddMember}
            disabled={adding}
            className="rounded-xl bg-green-500 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}