import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("selectedConversation");
    },
  },
});

export const { setCredential, logout } = userSlice.actions;

export default userSlice.reducer;
