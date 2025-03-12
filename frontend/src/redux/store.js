import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import conversationReducer from "./slices/conversationSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
  },
});

export default store;
