import { X } from "lucide-react";

export const ConversationHeader = ({ onClose }) => (
  <div className="p-[1.14rem] flex items-center justify-between border-b border-gray-800 sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 z-10 shadow-md">
    <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-300">
      Conversations
    </h2>
    <button
      onClick={onClose}
      className="md:hidden text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/70 transition-colors text-xl flex items-center justify-center focus:outline-none"
      aria-label="Close conversation list"
    >
      <X size={20} />
    </button>
  </div>
);
