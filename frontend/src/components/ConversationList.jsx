import React, { useState, useEffect, useCallback } from "react";
import { AddConversationPopup } from "./AddConversationPopup";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../utils/axios";
import { UserInfo } from "./sub-Components/UserInfo";
import { setSelectedConversation } from "../redux/slices/conversationSlice";
import { ConversationHeader } from "./sub-Components/ConversationHeader";
import { SearchBar } from "./sub-Components/SearchBar";
import { NewConversationButton } from "./sub-Components/NewConversationButton";
import { LoadingSpinner } from "./sub-Components/ConversationListStates";
import { ErrorMessage } from "./sub-Components/ConversationListStates";
import { NoConversations } from "./sub-Components/ConversationListStates";
import { ConversationItem } from "./sub-Components/ConversationItem";

function ConversationList({ onClose }) {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!currentUser || !currentUser._id) {
        throw new Error("User not authenticated");
      }

      const { data } = await axiosInstance.get(`/api/chat/conversations`);
      setConversations(data?.conversations || []);
    } catch (error) {
      setError(error.message || "Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    onClose();
  };

  const handleConversationCreated = () => {
    fetchConversations();
  };

  const filteredConversations = conversations.filter((conversation) => {
    const conversationName = conversation.participants?.name;
    return conversationName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full w-full sm:w-80 flex flex-col bg-gray-900 text-white overflow-hidden border-r border-gray-800">
      <ConversationHeader onClose={onClose} />

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <NewConversationButton onClick={() => setIsPopupOpen(true)} />

      <div className="flex-1 overflow-y-auto py-2 px-3 pb-20 space-y-2">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage error={error} onRetry={fetchConversations} />
        ) : filteredConversations.length === 0 ? (
          <NoConversations
            searchQuery={searchQuery}
            onNewConversation={() => setIsPopupOpen(true)}
          />
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                onSelect={() => handleSelectConversation(conversation)}
                isSelected={conversation._id === selectedConversation?._id}
              />
            ))}
          </div>
        )}
      </div>

      <UserInfo />

      <AddConversationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}

export default ConversationList;
