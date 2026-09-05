export default function BalanceItem({
  name,
  amount,
  status,
}) {
  const owesYou = status === "owes_you";

  return (
    <div className="flex items-center justify-between p-4 bg-blue-700 rounded-2xl">
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold ${
            owesYou ? "bg-green-400" : "bg-red-400"
          }`}
        >
          {name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <p className="font-medium">
            {name}
          </p>

          <p className="text-xs text-gray-300">
            {owesYou ? "owes you" : "you owe"}
          </p>
        </div>
      </div>

      <p
        className={`font-semibold ${
          owesYou ? "text-green-400" : "text-red-400"
        }`}
      >
        ₹{amount.toFixed(2)}
      </p>
    </div>
  );
}