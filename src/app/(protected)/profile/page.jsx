import { getProfile } from "@/features/auth/services/auth-server";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/features/auth/components/LogoutButton";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getProfile();

  const initial =
    profile?.full_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Profile
      </h1>

      {/* Profile header */}
      <section className="flex flex-col items-center mt-8">
        <div className="w-20 h-20 rounded-full bg-green-400 flex items-center justify-center text-3xl font-bold text-black">
          {initial}
        </div>

        <h2 className="text-xl font-semibold mt-3">
          {profile?.full_name || "User"}
        </h2>

        <p className="text-sm text-white/50 mt-1">
          {user?.email}
        </p>
      </section>

      {/* Account */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-5">
          Account
        </h2>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-white/50">
              Name
            </p>

            <p className="mt-1 font-medium">
              {profile?.full_name || "Not set"}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">
              Email
            </p>

            <p className="mt-1 font-medium break-all">
              {user?.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-white/50">
              Currency
            </p>

            <p className="mt-1 font-medium">
              {profile?.currency || "Not set"}
            </p>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="mt-10">
        <LogoutButton />
      </section>
    </div>
  );
}