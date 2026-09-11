import { getGroupsWithBalance } from "@/features/groups/services/balance-server";
import Link from "next/link";
import { getProfile } from "@/features/auth/services/auth-server";
import { Plus } from "lucide-react";
import GroupCard from "@/features/groups/components/group-card";

export default async function GroupsPage() {
  const [groups, userProfile] = await Promise.all([
    getGroupsWithBalance(),
    getProfile(),
  ]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between px-4">
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
        <div>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              currency={userProfile.currency}
            />
          ))}
        </div>
      )}
    </div>
  );
}