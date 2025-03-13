import { EllipsisVertical, Send, ArrowLeft } from "lucide-react";
import { formatTimestamp } from "../../utils/formateData";

const MessageBubble = ({ message, currentUserId }) => {
  const isSender = message.sender?._id === currentUserId;
  const senderInitial = message.sender?.name?.charAt(0) || "U";

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4 h-full`}>
      {!isSender && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
          {message.sender?.avatar ? (
            <img
              src={
                message?.sender?.avatar ||
                `https://avatar.iran.liara.run/username?username=${message?.sender?.name}`
              }
              alt={`${message.sender.name}'s avatar`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-medium">{senderInitial}</span>
          )}
        </div>
      )}

      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg shadow-md ${
          isSender
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-l-lg rounded-tr-lg"
            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg"
        } px-4 py-2`}
      >
        <div className="break-words">{message.text}</div>

        <div
          className={`flex justify-end text-xs mt-1 ${
            isSender ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatTimestamp(message.createdAt || message.timestamp)}
          {isSender && message.isRead && <span className="ml-1">✓</span>}
        </div>
      </div>

      {isSender && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
          {message.sender?.avatar ? (
            <img
              src={
                message?.sender?.avatar ||
                `https://avatar.iran.liara.run/username?username=${message.sender.name}`
              }
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-medium">{senderInitial}</span>
          )}
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-[1.2rem]">
    <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-2xl p-3 shadow border border-gray-700/50">
      <div className="flex space-x-1.5">
        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"></div>
        <div
          className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  </div>
);

const ChatHeader = ({ conversation, isOnline, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-4 py-3 flex items-center shadow-md sticky top-0 z-10">
      <button
        onClick={onClose}
        className="md:hidden p-2 mr-2 text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="flex items-center">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
            <img
              src={
                conversation?.participants?.avatar ||
                `https://avatar.iran.liara.run/username?username=${conversation?.participants?.name}`
              }
              alt={conversation?.participants?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-gray-900"></span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200 text-base">
            {conversation?.participants?.name || "Unknown User"}
          </h3>
          <p className="text-xs text-green-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="ml-auto">
        <button className="p-2 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-700/50 transition-colors">
          <EllipsisVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export { ChatHeader, TypingIndicator, MessageBubble };
