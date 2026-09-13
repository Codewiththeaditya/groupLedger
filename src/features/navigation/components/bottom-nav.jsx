"use client";

import { House, Users, Activity, User } from "lucide-react";
import IconButton from "@/component/shared/icon-button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", icon: House, label: "Home" },
        { href: "/groups", icon: Users, label: "Groups" },
        { href: "/activity", icon: Activity, label: "Activity" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-1/2 right-0 -translate-x-1/2 z-40 w-full max-w-md flex flex-row justify-between px-4 pt-2 pb-4 bg-background border-t border-zinc-200 shadow-sm">
            <div className="flex-1 grid grid-cols-4 gap-3 items-end">
                
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={
                            pathname === item.href
                                ? "text-blue-500"
                                : "text-zinc-500"
                        }
                    >
                        <IconButton
                            icon={item.icon}
                            label={item.label}
                        />
                    </Link>
                ))}

            </div>
        </nav>
    );
}