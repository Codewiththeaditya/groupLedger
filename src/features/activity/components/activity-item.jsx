export default function ActivityItem({
  activity,
  currentUserId,
}) {
  const {
    type,
    groupName,
    userId,
    userName,
    amount,
    description,
    fromUserId,
    fromUserName,
    toUserId,
    toUserName,
  } = activity;

  let message = "";

  if (type === "expense") {
    if (userId === currentUserId) {
      message = `You added ${description} ₹${amount.toFixed(2)}`;
    } else {
      message = `${userName} added ${description} ₹${amount.toFixed(2)}`;
    }
  }

  if (type === "settlement") {
    if (fromUserId === currentUserId) {
      message = `You paid ${toUserName} ₹${amount.toFixed(2)}`;
    } else if (toUserId === currentUserId) {
      message = `${fromUserName} paid you ₹${amount.toFixed(2)}`;
    } else {
      message = `${fromUserName} paid ${toUserName} ₹${amount.toFixed(2)}`;
    }
  }

  if (type === "member_joined") {
    if (userId === currentUserId) {
      message = `You joined ${groupName}`;
    } else {
      message = `${userName} joined ${groupName}`;
    }
  }

  return (
    <div className="rounded-2xl border p-4">
      <p className="font-medium">
        {message}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {groupName}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {new Date(activity.createdAt).toLocaleString()}
      </p>
    </div>
  );
}