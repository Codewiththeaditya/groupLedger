import {House, Users, Activity, User} from "lucide-react";
import NavItem from "../shared/icon-button";

export default function BottomNav(){
    return (
        <nav className="fixed bottom-0 left-1/2 right-0 -translate-x-1/2 z-40 w-full max-w-md flex flex-row justify-between px-4 pt-2 pb-4 bg-white border-zinc-200">
            <div className="flex flex-row flex-1 justify-between text-zinc-500">
                <NavItem icon={House} label="Home"/>
                <NavItem icon={Users} label="Groups"/>
            </div>
            <div className="flex flex-1">

            </div>
            <div className="flex flex-1 flex-row justify-between text-zinc-500">
                <NavItem icon={Activity} label="Activity"/>
                <NavItem icon={User} label="Profile"/>
            </div>
        </nav>
    )
}