import React, { useState } from "react";
import { Settings, User, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import UserPopup from "./UserPopup";

function UserInfo() {
  const { user: currentUser } = useSelector((state) => state.user);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700/70 p-3 bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="flex items-center">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
          {currentUser?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="ml-3">
          <p className="font-medium text-sm">{currentUser.name || "User"}</p>
          <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500">
            Online
          </p>
        </div>
        <div className="ml-auto relative">
          <button
            onClick={() => setIsPopupOpen((prev) => !prev)}
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700/70 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <UserPopup onClose={() => setIsPopupOpen(false)} isOpen={isPopupOpen} />
      )}
    </div>
  );
}

export { UserInfo };
