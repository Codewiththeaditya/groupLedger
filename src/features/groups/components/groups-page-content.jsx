import { getGroupsWithBalance } from "@/features/groups/services/balance-server";
import Link from "next/link";
import { getProfile } from "@/features/auth/services/auth-server";
import { getCurrencySymbol } from "@/constants/currencies";
import { Plus } from "lucide-react";

export default async function GroupsPage() {
  const [groups, userProfile] = await Promise.all([ getGroupsWithBalance(), getProfile(), ]);
  
  console.log(groups,userProfile);
  return (
    <div>
      <div className="flex items-center justify-between px-4 mb-5">
      <h1 className="text-2xl font-bold">
        Groups
      </h1>

      <Link
        href="/groups/create"
        className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Create Group
      </Link>
    </div>

      {groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        groups.map((group) => (
          <Link key={group.id}  href={`/groups/${group.id}`}>
            <div className="flex flex-row justify-between items-center mt-5 p-4 bg-blue-700 rounded-2xl">
                <div className="flex flex-row gap-3 justify-center items-center">
                    <div  className="w-12 h-12 rounded-full bg-green-400 flex justify-center items-center">{group.name.slice(0,1).toUpperCase()}</div>
                    <div>{group.name}</div>
                </div>
                {/* Balance */}
                <div className="flex flex-col items-end">
                  {group.status === "owed" && (
                    <>
                      <p className="text-xs text-green-200">
                        You are owed
                      </p>

                      <p className="font-semibold text-green-300">
                        {getCurrencySymbol(userProfile.currency)}
                        {group.balance}
                      </p>
                    </>
                  )}

                  {group.status === "owe" && (
                    <>
                      <p className="text-xs text-red-200">
                        You owe
                      </p>

                      <p className="font-semibold text-red-300">
                        {getCurrencySymbol(userProfile.currency)}
                        {group.balance}
                      </p>
                    </>
                  )}

                  {group.status === "settled" && (
                    <p className="text-sm text-white/50">
                      Settled up 🎉
                    </p>
                  )}
                </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

