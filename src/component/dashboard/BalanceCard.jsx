export default function BalanceCard({ debts }) {
  const youAreOwed = debts
    .filter((debt) => debt.status === "owes_you")
    .reduce((total, debt) => total + debt.amount, 0);

  const youOwe = debts
    .filter((debt) => debt.status === "you_owe")
    .reduce((total, debt) => total + debt.amount, 0);

  const totalBalance = youAreOwed - youOwe;

  const formatAmount = (amount) =>
    `₹${Math.abs(amount).toFixed(2)}`;

  return (
    <div className="p-6 mt-6 bg-blue-400 rounded-2xl">
      <p className="text-xs font-medium uppercase mb-1 text-white/70">
        TOTAL BALANCE
      </p>

      <div
        className={`text-5xl font-semibold mt-1 ${
          totalBalance >= 0
            ? "text-green-300"
            : "text-red-300"
        }`}
      >
        {totalBalance >= 0 ? "+" : "-"}
        {formatAmount(totalBalance)}
      </div>

      <p className="text-xs mt-2 text-white/80">
        {totalBalance >= 0
          ? "You're net positive"
          : "You're net negative"}
      </p>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="p-3 backdrop-blur-md bg-white/80 text-black rounded-2xl">
          <p className="text-sm">
            You are owed
          </p>

          <p className="text-lg font-semibold mt-1 text-green-600">
            {formatAmount(youAreOwed)}
          </p>
        </div>

        <div className="p-3 backdrop-blur-md bg-white/80 text-black rounded-2xl">
          <p className="text-sm">
            You owe
          </p>

          <p className="text-lg font-semibold mt-1 text-red-500">
            {formatAmount(youOwe)}
          </p>
        </div>
      </div>
    </div>
  );
}