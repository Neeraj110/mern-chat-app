import { CirclePlus, Search } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-gradient-to-r border-blue-500 "></div>
  </div>
);

export const ErrorMessage = ({ error, onRetry }) => (
  <div className="p-4 text-center text-red-400 rounded-lg bg-gradient-to-br from-red-900/20 to-red-800/30 mx-2 shadow-inner">
    <p>{error}</p>
    <button
      onClick={onRetry}
      className="mt-3 text-blue-400 hover:text-blue-300 block mx-auto px-4 py-1.5 rounded-md border border-blue-500/50 hover:border-blue-400/70 hover:bg-blue-900/20 transition-all"
    >
      Try again
    </button>
  </div>
);

export const NoConversations = ({ searchQuery, onNewConversation }) => (
  <div className="p-6 text-center text-gray-400 flex flex-col items-center justify-center h-40 mt-8">
    {searchQuery ? (
      <>
        <div className="h-12 w-12 mb-3 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-300">No conversations match your search</p>
      </>
    ) : (
      <>
        <div className="h-12 w-12 mb-3 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
          <CirclePlus className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-300">No conversations yet</p>
        <button
          onClick={onNewConversation}
          className="mt-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-300 hover:to-indigo-300 font-medium transition-colors"
        >
          Start a new conversation
        </button>
      </>
    )}
  </div>
);