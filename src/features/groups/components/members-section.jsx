"use client";

import { useState } from "react";
import AddMemberDialog from "./add-member-dialog";

export default function MembersSection({ members, groupId }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Members ({members.length})
        </h2>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white"
        >
          Add Member
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.profiles.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                {member.profiles.full_name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="font-medium">
                  {member.profiles.full_name}
                </p>

                <p className="text-sm text-zinc-500">
                  {member.profiles.email}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-600">
              {member.role}
            </span>
          </div>
        ))}
      </div>

      <AddMemberDialog
        open={open}
        onOpenChange={setOpen}
        groupId={groupId}
      />
    </section>
  );
}