export default function FriendBalanceCard({
  name,
  amount,
  status,
  groups,
}) {
  const owesYou = status === "owes_you";

  return (
    <div className="p-4 rounded-2xl bg-blue-700">
      {/* Friend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-semibold">
            {name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <p className="font-medium">
              {name}
            </p>

            <p
              className={`text-xs ${
                owesYou ? "text-green-400" : "text-red-400"
              }`}
            >
              {owesYou ? "owes you" : "you owe"}
            </p>
          </div>
        </div>

        <p className={`text-lg font-semibold ${ owesYou ? "text-green-400" :"text-red-400"}`}>
          ₹{amount.toFixed(2)}
        </p>
      </div>

      {/* Groups */}
      <div className="mt-4 ml-14 space-y-2">
        {groups.map((group) => (
          <div
            key={group.groupId}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-300">
              {group.groupName}
            </span>

            <span className={`text-gray-200 ${ owesYou ? "text-green-400" :"text-red-400"}`}>
              ₹{Math.abs(group.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}