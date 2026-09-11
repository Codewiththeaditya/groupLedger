"use client";

import { useState } from "react";
import AddMemberDialog from "./add-member-dialog";


export default function GroupHeader({ group,groupId,members }) {
  const [open, setOpen] = useState(false);  
  return (
    <section className="border-b pb-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {group.name}
            </h1>

            <p className="mt-2 capitalize text-zinc-500">
            
              {group.type} • {members.length} {members.length == 1 ?"member" : "members"} 
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-md font-medium text-blue-500"
            >
              + Add
            </button>
        </div>

      </div>

      <AddMemberDialog
        open={open}
        onOpenChange={setOpen}
        groupId={groupId}
      />
    </section>
  );
}