import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { axiosInstance } from "../../utils/axios";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";

function UserPopup({ onClose }) {
  const navigate = useNavigate();
  const distpatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      distpatch(logout());
      window.location.reload();
      navigate("/login");
      onClose();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="absolute bottom-full right-0 mb-2 w-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg border border-gray-700/50">
      <button
        className="w-full flex items-center px-3 py-2 text-sm text-gray-200 hover:bg-blue-900/20 rounded-t-lg"
        onClick={() => {
          onClose();
          navigate("/profile");
        }}
      >
        <User size={16} className="mr-2 text-blue-400" />
        Profile
      </button>
      <button
        className="w-full flex items-center px-3 py-2 text-sm text-gray-200 hover:bg-red-900/20 rounded-b-lg"
        onClick={() => {
          handleLogout();
        }}
      >
        <LogOut size={16} className="mr-2 text-red-400" />
        Logout
      </button>
    </div>
  );
}

export default UserPopup;
