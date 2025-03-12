import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { useSelector } from "react-redux";
import { useSocket } from "../Socket/useSocketContext";
import {
  ChatHeader,
  TypingIndicator,
  MessageBubble,
} from "./sub-Components/ChatComponets";
import { Send } from "lucide-react";

function ChatWindow({ onClose }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { socket, isUserOnline } = useSocket();
  const messageEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const isParticipantOnline =
    selectedConversation?.participants?._id &&
    isUserOnline(selectedConversation.participants._id);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    if (!selectedConversation?._id) return;

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(
        `/api/chat/${selectedConversation._id}`
      );
      setMessages(data?.messages || []);
      if (socket) {
        socket.emit("joinConversation", selectedConversation._id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedConversation, socket]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        // Avoid duplicates by checking message ID
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleTyping = ({ userId, isTyping }) => {
      if (userId === selectedConversation.participants._id) {
        setIsTyping(isTyping);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
    };
  }, [socket, selectedConversation]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (socket && selectedConversation?._id) {
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        userId: user._id,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      !newMessage.trim() ||
      !socket ||
      !selectedConversation?._id ||
      isSending
    )
      return;

    try {
      setIsSending(true);
      socket.emit("sendMessage", {
        conversationId: selectedConversation._id,
        senderId: user._id,
        receiverId: selectedConversation.participants._id,
        text: newMessage.trim(),
      });
      setNewMessage("");
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        userId: user._id,
        isTyping: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessages = useCallback(() => {
    if (!messages.length) return [];

    const groupedMessages = messages.reduce((groups, message) => {
      const date = new Date(message.createdAt).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    }, {});

    return Object.entries(groupedMessages).flatMap(([date, msgs]) => [
      { id: `date-${date}`, type: "date", date },
      ...msgs,
    ]);
  }, [messages]);

  const formattedMessages = formatMessages();

  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 h-full">
      <ChatHeader
        conversation={selectedConversation}
        isOnline={isParticipantOnline}
        onClose={onClose}
      />
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-2xl md:max-w-3xl mx-auto space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            formattedMessages.map((item) =>
              item.type === "date" ? (
                <div
                  key={item.id}
                  className="flex items-center justify-center my-4"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ) : (
                <MessageBubble
                  key={item._id}
                  message={item}
                  currentUserId={user._id}
                />
              )
            )
          )}
          {isTyping && <TypingIndicator />}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form
          onSubmit={handleSendMessage}
          className="max-w-2xl md:max-w-3xl mx-auto"
        >
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow border border-gray-200 dark:border-gray-700 px-4 py-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className={`ml-2 p-2 rounded-full ${
                newMessage.trim() && !isSending
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
