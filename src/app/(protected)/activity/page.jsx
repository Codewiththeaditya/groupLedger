import { getActivity } from "@/features/activity/services/activity-server";
import ActivityItem from "@/features/activity/components/activity-item";
import { createClient } from "@/lib/supabase/server";

export default async function ActivityPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found.");
  }

  const activities = await getActivity();

  return (
    <div className="p-5 pb-24">
      <h1 className="mb-5 text-2xl font-bold">
        Activity
      </h1>

      {activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="font-medium">
            No activity yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Your group activity will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              currentUserId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}