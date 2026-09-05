import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BottomNav from "@/features/navigation/components/bottom-nav";

export default async function ProtectedLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto min-h-screen w-full max-w-md">
        <div className="min-h-screen px-5 pt-6 pb-24">
          {children}
        </div>

        <BottomNav />
      </div>
    </main>
  );
}