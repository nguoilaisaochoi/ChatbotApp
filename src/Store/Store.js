import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Reducer/UserReducer";
import ChatReducer from "../Reducer/ChatReducer";


export const store = configureStore({
  reducer: {
    user: UserReducer,
    chat: ChatReducer,
  },
});
