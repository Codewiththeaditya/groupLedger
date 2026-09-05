import {House, Users, Activity, User} from "lucide-react";
import IconButton from "@/component/shared/icon-button";
import Link from "next/link";
export default function BottomNav(){
    return (
        <nav className="fixed bottom-0 left-1/2 right-0 -translate-x-1/2 z-40 w-full max-w-md flex flex-row justify-between px-4 pt-2 pb-4 bg-background border-t border-zinc-200 shadow-sm">
            <div className=" flex-1 grid grid-cols-4 gap-3 items-end">
                <div className="text-zinc-500">
                    <Link href="/dashboard">
                        <IconButton icon={House} label="Home"/>
                    </Link>
                </div>
                
                <div className="text-zinc-500">
                    <Link href="/groups">
                        <IconButton icon={Users} label="Groups"/>
                    </Link>
                </div>

                <div className="text-zinc-500">
                    <Link href="/activity">
                        <IconButton icon={Activity} label="Activity"/>
                    </Link>
                </div>

                <div className="text-zinc-500">
                    <Link href="/profile">
                        <IconButton icon={User} label="Profile"/>
                    </Link>
                </div>
            </div>
        </nav>
    )
}