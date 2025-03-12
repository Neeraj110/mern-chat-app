import { Search, X } from "lucide-react";

export const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="px-4 py-3 sticky top-16 bg-gradient-to-b from-gray-900 to-gray-900/95 z-10 border-b border-gray-800">
    <div className="relative">
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gradient-to-r from-gray-800/80 to-gray-800/90 text-white placeholder-gray-400 rounded-full px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition-all border border-gray-700/50"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-white hover:bg-gray-700/70 p-1 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  </div>
);