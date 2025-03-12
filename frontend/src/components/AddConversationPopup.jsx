import React, { useState, useEffect } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { useSelector } from "react-redux";

function AddConversationPopup({ isOpen, onClose, onConversationCreated }) {
  const { user: currentUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await axiosInstance.get("/api/auth/get-user");
      setUsers(data.users || []);
    } catch (error) {
      setError(error.message || "Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setIsLoading(true);

      for (const user of selectedUsers) {
        await axiosInstance.post("/api/chat/create-conversation", {
          senderId: currentUser._id,
          receiverId: user._id,
        });
      }

      if (onConversationCreated) {
        onConversationCreated();
      }

      setSelectedUsers([]);
      setSearchQuery("");
      onClose();
    } catch (error) {
      console.error("Error creating conversation", error);
      setError("Failed to create conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">New Conversation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-400 text-sm">Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => toggleUserSelection(user)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                    selectedUsers.some((u) => u._id === user._id)
                      ? "bg-blue-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={
                      user?.avatar ||
                      `https://avatar.iran.liara.run/username?username=${user.name}`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="flex flex-col font-medium text-[1rem] text-white">
                    {user.name}
                    <span className="text-gray-500 text-[.8rem]">
                      {user.email}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                {users.length === 0
                  ? "No users available"
                  : `No users found matching "${searchQuery}"`}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white focus:outline-none mr-2"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0 || isLoading}
            className={`px-4 py-2 text-sm rounded-lg font-medium flex items-center gap-2 ${
              selectedUsers.length > 0 && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <UserPlus size={16} />
            )}
            Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
}

export { AddConversationPopup };
