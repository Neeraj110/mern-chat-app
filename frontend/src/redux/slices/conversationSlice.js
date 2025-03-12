import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedConversation: sessionStorage.getItem("selectedConversation")
    ? JSON.parse(sessionStorage.getItem("selectedConversation"))
    : null,
};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      sessionStorage.setItem(
        "selectedConversation",
        JSON.stringify(action.payload)
      );
    },
  },
});

export const { setSelectedConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
