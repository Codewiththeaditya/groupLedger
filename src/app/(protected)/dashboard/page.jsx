import Header from "@/component/dashboard/Header";
import FriendBalanceCard from "@/features/dashboard/component/FriendBalanceCard";
import { getDashboardDebts } from "@/features/groups/services/balance-server";

export default async function DashboardPage() {
  const debts = await getDashboardDebts();

  const totalBalance = debts.reduce((total, debt) => {
    return debt.status === "owes_you"
      ? total + debt.amount
      : total - debt.amount;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-5">
        <p className="text-lg font-medium">
          Overall,{" "}
          {totalBalance >= 0 ? (
            <>
              you are owed{" "}
              <span className="text-green-500">
                ₹{totalBalance.toFixed(2)}
              </span>
            </>
          ) : (
            <>
              you owe{" "}
              <span className="text-red-400">
                ₹{Math.abs(totalBalance).toFixed(2)}
              </span>
            </>
          )}
        </p>

        {/* Balances */}
        <section className="mt-6">
          {debts.length === 0 ? (
            <p className="text-gray-400 text-sm">
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