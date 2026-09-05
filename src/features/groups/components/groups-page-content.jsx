import { getGroups } from "@/features/groups/services/group-server";
import Link from "next/link";
import { getProfile } from "@/features/auth/services/auth-server";
import { getCurrencySymbol } from "@/constants/currencies";
import { Plus } from "lucide-react";

export default async function GroupsPage() {
  const [groups, userProfile] = await Promise.all([ getGroups(), getProfile(), ]);
  

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
        Create
      </Link>
    </div>

      {groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        groups.map((group) => (
          <Link key={group.id}  href={`/groups/${group.id}`}>
            <div className="flex flex-row justify-between items-center mt-5 p-4 bg-blue-700 rounded-2xl">
                <div className="flex flex-row gap-3 justify-center items-center">
                    <div  className="w-12 h-12 rounded-full bg-green-400 flex justify-center items-center">A</div>
                    <div>{group.name}</div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="text-xs">status</div>
                    <div>{getCurrencySymbol(userProfile.currency)}</div>
                </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

