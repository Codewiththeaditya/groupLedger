export default function FriendSection({ amount, name, status }) {
  const owesYou = status === "owes_you";

  return (
    <div className="flex flex-row justify-between items-center mt-5 p-4 bg-blue-700 rounded-2xl">
      
      <div className="flex flex-row gap-3 justify-center items-center">
        <div
          className={`w-12 h-12 rounded-full flex justify-center items-center ${
            owesYou ? "bg-green-400" : "bg-red-400"
          }`}
        >
          {name?.charAt(0)?.toUpperCase()}
        </div>

        <div className="flex flex-col">
          <div className="font-medium">
            {name}
          </div>

          <div className="text-xs text-gray-200">
            {owesYou ? "owes you" : "you owe"}
          </div>
        </div>
      </div>

      <div
        className={`font-semibold ${
          owesYou ? "text-green-400" : "text-red-400"
        }`}
      >
        ₹{Number(amount).toFixed(2)}
      </div>

    </div>
  );
}