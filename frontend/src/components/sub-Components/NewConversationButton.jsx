import { CirclePlus } from "lucide-react";

export const NewConversationButton = ({ onClick }) => (
  <div className="px-4 py-3">
    <button
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full py-2.5 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg hover:shadow-blue-500/20 transform hover:scale-105"
      onClick={onClick}
    >
      <CirclePlus size={18} />
      New Conversation
    </button>
  </div>
);