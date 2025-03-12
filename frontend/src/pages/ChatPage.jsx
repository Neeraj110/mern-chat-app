import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatWindow from "../components/ChatWindow";
import ConversationList from "../components/ConversationList";
import { AlignLeft, MessageCircleMore, X } from "lucide-react";

function ChatPage() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedConversation && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [selectedConversation]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:relative md:block z-30 h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? "left-0 w-80" : "-left-full w-0 md:left-0 md:w-80"}`}
      >
        <div className="h-full">
          <ConversationList onClose={() => setSidebarOpen(false)} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col w-full relative">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 z-10 md:hidden bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
            aria-label="Open conversations"
          >
            <AlignLeft size={20} />
          </button>
        )}

        {selectedConversation ? (
          <div className="flex flex-col h-full">
            <ChatWindow onClose={toggleSidebar} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MessageCircleMore className="h-16 w-16 mb-4 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              No Conversation Selected
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Select an existing conversation or start a new one
            </p>
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="md:hidden mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                aria-label="View conversations"
              >
                View Conversations
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ChatPage;
