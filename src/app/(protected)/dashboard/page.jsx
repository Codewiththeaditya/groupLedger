import FriendBalanceCard from "@/features/dashboard/component/FriendBalanceCard";
import { getDashboardDebts } from "@/features/groups/services/balance-server";
import { getProfile } from "@/features/auth/services/auth-server";

export default async function DashboardPage() {
  const [debts, profile] = await Promise.all([
    getDashboardDebts(),
    getProfile(),
  ]);

  const totalBalance = debts.reduce(
    (total, debt) =>
      debt.status === "owes_you"
        ? total + debt.amount
        : total - debt.amount,
    0
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pb-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
          {profile.full_name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-xs">
            Good Morning
          </p>

          <p className="text-xs font-semibold">
            {profile.full_name}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="px-4 py-3">
        <p className="text-lg font-medium px-1">
          Overall,{" "}
          {totalBalance >= 0 ? (
            <>
              you are owed{" "}
              <span className="text-green-600">
                ₹{totalBalance.toFixed(2)}
              </span>
            </>
          ) : (
            <>
              you owe{" "}
              <span className="text-red-600">
                ₹{Math.abs(totalBalance).toFixed(2)}
              </span>
            </>
          )}
        </p>

        <section className="mt-2">
          {debts.length === 0 ? (
            <p className="text-sm text-gray-400">
              You're all settled up 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {debts.map((debt) => (
                <FriendBalanceCard
                  key={debt.userId}
                  name={debt.name}
                  amount={debt.amount}
                  status={debt.status}
                  groups={debt.groups}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}