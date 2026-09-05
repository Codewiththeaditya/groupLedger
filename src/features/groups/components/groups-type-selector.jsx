"use client";

import { Plane, House, Heart, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

const GROUP_TYPES = [
  {
    value: "trip",
    label: "Trip",
    icon: Plane,
  },
  {
    value: "home",
    label: "Home",
    icon: House,
  },
  {
    value: "couple",
    label: "Couple",
    icon: Heart,
  },
  {
    value: "general",
    label: "General",
    icon: Folder,
  },
];

export default function GroupTypeSelector({
  value,
  onChange,
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">
        Group Type
      </p>

      <div className="grid grid-cols-4 gap-3">
        {GROUP_TYPES.map((type) => {
          const Icon = type.icon;

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border p-3 transition-all",
                value === type.value
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-zinc-200 hover:border-zinc-300"
              )}
            >
              <Icon size={28} />

              <span className="mt-2 text-sm font-medium">
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}