import React, { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { User, Mail, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/api/auth/profile");
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-screen mx-auto p-4 md:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Back
      </button>
      <div className="rounded-lg shadow-xl overflow-hidden bg-gray-800/80 backdrop-blur-md border border-gray-700">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-36"></div>

        <div className="relative px-6 pb-6">
          <div className="absolute -top-16 left-6 border-4 border-indigo-500 rounded-full shadow-lg">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          <div className="pt-20">
            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center text-gray-300">
                <Mail className="mr-2 text-indigo-400" size={18} />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="mr-2 text-green-400" size={18} />
                <span>Joined {formatDate(profile.createdAt)}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MessageSquare className="mr-2 text-yellow-400" size={18} />
                <span>{profile.conversations} Conversations</span>
              </div>
              <div className="flex items-center text-gray-300">
                <User className="mr-2 text-pink-400" size={18} />
                <span>Last updated {formatDate(profile.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
