import React from "react";
import { formatTimestamp } from "../../utils/formateData";
import { useSocket } from "../../Socket/useSocketContext";

export const ConversationItem = ({ conversation, isSelected, onSelect }) => {
  const { isUserOnline } = useSocket();

  const isOnline =
    conversation?.participants && isUserOnline(conversation.participants._id);

  return (
    <div
      onClick={onSelect}
      className={`p-3 ${
        isSelected ? "bg-blue-600/20 ring-1 ring-blue-500" : "hover:bg-gray-800"
      } rounded-xl cursor-pointer transition-all active:scale-98 border border-gray-800 hover:border-gray-700`}
    >
      <div className="flex items-center">
        <div className="relative">
          <img
            src={
              conversation?.participants?.avatar ||
              `https://avatar.iran.liara.run/username?username=${conversation?.participants?.avatar}`
            }
            alt=""
            className="w-12 h-12 rounded-full border-2 border-gray-700"
          />

          {conversation.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex-shrink-0 h-5 w-5 bg-blue-500 rounded-full text-xs flex items-center justify-center shadow-lg shadow-blue-500/30 font-bold border border-gray-900">
              {conversation.unreadCount}
            </span>
          )}

          {/* Show online status indicator */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
          )}
        </div>

        <div className="ml-3 flex-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm truncate">
              {conversation?.participants?.name || "Unknown User"}
            </p>
            <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
              {formatTimestamp(conversation.updatedAt)}
            </span>
          </div>

          <p className="text-xs text-gray-400 truncate mt-1">
            {conversation.participants?.email || ""}
          </p>

          <p
            className={`text-xs mt-2 truncate ${
              isSelected ? "text-blue-200" : "text-gray-300"
            }`}
          >
            {conversation.lastMessage || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
};
