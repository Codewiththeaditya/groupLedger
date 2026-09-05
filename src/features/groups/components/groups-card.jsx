"use client";

import Link from "next/link";
import { Plane, House, Heart, Folder, ChevronRight, } from "lucide-react";

const ICONS = { trip: Plane, home: House, couple: Heart, general: Folder, };

export default function GroupCard({ group }) {
  const Icon = ICONS[group.type] || Folder;

  return (
    <Link href={`/groups/${group.id}`}>
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 my-3 transition hover:bg-zinc-50">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-zinc-900">
              {group.name}
            </h2>

            <p className="text-sm text-zinc-500 capitalize">
              {group.type}
            </p>
          </div>
        </div>

        <ChevronRight
          size={20}
          className="text-zinc-400"
        />
      </div>
    </Link>
  );
}